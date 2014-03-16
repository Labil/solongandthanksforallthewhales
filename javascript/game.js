(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//////////////////////////////////////////////////////

var imageMgr = new ImageManager();




var Game = function(difficulty){
	this.gameOver = false;
	this.difficulty = difficulty;
	console.log(this.difficulty);
};

Game.prototype.init = function(){
	this.tileSize = 96;
	this.numTilesAcross = 30;

	if(this.difficulty == "hard"){
		this.numTilesAcross = 50;
	}
	else if(this.difficulty == "normal"){
		this.numTilesAcross = 30;
	}
	else if(this.difficulty == "easy"){
		this.numTilesAcross = 20;
	}
	this.boardWidth = this.tileSize * this.numTilesAcross;

	this.walls = [];
	this.floors = [];
	this.numTiles;

	this.canvasW = window.innerWidth / 2 - 20;
	this.canvasH = window.innerHeight - 60;

	this.moveDirection = {
		"LEFT" : -1,
		"RIGHT" : 1,
		"UP" : - this.numTilesAcross,
		"DOWN" : this.numTilesAcross
	};

	this.backgroundMusic = new Audio("assets/music/PF01_MXAR_Ambience_Stem_01.wav"); // buffers automatically when created
	this.backgroundMusic.volume = 0.3;
	this.backgroundMusic.loop = true;
	this.backgroundMusic.play();

	this.setupRenderContext();

	var imgPaths = ["assets/whale_2.png", "assets/whale_3.png",
					"assets/stone_tile_1.png", "assets/bg_stars_3.png"];
	var imgNames = ["player1", "player2", "wall", "stars"];


	//Lager nytt level felles for de to canvasene
	this.levelGenerator = new LevelGenerator(this.numTilesAcross);
	this.loadLevel();

	this.world1 = new World(this, 1);
	this.world2 = new World(this, 2);
	this.world1.loadWorld(this.levelData);
	this.world2.loadWorld(this.levelData);

	this.loadImages(imgPaths, imgNames);


	this.setupEventListener();

};

Game.prototype.stress = function(){
	if(this.gameOver){
		return;
	}
	this.stressMusic = new Audio("assets/music/PF01_MXAR_Ambience_Stem_3.wav"); // buffers automatically when created
	this.stressMusic.volume = 0.3;
	this.stressMusic.loop = true;
	this.stressMusic.play();
};

Game.prototype.setupRenderContext = function(){
	this.canvas1 = document.createElement("canvas");

	this.canvas1.width = this.canvasW; 
	this.canvas1.height = this.canvasH;
	this.canvas1.setAttribute("class", "canvas");
	this.canvas1.setAttribute("id", "canvas1");
	document.body.appendChild(this.canvas1);

	this.context1 = this.canvas1.getContext("2d");

	// ///////////canvas 2
	this.canvas2 = document.createElement("canvas");

	this.canvas2.width = this.canvasW; 
	this.canvas2.height = this.canvasH;
	this.canvas2.setAttribute("class", "canvas");
	this.canvas2.setAttribute("id", "canvas2");
	document.body.appendChild(this.canvas2);

	this.context2 = this.canvas2.getContext("2d");

	this. oxygenbar1 = $(document.body).append( "<p id=\"oxygen1\">Oxygen Level: </p>" );
	this. oxygenbar2 = $(document.body).append( "<p id=\"oxygen2\">Oxygen Level: </p>" );

};

Game.prototype.resizeCanvas = function() {
	if(this.gameOver){
		return;
	}
    this.canvas1.width = window.innerWidth / 2 -20;
    this.canvas1.height = window.innerHeight - 60;
	this.canvas2.width = window.innerWidth /2 -20;
    this.canvas2.height = window.innerHeight -60;
}

//After the images are fully loaded, drawing of screen can begin
Game.prototype.loadImages = function(imgPaths, imgNames){
    imageMgr.load(imgPaths, imgNames, this.startDrawing.bind(this));
};

Game.prototype.startDrawing = function(){
    this.draw();
};

Game.prototype.draw = function(){

	if(this.gameOver){
		return;
	}
	if(this.world1.player.currentTile == this.world2.player.currentTile){
		console.log("WIN");
		this.gameOver = true;
		this.endGame("win");
		return;
	}


    this.context1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
    this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);

    this.context1.fillStyle = "#01011a";
    this.context1.fillRect(0,0, this.canvasW, this.canvasH);

    this.context2.fillStyle = "#01011a";
    this.context2.fillRect(0,0, this.canvasW, this.canvasH);

 	this.world1.draw(this.context1, this.world2);
 	this.world2.draw(this.context2, this.world1);

    requestAnimationFrame(this.draw.bind(this)); //to avoid this being window
};

