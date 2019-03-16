// var ACCELERATION = 2;
var SPEED = 2;
var PIXELS = 1000;
var WIDTH = 1200;
var HEIGHT = 600;
var VELOCITY = 30;

var interaction;

function distance(a, b) {
	var dx = a.xMid - b.xMid;
	var dy = a.yMid - b.yMid;
	//console.log("a: " + a.xMid + ", " + a.yMid);
	//console.log("b: " + b.xMid + ", " + b.yMid);
	//console.log("distance: " + (dx * dx + dy * dy));
	return Math.sqrt(dx * dx + dy * dy);
}

// function direction(a, b) {
// 	var dx = a.x - b.x;
// 	var dy = a.y - b.y;
// 	var dist = Math.sqrt(dx * dx + dy * dy);
// 	if(dist > 0) return { x: dx / dist, y: dy / dist }; else return {x:0,y:0};
// }

function Collide(a, b) {
	//console.log("checking collision");
	return distance(a, b) < a.radius + b.radius;
}

window.onload = function() {
    var state = data.state.entities;
    // console.log(state);
    // console.log(state.length);
    // console.log(state[0]);
    interaction.entities = [];
    for (var i = 0; i < state.length; i++){
        if (i === 0) {
            var f = new Target(state[i].x, state[i].y, state[i].targetX, state[i].targetY,
                                {r:state[i].color.r, g:state[i].color.g, b:state[i].color.b});
            interaction.entities.push(f);
        } else {
            var s = new Pixel(state[i].x, state[i].y, {r:state[i].color.r, g:state[i].color.g, b:state[i].color.b});
            s.Xvelocity = state[i].Xvelocity;
            s.Yvelocity = state[i].Yvelocity;
            s.Xacc = state[i].Xacc;
            s.Yacc = state[i].Yacc;
            //s.baseColor = {r:state[i].baseColor.r, g:state[i].baseColor.g, b:state[i].baseColor.b}
            interaction.entities.push(s);
        }
    }
};

function Target(x, y, newX, newY, color) {
    this.x = x;
    this.y = y;
    this.targetX = newX;
    this.targetY = newY;
    this.pWidth = 10;
    this.pHeight = 10;
    this.xMid = (this.x + this.pWidth) - 1;
    this.yMid = (this.y + this.pHeight) - 1;
    this.radius = 5; //not perfect or accurate, but works ~85%
    this.attraction = 0.2;
    this.speed = 2;
    this.color = {r:color.r, g:color.g, b:color.b};
};

Target.prototype.update = function() {

    if (Math.abs(this.x - this.targetX) <= this.speed + 1 &&
        Math.abs(this.y - this.targetY) <= this.speed + 1) {

        do {
            var x = Math.floor(Math.random() * (WIDTH / 2)) + WIDTH / 4;
            var y = Math.floor(Math.random() * (HEIGHT / 2)) + HEIGHT / 4;

        } while(distance(x, y) > 600);

        this.targetX = x;
        this.targetY = y;
    } else {

        if (this.targetX - this.x > 0) {
            this.x += this.speed;
        } else if (this.targetX - this.x < 0) {
            this.x -= this.speed;
        }

        if (this.targetY - this.y > 0) {
            this.y += this.speed;
        } else if (this.targetY - this.y < 0){
            this.y -= this.speed;
        }
    }
    // console.log(this .position);
}

Target.prototype.draw = function(ctx) {
    // ctx.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
    // ctx.fillRect(this.x, this.y, 10, 10);
}

function Pixel(x, y, color) {
    this.x = x;
    this.y = y;
    this.pWidth = 1;
    this.pHeight = 1;
    this.xMid = (this.x + this.pWidth) - 1;
    this.yMid = (this.y + this.pHeight) - 1;
    this.radius = 0.5;
    this.Xvelocity = 0;
    this.Yvelocity = 0;
    this.Xacc = 0;
    this.Yacc = 0;
    //this.baseColor = {r:color.r, g:color.g, b:color.b};
    this.color = {r:color.r, g:color.g, b:color.b};
};

