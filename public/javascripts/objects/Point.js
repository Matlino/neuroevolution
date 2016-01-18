function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype = {
    getX : function() {
        return this.x;
    },

    getY : function() {
        return this.y;
    },

    setX : function(newX) {
        this.x = newX;
    },

    setY : function(newY) {
        this.y = newY;
    }
};


if(typeof module != "undefined")
    module.exports = Point;