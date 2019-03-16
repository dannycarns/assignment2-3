// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.gravity = 9.8;
}

GameEngine.prototype.init = function(ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function() {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        var testKey = String.fromCharCode(e.which)
        if (testKey === 'W') {
             that.up = true;
             that.down = false;
        } else if (testKey === 'S') {
            that.down = true;
            that.up = false;
        }

        if (testKey === 'A') {
            that.left = true;
            that.right = false;
        } else if (testKey === 'D') {
            that.right = true;
            that.left = false;
        }
        if (testKey === ' ') {
            that.space = true;
        } else {
            that.space = false;
        }
        console.log(testKey);
        e.preventDefault();

    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function(entity) {
        console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.surfaceWidth , this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function() {
    this.entities[0].update();

    for (var i = 1; i < this.entities.length; i++) {
        this.entities[i].update(this.entities[0]);
    }
}


GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = null;
}
