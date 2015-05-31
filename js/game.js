function Game() {
    this.canvas = undefined;
    this.ctx = undefined;
    this.terrainPattern = undefined;
    this.lastTime = undefined;
    this.gameTime = 0;
    this.isGameOver = false;
    this.score = 0;
}

Game.prototype.init = function () {
    // Create the canvas
    this.canvas        = document.createElement("canvas");
    this.ctx           = this.canvas.getContext("2d");
    this.canvas.width  = 512;
    this.canvas.height = 480;
    document.body.appendChild(this.canvas);
};

// The main game loop
Game.prototype.main = function() {
    var self = this;

    var now = Date.now();
    var dt  = (now - this.lastTime) / 1000.0;

    this.update(dt);
    this.render();

    this.lastTime = now;
    requestAnimFrame(function(){
        self.main();
    });
};

Game.prototype.ready = function() {
    var self = this;
    this.terrainPattern = this.ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    document.getElementById('play-again').addEventListener('click', function() {
        self.reset();
    });

    this.reset();
    this.lastTime = Date.now();
    this.main();
}

Game.prototype.setScore = function(score) {
    this.score = score;
    document.getElementById('score').innerHTML = this.score;
}

// Update game objects
Game.prototype.update = function(dt) {
    this.gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(Math.random() < 1 - Math.pow(.993, this.gameTime)) {
        enemies.push(new Enemy([this.canvas.width, Math.random() * (this.canvas.height - 39)]));
    }

    checkCollisions();
};

// Draw everything
Game.prototype.render = function() {
    this.ctx.fillStyle = this.terrainPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render the player if the game isn't over
    if(!this.isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

// Reset game to original state
Game.prototype.reset = function() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    this.isGameOver = false;
    this.gameTime = 0;
    this.setScore(0);

    enemies = [];
    bullets = [];

    player.pos = [50, this.canvas.height / 2];
};
