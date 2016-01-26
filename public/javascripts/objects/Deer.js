if(typeof module != "undefined") {
    Object2D = require("./Object2D");
}

Deer.prototype = Object.create(Object2D.prototype);

function Deer(startX, startY, neuralNetwork) {
    //call constructor of Object2D
    Object2D.call(this, startX, startY);

    this.id = 0;
    this.moveAmount = 2;
    this.neuralNetwork = neuralNetwork;

    this.draw = function(ctx) {
        ctx.fillStyle = "blue";
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

        //console.log("eyevalues: "+eyesValues);

        return eyesValues;
    };

    //direction 0 = top, 1 = right, 2 = bottom, 3 = left
    this.update = function(direction, canvasWidth, canvasHeight){
        //first check if the move is possible (if deer is not at the border)
        //if deer is behind border inc his movement variable, this is not final solution and should be changed
        //TO DO
        //switch (direction){
        //    case 0 : {
        //        if (this.y - this.moveAmount - this.sizeY/2 < 0){
        //            direction = (direction + 1) % 4;
        //        }
        //    } break;
        //    case 1 : {
        //        if (this.x + this.moveAmount + this.sizeX/2 > canvasWidth){
        //            direction = (direction + 1) % 4;
        //        }
        //    } break;
        //    case 2 :{
        //        if (this.y + this.moveAmount + this.sizeY/2 > canvasHeight){
        //            direction = (direction + 1) % 4;
        //        }
        //    }  break;
        //    case 3 : {
        //        if (this.x - this.moveAmount - this.sizeX/2 < 0){
        //            direction = (direction + 1) % 4;
        //        }
        //    } break;
        //}

        switch (direction){
            case 0 : this.y = ((this.y - this.moveAmount) + canvasHeight) % canvasHeight; break;
            case 1 : this.x = ((this.x + this.moveAmount) + canvasWidth) % canvasWidth; break;
            case 2 : this.y = ((this.y + this.moveAmount) + canvasHeight) % canvasHeight; break;
            case 3 : this.x = ((this.x - this.moveAmount) + canvasWidth) % canvasWidth; break;
        }
    };

    this.getNetwork = function(){
        return this.neuralNetwork;
    };

}

if(typeof module != "undefined")
    module.exports = Deer;


