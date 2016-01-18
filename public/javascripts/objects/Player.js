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

    //every deer has 4 eyes, and every eye returns average distances to food
    this.getEyesValues = function(food){
        var topEye = new Point(this.x, this.y - this.sizeY/2);
        var rightEye = new Point(this.x + this.sizeX/2, this.y);
        var bottomEye = new Point(this.x, this.y + this.sizeY/2);
        var leftEye = new Point(this.x - this.sizeX/2, this.y);

        var topEyeSum = 0, rightEyeSum = 0, bottomEyeSum = 0, leftEyeSum = 0;
        var topEyeFoodCount = 0, rightEyeFoodCount = 0, bottomEyeFoodCount = 0, leftEyeFoodCount = 0;
        var minDistance, newDistance;
        var eyeFlag; //0 = top, 1 = right, 2 = bottom, 3 = left

        for (var i=0;i<food.length;i++){
            minDistance = 0;

            minDistance = getDistance(topEye, food[i]);
            eyeFlag = 0;

            newDistance = getDistance(rightEye, food[i]);
            if (newDistance < minDistance){
                minDistance = newDistance;
                eyeFlag = 1;
            }

            newDistance = getDistance(bottomEye, food[i]);
            if (newDistance < minDistance){
                minDistance = newDistance;
                eyeFlag = 2;
            }

            newDistance = getDistance(leftEye, food[i]);
            if (newDistance < minDistance){
                minDistance = newDistance;
                eyeFlag = 3;
            }

            switch (eyeFlag){
                case 0 : {
                    topEyeSum += minDistance;
                    topEyeFoodCount++;
                } break;

                case 1 : {
                    rightEyeSum += minDistance;
                    rightEyeFoodCount++;
                } break;

                case 2 : {
                    bottomEyeSum += minDistance;
                    bottomEyeFoodCount++;
                } break;

                case 3 : {
                    leftEyeSum += minDistance;
                    leftEyeFoodCount++;
                } break;
            }
        }

        var eyesValues = [];
        eyesValues.push((topEyeSum / topEyeFoodCount) || 0);
        eyesValues.push((rightEyeSum / rightEyeFoodCount) || 0);
        eyesValues.push((bottomEyeSum / bottomEyeFoodCount) || 0);
        eyesValues.push((leftEyeSum / leftEyeFoodCount) || 0);



        //console.log(topEye.getX() + " " + topEye.getY());
        //console.log(this.x + " " + this.y);
        //console.log(topEyeSum / topEyeFoodCount + " " + rightEyeSum / rightEyeFoodCount + " " + bottomEyeSum / bottomEyeFoodCount);
        //console.log(topEyeFoodCount + " " + rightEyeFoodCount + " " + bottomEyeFoodCount + " " + leftEyeFoodCount);

        return eyesValues;
    }
}


function getDistance(a, b){
    return Math.sqrt(Math.pow(Math.abs(a.getX() - b.getX()), 2) + Math.pow(Math.abs(a.getY() - b.getY()), 2));
}

if(typeof module != "undefined")
    module.exports = Player;


