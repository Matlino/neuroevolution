var util = require("util");

var players;
Player = require("./Player").Player;

module.exports = {
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
        this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

        //send existing players info to the new player
        var i, existingPlayer;
        util.log("Length of players array: "+players.length);
        for (i = 0; i < players.length; i++) {

            existingPlayer = players[i];
            util.log("Send info about player: "+this.id + " to the new player");
            this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
        }

        //add new player to array of players
        players.push(newPlayer);

        util.log("New player has been created");
    },

    onMovePlayer: function (data) {
        var movePlayer = playerById(this.id);

        if (!movePlayer) {
            util.log("Player not found: "+this.id);
            return;
        }

        movePlayer.setX(data.x);
        movePlayer.setY(data.y);

        this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
    },

    init: function() {
        players = [];
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