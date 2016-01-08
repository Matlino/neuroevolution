var bg = new Image();
bg.src = "images/space.jpg";
var players = [];

var ctx,			// Canvas rendering context
    keys,			// Keyboard input
    localPlayer,	// Local player
    remotePlayers,
    socket;

var canvasWidth;
var canvasHeight;


function initCanvas(){
    ctx = document.getElementById("myCanvas").getContext("2d");
    canvasWidth = ctx.canvas.width;
    canvasHeight = ctx.canvas.height;

    socket = io.connect();

    function background(){
        this.x = 0;
        this.y = 0;
        this.width = bg.width;
        this.height = bg.height;
        this.render = function(){
            ctx.drawImage(bg, this.x--, this.y);
            if (this.x <= -499){
                this.x = 0;
            }
        }
    }


    var player = new Player(50,50,100,100);


    var background = new background();


    //function animate(){
    //    ctx.save();
    //    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    //
    //    //background.render();
    //    console.log(players.length);
    //    for (i = 0; i < players.length; i++){
    //        players[i].render();
    //    }
    //
    //    //ctx.rotate(-.3);
    //    ctx.restore();
    //}
    //
    //var animateInterval = setInterval(animate, 30);

    var delta = 5;
    document.addEventListener('keydown', function(event){
       var key_press = String.fromCharCode(event.keyCode);
        //alert(event.keyCode+" "+key_press);

        if (key_press == "W"){
            player.y -= delta;
        }
        if(key_press == "S"){
            player.y += delta;
        }
        if(key_press == "A"){
            player.x -= delta;
        }
        if(key_press == "D"){
            player.x += delta;
        }

        //socket.emit('coordinates',{x: player.x, y: player.y});
    });

    //listener for clicking on caanvas
    //ctx.canvas.addEventListener('click', function(event){
    //    clearInterval(animateInterval);
    //});

    var startX = Math.round(Math.random()*(canvasWidth-5)),
        startY = Math.round(Math.random()*(canvasHeight-5));

    localPlayer = new Player(startX, startY);

    keys = new Keys();
    remotePlayers = [];

    setEventHandlers();

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);

    var animateInterval = setInterval(animate, 30);
    //animate();
}


function onSocketConnected() {
    console.log("Connected to socket server");

    //tell server to create my player object
    socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);

    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
}

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
}

function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    }

    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}


var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        id,
        moveAmount = 2;

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var update = function(keys) {
        var prevX = x,
            prevY = y;
        // Up key takes priority over down
        if (keys.up) {
            y -= moveAmount;
        } else if (keys.down) {
            y += moveAmount;
        }

        // Left key takes priority over right
        if (keys.left) {
            x -= moveAmount;
        } else if (keys.right) {
            x += moveAmount;
        }

        return (prevX != x || prevY != y) ? true : false;
    };

    var draw = function(ctx) {
        ctx.fillRect(x-5, y-5, 10, 10);
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        update: update,
        draw: draw
    }
};

var setEventHandlers = function() {
    // Keyboard
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    // Window resize
    window.addEventListener("resize", onResize, false);
};
// Keyboard key down
function onKeydown(e) {
    if (localPlayer) {
        keys.onKeyDown(e);
    }
}

// Keyboard key up
function onKeyup(e) {
    if (localPlayer) {
        keys.onKeyUp(e);
    }
}

// Browser window resize
function onResize(e) {
    // Maximise the canvas

    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
}


/**************************************************
 ** GAME ANIMATION LOOP
 **************************************************/
function animate() {
    update();
    draw();

    // Request a new animation frame using Paul Irish's shim
    //window.requestAnimFrame(animate);
}

/**************************************************
 ** GAME UPDATE
 **************************************************/
function update() {
    if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
    }
}

/**************************************************
 ** GAME DRAW
 **************************************************/
function draw() {
    // Wipe the canvas clean
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw the local player
    localPlayer.draw(ctx);

    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    }
}


function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    }

    return false;
}









//testing some shapes and graphics, not using now
function drawShapes(){
    var leather = new Image();
    leather.src = "images/leather.jpg";

    var c = document.getElementById("myCanvas");

    //check if ur browesr can display canvas
    if (c.getContext){

        var ctx = c.getContext("2d");

        //ctx.font = "30px Arial";
        //ctx.fillText("Hello World",10,30);
        var g1 = ctx.createLinearGradient(0,0,200,0);
        g1.addColorStop(0,"magenta");
        g1.addColorStop(0.5,"yellow");
        g1.addColorStop(1,"black");

        //ctx.fillStyle = "rgba(0,200,0,1)";
        ctx.fillStyle = g1;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctx.fillRect(0,0,200,200);
        ctx.strokeRect(0,0,200,200);
        //ctx.clearRect();
        //alert(ctx.canvas.id+" "+ctx.canvas.width+" "+ctx.canvas.height);

        var g2 = ctx.createRadialGradient(350,100,0,350,100,200);
        g2.addColorStop(0,"pink");
        g2.addColorStop(0.5,"blue");
        g2.addColorStop(1,"orange");

        //ctx.fillStyle = "rgba(0,200,0,1)";
        ctx.fillStyle = g2;

        ctx.strokeStyle = "green";
        ctx.lineWidth = 5;
        ctx.fillRect(250,0,200,200);
        ctx.strokeRect(250,0,200,200);

        var pattern = ctx.createPattern(leather,"repeat"); //repeat-x
        ctx.fillStyle = "yellow";
        ctx.fillRect(0,250,200,200);
        ctx.setLineDash([10,2]);
        ctx.miterLimit = 3;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";

        ctx.lineDashOffset = 10;
        ctx.getLineDash();



        ctx.strokeRect(0,250,200,200);
        ctx.fill();

    }
}