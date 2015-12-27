function draw(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText("Hello World",10,30);
}

jQuery(function($){
    console.log("CYOLOalamada");
    var socket = io.connect();
    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickname');

    var $messageBox = $('#message');
    var $messageForm = $('#send-message');
    var $chat = $('#chat');

    var $users = $('#users');

    $nickForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user',$nickBox.val(), function(data){
            if (data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html('That username is already taken! Try again.');
            }
        });
        $nickBox.val('');
    });

    socket.on('usernames', function(data){
        var html = '';
        for (i=0; i<data.length; i++){
            html += data[i] + '<br/>';
        }
        $users.html(html);
    });

    $messageForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message',$messageBox.val(), function(data){
            //user didnt put name to whisper or woring name
            $chat.append('<span class="error ">' + data + "</span><br/>");
        });
        //aj taketo veci mozes posielat akoze objekt
        //socket.emit('send message',{name: "matlo", msg: message.val()});
        $messageBox.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<span class="msg"> <b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
        $chat.scrollTop = $chat.bottom;
    });

    socket.on('whisper', function (data) {
        $chat.append('<span class="whisper"> <b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
    });
});