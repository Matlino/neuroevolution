/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function(up, left, right, down) {
	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false;
		
	var onKeyDown = function(e) {
		var that = this,
			//c = e.keyCode; //klavesy v cislach
            c = String.fromCharCode(e.keyCode);
		switch (c) {
			// Controls
			case "A": // Left
				that.left = true;
				break;
			case "W": // Up
				that.up = true;
				break;
			case "D": // Right
				that.right = true; // Will take priority over the left key
				break;
			case "S": // Down
				that.down = true;
				break;
		};
	};
	
	var onKeyUp = function(e) {
		var that = this,
        //c = e.keyCode; //klavesy v cislach
            c = String.fromCharCode(e.keyCode);
		switch (c) {
			case "A": // Left
				that.left = false;
				break;
			case "W": // Up
				that.up = false;
				break;
			case "D": // Right
				that.right = false;
				break;
			case "S": // Down
				that.down = false;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};