//this mean Player extend Object2D
if(typeof module != "undefined") {
    Object2D = require("./Object2D");
}

Player.prototype = Object.create(Object2D.prototype);

function Player(startX, startY) {
    //call constructor of Object2D
    Object2D.call(this, startX, startY);

    this.id = 0;
    this.moveAmount = 2;


    this.update = function(keys){

        var prevX = this.x,
            prevY = this.y;
        // Up key takes priority over down
        if (keys.up) {
            this.y -= this.moveAmount;
        } else if (keys.down) {
            this.y += this.moveAmount;
        }

        // Left key takes priority over right
        if (keys.left) {
            this.x -= this.moveAmount;
        } else if (keys.right) {
            this.x += this.moveAmount;
        }

        return (prevX != this.x || prevY != this.y) ? true : false;
    };

   this.draw = function(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x-5, this.y-5, this.sizeX, this.sizeY);
    };
}

if(typeof module != "undefined")
    module.exports = Player;