Pixel.prototype.update = function(target) {
    for (var i = 1; i < interaction.entities.length; i++) {
        ent = interaction.entities[i];
        if (Collide({xMid: this.xMid, yMid: this.yMid, radius: this.radius}, ent)) {
            this.color.r = Math.floor(Math.random() * 255);
            this.color.g = Math.floor(Math.random() * 255);
            this.color.b = Math.floor(Math.random() * 255);
        } else {
        // this.color.r = this.baseColor.r;
        // this.color.g = this.baseColor.g;
        // this.color.b = this.baseColor.b;
        }
    }
    var x = target.x - this.x;
    var y = target.y - this.y;
    var dist = Math.sqrt(x * x + y * y);
    var inter = dist / 300;
    //
    // if (inter < 1 && Math.floor(Math.random() * 2) == 0) {
    //     var rDiff = this.baseColor.r - target.color.r;
    //     var gDiff = this.baseColor.g - target.color.g;
    //     var bDiff = this.baseColor.b - target.color.b;
    //
    //     this.color.r += Math.floor(rDiff * (1 - inter));
    //     this.color.g += Math.floor(gDiff * (1 - inter));
    //     this.color.b += Math.floor(bDiff * (1 - inter));
    // } else {
    //     this.color.r = this.baseColor.r;
    //     this.color.g = this.baseColor.g;
    //     this.color.b = this.baseColor.b;
    // }

    dist /= 100;

    var attraction = 5 / dist;

    if (attraction > 4)
        attraction = 4;

    this.Xacc = SPEED * dist;
    this.Yacc = SPEED * dist;

    if (target.x - this.x > 0) {
        this.Xvelocity += this.Xacc * interaction.clockTick;
    } else {
        this.Xvelocity -= this.Xacc * interaction.clockTick;
    }

    if (target.y - this.y > 0) {
        this.Yvelocity += this.Yacc * interaction.clockTick;
    } else {
        this.Yvelocity -= this.Yacc * interaction.clockTick;
    }


    if (Math.abs(this.Xvelocity) > VELOCITY) {
        if (this.Xvelocity > 0) {
            this.Xvelocity = VELOCITY + 0.1;
        } else {
            this.Xvelocity = -VELOCITY - 0.1;
        }
    }

    if (Math.abs(this.Yvelocity) > VELOCITY) {
        if (this.Yvelocity > 0) {
            this.Yvelocity = VELOCITY + 0.1;
        } else {
            this.Yvelocity = -VELOCITY - 0.1;
        }
    }

    var movementX = this.Xvelocity * interaction.clockTick ;
    var movementY = this.Yvelocity * interaction.clockTick ;

    this.x += movementX * attraction;
    this.y += movementY * attraction;

};

Pixel.prototype.draw = function(ctx) {
    ctx.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")";
    ctx.fillRect(this.x, this.y, 1, 1);
}


function initialize() {
    var canvas = document.getElementById("gameWorld");

    interaction = new GameEngine();
    interaction.init(canvas.getContext("2d"));

    var x = Math.floor(Math.random() * (WIDTH / 2)) + WIDTH / 8;
    var y = Math.floor(Math.random() * (HEIGHT / 2)) + HEIGHT / 4;
    var newX = Math.floor(Math.random() * (WIDTH / 2)) + WIDTH / 8;
    var newY = Math.floor(Math.random() * (HEIGHT / 2)) + HEIGHT / 4;

    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    var color = {r:red, g:green, b:blue};

    var target = new Target(x, y, newX, newY, color);
    interaction.addEntity(target);


    red = Math.floor(Math.random() * 255);
    green = Math.floor(Math.random() * 255);
    blue = Math.floor(Math.random() * 255);

    color = {r:red, g:green, b:blue};

    for (var i = 0; i < PIXELS; i++) {
        x = Math.floor(Math.random() * WIDTH);
        y = Math.floor(Math.random() * HEIGHT);

        var s = new Pixel(x, y, color);
        interaction.addEntity(s);
    }

    interaction.start();
};
