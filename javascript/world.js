var World = function(game, id){

	this.player;
	this.game = game;

	this.canvasCenter = {
		"x" : this.game.canvasW / 2 - this.game.tileSize / 2,
		"y" : this.game.canvasH / 2 - this.game.tileSize / 2
	}

	this.tileSize = this.game.tileSize;
	this.numTilesAcross = this.game.numTilesAcross;

	this.walls = [];
	this.floors = [];
	this.allTiles = [];
	this.id = id;
	
};

World.prototype.loadWorld = function(levelData){
	this.numAllTiles = levelData.length;

	for(var i = 0; i < levelData.length; i++){
		var tile;
		if(levelData[i] == true){
			//id, xPos, yPos, width, height, graphics name
			tile = new Tile(i, i % this.numTilesAcross * this.tileSize, Math.floor(i/this.numTilesAcross) * 
							this.tileSize, this.tileSize, 'floor');
			this.floors.push(tile);
		}
		else if(levelData[i] == false){
			tile = new Tile(i, i % this.numTilesAcross * this.tileSize,
							Math.floor(i/this.numTilesAcross) * this.tileSize, this.tileSize, 'wall')
			this.walls.push(tile);
		}
		//An array with all tiles for reference to where in the game world the player se trouve
		this.allTiles.push(tile);
	}	


	this.setRandomMapStartTile();
};

World.prototype.setRandomMapStartTile = function(){
	var range = this.floors.length - 0;
	var rand = Math.floor(Math.random() * range);


	var zeroPosX = this.floors[rand].xPos;
	var zeroPosY = this.floors[rand].yPos;
	console.log("startXPos: " + zeroPosX);

	this.player = new Player(this, this.canvasCenter.x, this.canvasCenter.y,
	                         this.tileSize, this.floors[rand].id, "player");


	for(var i = 0; i < this.walls.length; i++){
		this.walls[i].xPos += this.player.xPos - zeroPosX;
		this.walls[i].yPos += this.player.yPos - zeroPosY;
	}
	for(var i = 0; i < this.floors.length; i++){
		this.floors[i].xPos += this.player.xPos - zeroPosX;
		this.floors[i].yPos += this.player.yPos - zeroPosY;
	}

};

World.prototype.moveWorld = function(dir){
	for(var i = 0; i < this.walls.length; i++){
		this.walls[i].xPos += dir[0];
		this.walls[i].yPos += dir[1];
	}
	for(var i = 0; i < this.floors.length; i++){
		this.floors[i].xPos += dir[0];
		this.floors[i].yPos += dir[1];
	}
};

World.prototype.draw = function(context, world2){
	// helper function to iterate over all elems on board and draw
    var drawElements = function(arr, context){
        for (var i = 0; i < arr.length; i++) {
            arr[i].draw(context);
        }
    };
    var otherPlayer = world2.player;
    context.drawImage(imageMgr.getImage('player'), otherPlayer.graphicsOffset, 0,
    				  this.tileSize, this.tileSize, this.allTiles[otherPlayer.currentTile].xPos, 
    				  this.allTiles[otherPlayer.currentTile].yPos, this.tileSize, this.tileSize);
    context.drawImage(imageMgr.getImage("stars"), 0, 0, this.game.canvasW, this.game.canvasH);
    //drawElements(this.floors, context);
    drawElements(this.walls, context);
    this.player.draw(context);

};