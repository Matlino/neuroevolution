function Object2D(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.sizeX = 10;
    this.sizeY = 10;
}

Object2D.prototype = {
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
    },

    getSizeX : function() {
        return this.sizeX;
    },

    getSizeY : function() {
        return this.sizeY;
    },

    setSizeX : function(newSizeX) {
        this.sizeX = newSizeX;
    },

    setSizeY : function(newSizeY) {
        this.sizeY = newSizeY;
    }
};


if(typeof module != "undefined")
    module.exports = Object2D;