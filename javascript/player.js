var Player = function(world, xPos, yPos, tileSize, stringGraphics){
	this.tileSize = tileSize;
	this.hp = 3;
	this.oxygen = 100;
	this.world = world;
	this.xPos = xPos;
	this.yPos = yPos;
	this.graphics = stringGraphics;
	this.id;
	//this.currentTile = currentTile;
	//this.name = name;

	this.moveDirection = {
		"LEFT" : [this.tileSize, 0],
		"RIGHT" : [-this.tileSize, 0],
		"UP" : [0, this.tileSize],
		"DOWN" : [0, -this.tileSize]
	};	

	this.graphicsOffset = 0;

};


Player.prototype.setupEventListener = function(keyUP, keyDOWN, keyRIGHT, keyLEFT){
	var self = this;

	window.addEventListener("keydown", function(evt){
		//up
		if(evt.keyCode == keyUP){
			self.move(self.moveDirection.UP);
			console.log("Moving player in world: " + self.world.id);
		}
		//down
		if(evt.keyCode == keyDOWN){
			self.move(self.moveDirection.DOWN);
		}
		//left
		if(evt.keyCode == keyLEFT){
			self.move(self.moveDirection.LEFT);
		}
		//right
		if(evt.keyCode == keyRIGHT){
			self.move(self.moveDirection.RIGHT);
		}
	});
};

Player.prototype.checkMove = function(dir){
	var prospectiveXPos = this.xPos - dir[0];
	var prospectiveYPos = this.yPos - dir[1];


	for(var i = 0; i < this.world.walls.length; i++){
		if(this.world.walls[i].xPos == prospectiveXPos &&
			this.world.walls[i].yPos == prospectiveYPos){
			return false;
		}
	}
	return true;
};

Player.prototype.move = function(dir){

	if(dir == this.moveDirection.LEFT)
		this.graphicsOffset = 0;
	if(dir == this.moveDirection.RIGHT)
		this.graphicsOffset = this.tileSize;

	if(this.checkMove(dir)){
		this.world.moveWorld(dir);
	}
};

Player.prototype.draw = function(context){
	//context.drawImage(imageMgr.getImage(this.graphics), this.xPos, this.yPos, this.tileSize, this.tileSize);
	context.drawImage(imageMgr.getImage(this.graphics), this.graphicsOffset, 0, this.tileSize, this.tileSize,
	this.xPos, this.yPos, this.tileSize, this.tileSize);
};