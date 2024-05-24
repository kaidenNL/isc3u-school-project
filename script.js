var myGamePiece;
var gravity;
var pause;

var flapAmount;

var pipeSpeed;
var pipeX;
var pipeTop;
var pipeBottom;

function startGame() {
    pause = false;
    gravity = 6;
    flapAmount = 65;
    pipeX = 300;
    pipeSpeed = 2;
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", 10, 240);
    pipeTop = new component(20, 500, "green", pipeX, Math.floor(Math.random() * 200) - 400);
    pipeBottom = new component(20, 500, "green", pipeX, Math.floor(Math.random() * 50) + 400);
    //Math.floor(Math.random() * 500) - 400
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.addEventListener('keyup', recordKey);
        this.interval = setInterval(updateGameArea, 20);
    },
    killPlayer: function () {
        myGamePiece.y = 240;
        pipeBottom.x = pipeX;
        pipeTop.x = pipeX;
        pipeTop.y = Math.floor(Math.random() * 200) - 400;
        pipeBottom.y = Math.floor(Math.random() * 50) + 400;

        pause = true;
    },
    flap: function () {
        myGamePiece.y -= flapAmount;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

};

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


function recordKey(e) {
    switch (e.key) {
        case "ArrowUp":
            if (pause === true) {
                pause = false;
            }
            myGameArea.flap();
        default:
            console.log(e.key);
    }
}

function updateGameArea() {
    if (pause === true) {
        return;
    }
    myGameArea.clear();
    if (myGamePiece.y >= 540) {
        myGameArea.killPlayer();
    } else {
        myGamePiece.y += gravity;
    }

    
    if (pipeBottom.x - myGamePiece.x <= 25 && pipeBottom.y - myGamePiece.y <= 16 && pipeBottom.x > 0) {
        console.log("Death Bot");
        myGameArea.killPlayer();
    }



    console.log(myGamePiece.y - pipeTop.y);
    if (pipeTop.x - myGamePiece.x <= 25 && myGamePiece.y - pipeTop.y < 450 && pipeTop.x > 0) {
        console.log("Death Top");
        myGameArea.killPlayer();
    }


    pipeTop.x -= pipeSpeed;
    pipeBottom.x -= pipeSpeed;

    myGamePiece.update();
    pipeTop.update();
    pipeBottom.update();
}