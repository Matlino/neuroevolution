//same as export, this will run only on server side
if(typeof module != "undefined"){
    Object2D = require("./Object2D");
}

Food.prototype = Object.create(Object2D.prototype);

function Food(startX, startY) {
    Object2D.call(this, startX, startY);

    this.draw = function(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x-5, this.y-5, this.sizeX, this.sizeY);
    };
}

//will export class only on server side, on client side everything is global
// alternative which caused error - && module && module.exports
if(typeof module != "undefined")
    module.exports = Food;