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

var Game = function(){
	
};

Game.prototype.init = function(){
	this.tileSize = 96;
	this.numTilesAcross = 30;
	this.boardWidth = this.tileSize * this.numTilesAcross;

	this.walls = [];
	this.floors = [];
	this.numTiles;

	this.canvasW = this.tileSize * 10;
	this.canvasH = this.tileSize * 8;

	this.setupRenderContext();

	var imgPaths = ["assets/wall.png", "assets/floor.png", "assets/whale_1_96px_sprite.png",
					"assets/stone_tile_1.png", "assets/bg_stars_2.png", "assets/shadow_1.png"];
	var imgNames = ["wall", "floor", "player", "cheese", "stars", "shadow"];

	//Lager nytt level felles for de to canvasene
	this.levelGenerator = new LevelGenerator(this.numTilesAcross);
	this.loadLevel();

	this.world1 = new World(this, 1);
	this.world2 = new World(this, 2);
	this.world1.loadWorld(this.levelData);
	this.world2.loadWorld(this.levelData);

	this.loadImages(imgPaths, imgNames);

	var soundEfx; // Sound Efx
	soundEfx = document.getElementById("soundEfx");
	//soundEfx.play();

}

Game.prototype.setupRenderContext = function(){
	this.canvas1 = document.createElement("canvas");

	this.canvas1.width = this.canvasW; 
	this.canvas1.height = this.canvasH;
	//this.canvas.setAttribute("class", "canvas");
	document.body.appendChild(this.canvas1);

	this.context1 = this.canvas1.getContext("2d");

	// ///////////canvas 2
	this.canvas2 = document.createElement("canvas");

	this.canvas2.width = this.canvasW; 
	this.canvas2.height = this.canvasH;
	//this.canvas.setAttribute("class", "canvas");
	document.body.appendChild(this.canvas2);

	this.context2 = this.canvas2.getContext("2d");
};

//After the images are fully loaded, drawing of screen can begin
Game.prototype.loadImages = function(imgPaths, imgNames){
    imageMgr.load(imgPaths, imgNames, this.startDrawing.bind(this));
};

Game.prototype.startDrawing = function(){
    this.draw();
};

Game.prototype.draw = function(){

    this.context1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
    this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);

 	this.world1.draw(this.context1);
 	this.world2.draw(this.context2);

    requestAnimationFrame(this.draw.bind(this)); //to avoid this being window
};

Game.prototype.loadLevel = function(){
	this.levelData = this.levelGenerator.generateLevel();
	this.numTiles = this.levelData.length;

};


var game = new Game();
game.init();