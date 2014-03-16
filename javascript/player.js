var Player = function(world, xPos, yPos, tileSize, currentTile, stringGraphics){
	this.tileSize = tileSize;
	this.hp = 3;
	this.oxygen = 100;
	this.world = world;
	this.xPos = xPos;
	this.yPos = yPos;
	this.graphics = stringGraphics;
	this.id = world.id;
	this.currentTile = currentTile;
	this.numTilesAcross = this.world.numTilesAcross;
	//this.name = name;

	this.moveDirectionMovement = {
		"LEFT" : [this.tileSize, 0],
		"RIGHT" : [-this.tileSize, 0],
		"UP" : [0, this.tileSize],
		"DOWN" : [0, -this.tileSize]
	};

	this.moveDirection = {
		"LEFT" : -1,
		"RIGHT" : 1,
		"UP" : - this.numTilesAcross,
		"DOWN" : this.numTilesAcross
	};	

	this.graphicsOffsetX = 0;
	this.graphicsOffsetY = 0;

};

Player.prototype.initOxygen = function(){
	var self = this;
	this.oxygen = new Oxygen(100, this.id);
	this.oxygen.startCountdown(function(){
		console.log("Halfway mark");
		self.world.reportStress();
	},

	function(){
		self.world.reportDead();
	});
};


Player.prototype.useSonar = function(){
	var sonar = new Sonar(this.xPos, this.yPos, 16, 20, 'sonar');
	sonar.draw();
};

Player.prototype.checkMove = function(dir){
	
	if(this.world.allTiles[this.currentTile + dir].type != 'wall'){
		return true;
	}
	return false;

};

Player.prototype.move = function(dir){

	var mDir;
	if(dir == this.moveDirection.LEFT){
		this.graphicsOffsetX = this.tileSize;
		this.graphicsOffsetY = 0;
		mDir = this.moveDirectionMovement.LEFT;
	}
	else if(dir == this.moveDirection.RIGHT){
		this.graphicsOffsetX = 0;
		this.graphicsOffsetY = 0;
		mDir = this.moveDirectionMovement.RIGHT;
	}
	else if(dir == this.moveDirection.UP){
		this.graphicsOffsetX = this.tileSize;
		this.graphicsOffsetY = this.tileSize;
		mDir = this.moveDirectionMovement.UP;
	}
	else if(dir == this.moveDirection.DOWN){
		this.graphicsOffsetX = 0;
		this.graphicsOffsetY = this.tileSize;
		mDir = this.moveDirectionMovement.DOWN;
	}

	if(this.checkMove(dir)){
		this.currentTile += dir;
		//console.log("Player: " + this.id + " currentTile is: " + this.currentTile);

		this.world.moveWorld(mDir);
	}
};

Player.prototype.draw = function(context){
	context.drawImage(imageMgr.getImage(this.graphics), this.graphicsOffsetX, this.graphicsOffsetY, 
					  this.tileSize, this.tileSize,
					  this.xPos, this.yPos, this.tileSize, this.tileSize);
};