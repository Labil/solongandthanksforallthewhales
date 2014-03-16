var Oxygen = function(amount, playerID){
    this.amount = amount;
    this.halfAmount = amount/2;
    this.playerID = playerID;
};

Oxygen.prototype.startCountdown = function(callback1, callback2){
    var self = this;

    var counter = setInterval(timer, 1000);
    var callback1Used = false;

    function timer(){
        self.amount -= 1;
        console.log(self.amount);
        if(self.amount <= self.halfAmount && !callback1Used){
          callback1Used = true;
          callback1();
        }
        if(self.amount <= 0){
            clearInterval(counter);
            console.log("Player: " + self.playerID + " is out of oxygen!");
            callback2();
        }
    }
};
