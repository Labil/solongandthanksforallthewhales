////////////////////////// Node //////////////////////////////

var Node = function(root, isOpen){
	this.root = root;
	this.neighbours = [];
	this.isOpen = isOpen || false;
	//size of tree, 1 at beginning as every node is in separate tree
	this.size = 1;
};

Node.prototype.setNeighbours = function(neighbours){
	for(var i = 0; i < neighbours.length; i++){
		this.neighbours.push(neighbours[i]);
	}
};

////////////////////////// Percolation ///////////////////////////////

var LevelGenerator = function(size){
	this.size = size * size;
	this.gridwidth = size;
	this.nodes = [];
	this.topNode = new Node(this.size, true);
	this.bottomNode = new Node(this.size+1, true);

	this.leftNode = new Node(this.size+2, true);
	this.rightNode = new Node(this.size+3, true);

	this.setupGrid();
	this.nums = [];

	for(var i = 0; i < this.size; i++){
		this.nums.push(i);
	}

	//Initialize in generateLevel()
	this.walls = [];
	this.floors = [];

};

LevelGenerator.prototype.openNode = function(id){
	this.nodes[id].isOpen = true;
	for(var i = 0; i < this.nodes[id].neighbours.length; i++){
		if(this.nodes[id].neighbours[i].isOpen){
			this.union(this.nodes[id].root, this.nodes[id].neighbours[i].root);
		}
	}
};

LevelGenerator.prototype.find = function(p, q){
	 var pid = this.nodes[p].root;
	 var qid = this.nodes[q].root;

	return this.getRoot(pid) == this.getRoot(qid);
};

LevelGenerator.prototype.getRoot = function(id) {

	while(this.nodes[id].root != id){
		//path compression
		var parent = this.nodes[id].root;
		var parentRoot = this.nodes[parent].root;
		var currId = id;
		id = parent;
		this.nodes[currId].root = parentRoot;
	}
	return id;
};

LevelGenerator.prototype.union = function(p, q){

	var pRoot = this.getRoot(p);
	var qRoot = this.getRoot(q);

	if(pRoot == qRoot) return;

	//Weighted union
	if(this.nodes[pRoot].size < this.nodes[qRoot].size){
		this.nodes[qRoot].size += this.nodes[pRoot].size;
		this.nodes[pRoot].root = qRoot;
	}
	else{
		this.nodes[pRoot].size += this.nodes[qRoot].size;
		this.nodes[qRoot].root = pRoot;
	}
};

LevelGenerator.prototype.checkPercolation = function(){
	if(this.find(this.topNode.root, this.bottomNode.root)){
		var threshold = (this.nums.length / this.size) * 100;
		return true;
	}
	return false;
};

LevelGenerator.prototype.generateLevel = function(){
	while(this.checkPercolation() == false){
		this.openRandomNode();
	}

	//Åpner noen ekstra nodes
	for(var i = 0; i < 40; i++){
		this.openRandomNode();
	}

	for(var i = 0; i < this.nodes.length; i++){
		if(!this.find(this.nodes[i].root, this.bottomNode.root)){
			this.nodes[i].isOpen = false;
		}
	}

	var level = [];
	for(var i = 0; i < this.nodes.length; i++){
		if(i % this.gridwidth == 0)
			this.nodes[i].isOpen = false;
		else if(i % this.gridwidth == this.gridwidth-1)
			this.nodes[i].isOpen = false;
		else if(i > this.nodes.length - this.gridwidth)
			this.nodes[i].isOpen = false;
		else if(i < this.gridwidth)
			this.nodes[i].isOpen = false;
		level.push(this.nodes[i].isOpen);
	}

	return level;
};

LevelGenerator.prototype.openRandomNode = function(){
	if(this.nums.length <= 0) return;

	var rand = Math.floor(Math.random() * this.nums.length);
	this.openNode(this.nums[rand]);
	this.nums.splice(rand,1);
};

LevelGenerator.prototype.findNeighbours = function(pos){
	var neighbours = [];
	var w = this.gridwidth;
	//top row
	if(pos < w){
		if(pos % w == 0){
			neighbours.push(this.nodes[pos + 1]);
			neighbours.push(this.nodes[pos + w]);
		}
		else if(pos % w == 1){
			neighbours.push(this.nodes[pos + 1]);
			neighbours.push(this.nodes[pos - 1]);
			neighbours.push(this.nodes[pos + w]);
		}
		else if(pos % w == 2){
			neighbours.push(this.nodes[pos - 1]);
			neighbours.push(this.nodes[pos + w]);
		}
		//All the nodes on top should be connected to the top node
		neighbours.push(this.topNode);
	}
	//Bottom row
	else if(pos >= this.size - w){
		if(pos % w == 0){
			neighbours.push(this.nodes[pos + 1]);
			neighbours.push(this.nodes[pos - w]);
		}
		else if(pos % w == 1){
			neighbours.push(this.nodes[pos + 1]);
			neighbours.push(this.nodes[pos - 1]);
			neighbours.push(this.nodes[pos - w]);
		}
		else if(pos % w == 2){
			neighbours.push(this.nodes[pos - 1]);
			neighbours.push(this.nodes[pos - w]);
		}
		//All nodes on the bottom row should connect to the bottom node
		neighbours.push(this.bottomNode);
	}
	//Left col
	else if(pos % w == 0){
		neighbours.push(this.nodes[pos - w]);
		neighbours.push(this.nodes[pos + w]);
		neighbours.push(this.nodes[pos + 1]);
		//Not all nodes on the left side should connect with leftNode, not the top and bottom
		//if(pos != this.gridwidth - 1 && pos != 0)
		//	neighbours.push(this.leftNode);
	}
	//right col
	else if(pos % w == 2){
		neighbours.push(this.nodes[pos - w]);
		neighbours.push(this.nodes[pos + w]);
		neighbours.push(this.nodes[pos - 1]);
		//most of nodes on right side should connect with rightNode
		//if(pos != this.gridwidth - 1 && pos != 0)
		//	neighbours.push(this.rightNode);	
	}
	else{
		neighbours.push(this.nodes[pos - w]);
		neighbours.push(this.nodes[pos + w]);
		neighbours.push(this.nodes[pos + 1]);
		neighbours.push(this.nodes[pos - 1]);
	}

	/*if(this.nodes[i][j - 1] != null) neighbours.push(this.nodes[i][j - 1]);	
	if(this.nodes[i][j + 1] != null) neighbours.push(this.nodes[i][j + 1]);
	if(this.nodes[i + 1] != null) neighbours.push(this.nodes[i + 1][j]);
	if(this.nodes[i - 1] != null) neighbours.push(this.nodes[i - 1][j]);*/	
	return neighbours;
};

LevelGenerator.prototype.setupGrid = function(){

	for(var i = 0; i < this.size; i++){
		this.nodes.push(new Node(i));
	}
	//connecting neighbours
	for(var i = 0; i < this.size; i++){
		var neighbours = this.findNeighbours(i);
		this.nodes[i].setNeighbours(neighbours);
	}

	this.nodes.push(this.topNode);
	this.nodes.push(this.bottomNode);
	//this.nodes.push(this.leftNode);
	//this.nodes.push(this.rightNode);
	
};

