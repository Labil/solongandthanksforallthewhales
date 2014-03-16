var Sonar = function(startX, startY, size, numSpheres, stringGraphics){
	this.xPos = startX;
	this.yPos = startY;
	this.size = size;
	this.graphics = stringGraphics;
	this.numberOfSpheres = numSpheres;
	this.spiralExpConst = 0.1;
};

Sonar.prototype.draw = function(context){
	
	for(var i = 0; i < this.numberOfSpheres; i++){
		for(var t = 0; t < 200; t+=1){
			this.xPos = this.genX(t);
			this.yPos = this.genY(t);
			context.drawImage(imageMgr.getImage(this.graphics), this.xPos, this.yPos, this.size, this.size);
		}
	}
};

Sonar.prototype.genX = function(t){
	return this.spiralExpConst * t * Math.cos(t);
};
Sonar.prototype.genY = function(t){
	return this.spiralExpConst * t * Math.sin(t);
};
