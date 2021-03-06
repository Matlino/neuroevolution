var util = require("util");

var config = require('../config');
var Player = require("../public/javascripts/objects/Player");
var Food = require("../public/javascripts/objects/Food");
var Deer = require("../public/javascripts/objects/Deer");
var neuralNet = require('../server/neuralNet.js');

var players;
var food;
var deers;

module.exports = {
    init: function() {
        players = [];
        food = [];
        deers = [];

        var startX, startY, newNeuralNetwork;

        for(var i=0;i<config.foodCount;i++){
            startX = Math.round(Math.random()*(config.canvasWidth-5));
            startY = Math.round(Math.random()*(config.canvasHeight-5));
            food.push(new Food(startX, startY));
        }

        for(i=0;i<config.deerCount;i++){
            startX = Math.round(Math.random()*(config.canvasWidth-5));
            startY = Math.round(Math.random()*(config.canvasHeight-5));
            newNeuralNetwork = neuralNet.neuralNetworkToJSON(neuralNet.createNetwork());
            deers.push(new Deer(startX, startY, newNeuralNetwork));
        }
    },

    onClientDisconnect: function(){
        util.log("Player has disconnected: "+this.id);

        var removePlayer = playerById(this.id);

        if (!removePlayer) {
            util.log("Player not found: "+this.id);
            return;
        }

        players.splice(players.indexOf(removePlayer), 1);
        this.broadcast.emit("remove player", {id: this.id});
    },

    onNewPlayer: function (data) {
        //create new player
        var newPlayer = new Player(data.x, data.y);
        newPlayer.id = this.id;

        //send new player info to other players
        this.broadcast.emit("new_player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

        //send existing players info to the new player
        var i, existingPlayer;
        util.log("Length of players array: "+players.length);
        for (i = 0; i < players.length; i++) {
            existingPlayer = players[i];
            this.emit("new_player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
        }

        //add new player to array of players
        players.push(newPlayer);

        util.log("New player has been created");

        //send  food and deers to client
        this.emit("food", food);
        this.emit("deers", deers);

        util.log("Deers and food has been send to new player");

    },

    onMovePlayer: function (data) {
        var movePlayer = playerById(this.id);

        if (!movePlayer) {
            util.log("Player not found: "+this.id);
            return;
        }

        movePlayer.setX(data.x);
        movePlayer.setY(data.y);

        this.broadcast.emit("move_player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});

    },

    //TO DO
    onUpdateFood: function(data){

    },


    //throw eyesvalues into neural net and return direction which should deer move
    onEyesValues: function(data, callback){
        callback(neuralNet.activateNet(data));
        //util.log("Networks activated "+c++);
    },

    onMutation: function(deers,callback){
        if (deers.length > 0) {
            callback(neuralNet.mutation(deers));
        }
    }
};

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    }

    return false;
}