Game.prototype.loadLevel = function(){
	this.levelData = this.levelGenerator.generateLevel();
};

Game.prototype.checkConnection = function(root1, roo2){
	return this.levelGenerator.find(root1, root2);
};

Game.prototype.player1Sonar = function(){
	console.log("player1 sonar");

	var currentTile = this.world1.player.currentTile;

	this.world1.emitSonar(currentTile);
	this.world2.emitSonar(currentTile);
};

Game.prototype.player2Sonar = function(){
	console.log("player2 sonar");

	var currentTile = this.world2.player.currentTile;

	this.world2.emitSonar(currentTile);
	this.world1.emitSonar(currentTile);
};

Game.prototype.setupEventListener = function(){
	var self = this;

	window.addEventListener('resize', this.resizeCanvas.bind(self), false);

	window.addEventListener("keydown", function(evt){
		switch(evt.keyCode){
			//up
			case 38:
				self.world2.player.move(self.moveDirection.UP);
				break;
			//down
			case 40:
				self.world2.player.move(self.moveDirection.DOWN);;
				break;
			//left
			case 39:
				self.world2.player.move(self.moveDirection.RIGHT);
				break;
			//right
			case 37:
				self.world2.player.move(self.moveDirection.LEFT);
				break;
			//0
			case 48:
				self.player2Sonar();
				//self.world1.emitSonar();
				break;
			//World 1
			//w
			case 87:
				self.world1.player.move(self.moveDirection.UP);
				break;
			//s
			case 83:
				self.world1.player.move(self.moveDirection.DOWN);
				break;
			//a
			case 68:
				self.world1.player.move(self.moveDirection.RIGHT);
				break;
			//d
			case 65:
				self.world1.player.move(self.moveDirection.LEFT);
				break;
			//1
			case 49:
				self.player1Sonar();
				//self.world1.emitSonar();
				break;
			default: break;
		}
	});
};

Game.prototype.endGame = function(strCondition){
	if(this.canvas1){
		this.gameOver = true;
		var c1 = document.getElementById("canvas1");
		c1.parentNode.removeChild(c1);
		var c2 = document.getElementById("canvas2");
		c2.parentNode.removeChild(c2);

		var text1 = document.getElementById("oxygen1");
		var text2 = document.getElementById("oxygen2");
		text1.parentNode.removeChild(text1);
		text2.parentNode.removeChild(text2);

		this.canvas1 = null;
		this.canvas2 = null;
		if(this.backgroundMusic){
			this.backgroundMusic.pause();

		}
		if(this.stressMusic){
			this.stressMusic.pause();
			this.stressMusic.currentTime = 0;
			this.stressMusic = null;	
		}
		
		imageMgr = null;
		window.removeEventListener('resize');
		window.removeEventListener("keydown");
	}
	
	if(strCondition == "win"){
		$('#menu_gamewin').show();
		var winMusic= new Audio("assets/music/PF01_MXAR_Death.wav");
		winMusic.volume = 0.3;
		//loseMusic.loop = true;
		winMusic.play();
	}
	else{
		$('#menu_gameover').show();
		var loseMusic= new Audio("assets/music/PF01_MXAR_Death.wav");
		loseMusic.volume = 0.3;
		//loseMusic.loop = true;
		loseMusic.play();	
	}
	
	
};


