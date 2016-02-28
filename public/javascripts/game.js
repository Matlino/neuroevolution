var bg = new Image();
bg.src = "images/space.jpg";

var ctx,			// Canvas rendering context
    keys,			// Keyboard input
    localPlayer,	// Local player
    remotePlayers,
    socket;

var canvasWidth;
var canvasHeight;
var food;
var deers;

var measureFitness

function initCanvas(){
    ctx = document.getElementById("myCanvas").getContext("2d");
    canvasWidth = ctx.canvas.width;
    canvasHeight = ctx.canvas.height;

    socket = io.connect();



    var startX = Math.round(Math.random()*(canvasWidth-5)),
        startY = Math.round(Math.random()*(canvasHeight-5));

    localPlayer = new Player(startX, startY);

    keys = new Keys();

    //init arrays
    remotePlayers = [];
    food = [];
    deers = [];

    setEventHandlers();

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);

    socket.on("food", displayFood);
    socket.on("deers", displayDeers);


    var animateInterval = setInterval(animate, 30);
    var sendNetwork = setInterval(updateNetwork, 1000);
    var decreaseHealh = setInterval(decreaseHealth, 1000);
    measureFitness = setInterval(fitness, 6000);

    //animate();
}

function fitness(){


    //sort deers by health
    deers.sort(function(a, b){
        return a.getHealth() - b.getHealth();
    });


  //  clearInterval(measureFitness);


}

function decreaseHealth(){
    //console.log("AAAAAAAAA");
    for (var i= 0; i < deers.length; i++ ) {
        deers[i].decreaseHealth();
        //console.log(deers[i].health);
        if (deers[i].isAlive() == false){
            deers.splice(i,1);
            i--;
        }
    }
    //console.log("\n")
}


function displayFood(data){
    for (var i=0;i<data.length; i++ ){
        food.push(new Food(data[i].x, data[i].y));
    }
}

function displayDeers(data){
    for (var i=0;i<data.length; i++ ){
        deers.push(new Deer(data[i].x, data[i].y, data[i].neuralNetwork));
    }
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
    }

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

    //localPlayer.getEyesValues(food);

    // Request a new animation frame using Paul Irish's shim
    //window.requestAnimFrame(animate);
}

/**************************************************
 ** GAME UPDATE
 **************************************************/
//checking collision function should ne in object file probably
//server should have probably his won update function where he check collision of all objects at once
function update() {
    if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});

        //chcek collision with food
        var playerSizeX = localPlayer.getSizeX();
        var playerSizeY = localPlayer.getSizeY();
        var playerX = localPlayer.getX();
        var playerY = localPlayer.getY();

        for (var i = 0; i < food.length; i++) {
            if ((playerX + playerSizeX / 2 >= food[i].getX() - food[i].getSizeX() / 2
                && playerX - playerSizeX / 2 <= food[i].getX() + food[i].getSizeX() / 2)
                && (playerY + playerSizeY / 2 >= food[i].getY() - food[i].getSizeY() / 2
                && playerY - playerSizeY / 2 <= food[i].getY() + food[i].getSizeY() / 2)) {
                food.splice(i, 1);
                socket.emit("food", food);
            }
        }
    }

    //collisions deers with food
    for (i= 0; i < deers.length; i++ ) {
        for (var j = 0; j < food.length; j++) {
            if ((deers[i].getX() + deers[i].getSizeX() / 2 >= food[j].getX() - food[j].getSizeX() / 2
                && deers[i].getX() - deers[i].getSizeX() / 2 <= food[j].getX() + food[j].getSizeX() / 2)
                && (deers[i].getY() + deers[i].getSizeY() / 2 >= food[j].getY() - food[j].getSizeY() / 2
                && deers[i].getY() - deers[i].getSizeY() / 2 <= food[j].getY() + food[j].getSizeY() / 2)) {
                food.splice(j, 1);
                socket.emit("food", food);

                deers[i].increaseHealth();
            }
        }
    }


    for (i= 0; i < deers.length; i++ ) {
        deers[i].update(canvasWidth, canvasHeight);
    }
}

function updateNetwork(){
    //console.log("Netwrok upadting");

    //send neural networks and eye values of deers to server
    var eyesValuesArray = [];
    var deerNetworks = [];
    for (var i= 0; i < deers.length; i++ ) {
        //eyesValuesArray.push(deers[i].getEyesValues(food));
        deerNetworks.push({eyesValues: deers[i].getEyesValues(food), neuralNetwork: deers[i].getNetwork()});
    }

    socket.emit("eyesvalues", deerNetworks, function(data){
        //console.log("Callback works, index: " + data);
        for (i= 0; i < deers.length; i++ ) {
            deers[i].setDirection(data[i]);
        }
    });
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

    for (i = 0; i < food.length; i++) {
        food[i].draw(ctx);
    }

    for (i = 0; i < deers.length; i++) {
        deers[i].draw(ctx);
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