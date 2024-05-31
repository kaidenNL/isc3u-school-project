/*
 * K Noel-Laughlin
 * May 31, 2024
 * My JS challenge was to make Flappy Bird, or in this case, Floppy Computer. It has audio, images, animation?, custom fonts and score saving.
 * Audio from Microsoft - Font from Google (CodeMan38)
 */

var ply; // Player
var gr; // Gravity
var pause;
var gp; // gamePaused
var pd; // playerDied

var fa; // flapAmount

var ps; // pipeSpeed
var px; // pipeX
var pt; // pipeTop
var pb; // pipeBottom

var s; // Score
var hs; // highScore

var inc; // Increase speed
var incamt; // Score increments to increase speed

// Images
var playerImg;
var pipeImg;

// Audio
var pointAudio;
var deathAudio;

function startGame() {
    // Checks to see if the high score is valid, if not it sets it to 0.
    if (localStorage.getItem('fcHighScore') === null) {
        localStorage.setItem('fcHighScore', 0);
    } else {
        hs = localStorage.getItem('fcHighScore');
    }
    // Loads images
    playerImg = document.getElementById("player");
    pipeImg = document.getElementById("pipe");

    // Loads audio
    pointAudio = document.getElementById("audioPoint");
    deathAudio = document.getElementById("audioDeath");

    // Sets values
    pause = true;
    pd = false;
    gr = 4;
    s = 0;
    fa = 50;
    px = 980;
    inc = 2;
    incamt = 10;
    ps = 5;
    myGameArea.start();
    ply = new componentImage(30, 30, playerImg, 10, 240);
     
    pt = new componentImage(40, 500, pipeImg, px, Math.floor(Math.random() * 200) - 450);
    pb = new componentImage(40, 500, pipeImg, px, Math.floor(Math.random() * 50) + 450);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        document.addEventListener('keyup', recordKey);
        canvas2 = document.querySelector('canvas');
        var customFont = new FontFace('PressStart', 'url(fonts/PressStart2P-Regular.ttf)');
        customFont.load().then(function (font) {
            document.fonts.add(font);
            
        });
        this.interval = setInterval(updateGameArea, 20);
    },
    killPlayer: function () {
        if (s > localStorage.getItem('fcHighScore')) {
            localStorage.setItem('fcHighScore', s);
            hs = localStorage.getItem('fcHighScore');
        }

        deathAudio.pause();
        deathAudio.currentTime = 0;
        deathAudio.play();

        ply.y = 240;
        pb.x = px;
        pt.x = px;
        pt.y = Math.floor(Math.random() * 200) - 400;
        pb.y = Math.floor(Math.random() * 50) + 400;
        ps = 5;


        pause = true;
    },
    resetPipes: function () {
        pb.x = px;
        pt.x = px;
        pt.y = Math.floor(Math.random() * 200) - 400;
        pb.y = Math.floor(Math.random() * 50) + 400;
    },
    flap: function () {
        ply.y -= fa;
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
    };
}

function componentImage(width, height, image, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(image, this.x, this.y, this.width, this.height);
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    };
}

function drawText(text, font, fontSize, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = fontSize + "px " + font;
    ctx.fillText(text, x, y);
}


function recordKey(e) {
    switch (e.key) {
        case "ArrowUp":
            if(gp === true) break;
            if (pause === true) {
                pause = false;
                
                if (pd === true) {
                    pd = false;
                    s = 0;
                }
            }
            myGameArea.flap();
            break;
        case "ArrowDown":
            if(pd === true || pause === true && gp === false) break;
            pause = !pause;
            gp = !gp;
            break;
        default:
    }
}

function updateGameArea() {
    myGameArea.clear();

    if (pause === true && gp === true) {
        drawText("Game paused!", "PressStart", 25, 310, 260, "black");
        drawText("Press DOWNARROW to resume.", "PressStart", 13, 290, 300, "black");
        return;
    }
    
    if (pause === true && pd === false) {
        drawText("Floppy Computer", "PressStart", 25, 260, 260, "black");
        drawText("Press UPARROW to start/flap.", "PressStart", 15, 247, 300, "black");
        drawText("High Score: " + localStorage.getItem('fcHighScore'), "PressStart", 13, 370, 330, "black");
        return;
    }

    if (pause === true && pd === true) {
        drawText("The floppy disk is corrupt!", "PressStart", 25, 150, 260, "black");
        drawText("Score: " + s, "PressStart", 13, 420, 300, "black");
        drawText("High Score: " + localStorage.getItem('fcHighScore'), "PressStart", 13, 385, 340, "black");
        drawText("Press UPARROW to restart.", "PressStart", 13, 300, 380, "black");
        return;
    }
    
    

    if (ply.y >= 515) {
        pd = true;
        myGameArea.killPlayer();
    } else {
        ply.y += gr;
    }


    if (pb.x - ply.x <= 30 && pb.y - ply.y <= 20 && pb.x > 0) {
        pd = true;
        myGameArea.killPlayer();
    }

    if (pt.x - ply.x <= 30 && ply.y - pt.y < 460 && pt.x > 0) {
        pd = true;
        myGameArea.killPlayer();
    }



    if (pt.x < -25) {
        s += 1;
        pointAudio.pause();
        pointAudio.currentTime = 0;
        pointAudio.play();
        myGameArea.resetPipes();
        if (s % incamt == 0) {
            ps += inc;
        }
    }



    pt.x -= ps;
    pb.x -= ps;

    ply.update();
    pt.update();
    pb.update();
    if (pause === false) {
        drawText("Score: " + s, "PressStart", 25, 5, 30, "black");
    }
}