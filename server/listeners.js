var util = require("util");
var gameServer = require("./gameServer");
var chatServer = require("./chatServer");

/**
 * In this file are server listeners.
 */

// this run the server init, but maybe it should be somewhere else
gameServer.init();

//we are calling this export in /bin/www.js so we can pass io as argument here
module.exports = function (io){
    io.sockets.on('connection',function(socket){

        util.log("New player has connected: "+socket.id);

        //chat listeners
        socket.on('send message', chatServer.onSendMessage);
        socket.on('new user', chatServer.onNewUser);
        socket.on('disconnect', chatServer.onDisconnect);


        //game listeners
        socket.on("disconnect", gameServer.onClientDisconnect);
        socket.on("new_player", gameServer.onNewPlayer);
        socket.on("move_player", gameServer.onMovePlayer);

        //evolution listeners
        socket.on("food", gameServer.onUpdateFood);
        socket.on("eyesvalues", gameServer.onEyesValues);
        socket.on("mutation", gameServer.onMutation);

    });
};


