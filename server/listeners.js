var util = require("util");
var gameServer = require("./gameServer");
var chatServer = require("./chatServer");

Player = require("./Player").Player;

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
        socket.on("new player", gameServer.onNewPlayer);
        socket.on("move player", gameServer.onMovePlayer);
    });
};


