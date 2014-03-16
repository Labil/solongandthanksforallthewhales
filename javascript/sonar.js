var Sonar = function(startX, startY, size, numSpheres, stringGraphics){
	this.xPos = startX;
	this.yPos = startY;
	this.size = size;
	this.graphics = stringGraphics;
	this.numberOfSpheres = numSpheres;
	this.radius = 10;

	
};

Sonar.prototype.draw = function(context){

	this.radius += 20;

	if(this.radius <= 4000){
		var colour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		context.strokeStyle = colour;
		context.beginPath();
		context.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, false);
		context.closePath();
		context.stroke();
	}
	
};



