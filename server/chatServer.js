var util = require("util");

var users = {};
var io = require("../bin/www");


module.exports = {
    onSendMessage: function(data, callback){
        //zmaze biele miesta
        var msg = data.trim();

        if (msg.substring(0,3) === '/w '){
            msg = msg.substring(3);
            var ind = msg.indexOf(' ');
            if (ind !== -1){
                var name = msg.substring(0,ind);
                msg = msg.substring(ind+1);
                if (name in users){
                    users[name].emit('whisper', {msg: msg, nick: this.nickname})
                    console.log("whisper");
                }else{
                    //name is not in the chat room
                    callback('Error: enter valid user');
                }
            }else{
                //user didnt put any message
                callback('Error: enter message to whisper');
            }
        }else{
            //posle uplne vsetkym
            io.sockets.emit('new message', {msg: msg, nick: this.nickname});
        }

        //posle vesetkym ale nie tomu od koho to prislo
        //socket.setBroadcast().emit('new message', data);
    },

    onNewUser: function(data, callback){
        //cekneme ci taky nick uz je v poli ak neni posleme false napsat
        if (data in users){
            callback(false);
            //callback({is valid: false}); aj taketo daco moooozes poslat
        }else{
            callback(true);
            //potom bude kazdy user ma toto tu ulozeene a dalje mozme pouzivta
            this.nickname = data;
            users[this.nickname] = this;
            //nicknames.push(socket.nickname);
            updateNicknames();
        }
    },

    //toto sa spusti vzdy ked neikto zatvoir web stranku moju
    onDisconnect: function(data){
        //ak nahodou sa odpojil ale este sai nezvolil meno
        if (!this.nickname) return;
        delete users[this.nickname];
        //toto vymaze meno usera
        //nicknames.splice(nicknames.indexOf(socket.nickname),1);
        updateNicknames();
    }

};

function updateNicknames(){
    io.sockets.emit('usernames', Object.keys(users)); //posle len mena userov co su kluce tej hashtabulky
}
