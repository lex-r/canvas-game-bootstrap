function Game() {
    this.canvas = undefined;
    this.ctx = undefined;
    this.terrainPattern = undefined;
    this.lastTime = undefined;
    this.gameTime = 0;
    this.isGameOver = false;
    this.score = 0;
    this.lastFire = Date.now();
    this.bullets = [];
    this.enemies = [];
    this.explosions = [];
    this.player = undefined;
}

Game.prototype.init = function () {
    // Create the canvas
    this.canvas        = document.createElement("canvas");
    this.ctx           = this.canvas.getContext("2d");
    this.canvas.width  = 512;
    this.canvas.height = 480;
    document.body.appendChild(this.canvas);

    this.player = {
        pos: [0, 0],
        speed: 200,
        sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
    };
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

    this.handleInput(dt);
    this.updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(Math.random() < 1 - Math.pow(.993, this.gameTime)) {
        this.enemies.push(new Enemy([this.canvas.width, Math.random() * (this.canvas.height - 39)]));
    }

    this.checkCollisions();
};

// Draw everything
Game.prototype.render = function() {
    this.ctx.fillStyle = this.terrainPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render the player if the game isn't over
    if(!this.isGameOver) {
        this.renderEntity(this.player);
    }

    this.renderEntities(this.bullets);
    this.renderEntities(this.enemies);
    this.renderEntities(this.explosions);
};

Game.prototype.renderEntities = function(list) {
    for(var i=0; i<list.length; i++) {
        this.renderEntity(list[i]);
    }
};

Game.prototype.renderEntity = function(entity) {
    this.ctx.save();
    this.ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(this.ctx);
    this.ctx.restore();
};

Game.prototype.handleInput = function (dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        this.player.pos[1] += this.player.speed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        this.player.pos[1] -= this.player.speed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        this.player.pos[0] -= this.player.speed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        this.player.pos[0] += this.player.speed * dt;
    }

    if(input.isDown('SPACE') &&
        !this.isGameOver &&
        Date.now() - this.lastFire > 100) {
        var x = this.player.pos[0] + this.player.sprite.size[0] / 2;
        var y = this.player.pos[1] + this.player.sprite.size[1] / 2;

        this.bullets.push(new Bullet([x, y], 'forward'));
        this.bullets.push(new Bullet([x, y], 'up'));
        this.bullets.push(new Bullet([x, y], 'down'));

        this.lastFire = Date.now();
    }
};

Game.prototype.updateEntities = function(dt) {
    // Update the player sprite animation
    this.player.sprite.update(dt);

    // Update all the bullets
    for(var i=0; i<this.bullets.length; i++) {
        var bullet = this.bullets[i];

        bullet.move(dt);

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > this.canvas.height ||
            bullet.pos[0] > this.canvas.width) {
            this.bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the enemies
    for(var i=0; i<this.enemies.length; i++) {
        this.enemies[i].move(dt);
        this.enemies[i].sprite.update(dt);

        // Remove if offscreen
        if(this.enemies[i].pos[0] + this.enemies[i].sprite.size[0] < 0) {
            this.enemies.splice(i, 1);
            i--;
        }
    }

    // Update all the explosions
    for(var i=0; i<this.explosions.length; i++) {
        this.explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(this.explosions[i].sprite.done) {
            this.explosions.splice(i, 1);
            i--;
        }
    }
};

Game.prototype.checkCollisions = function() {
    this.checkPlayerBounds();

    // Run collision detection for all enemies and bullets
    for(var i=0; i<this.enemies.length; i++) {
        var pos = this.enemies[i].pos;
        var size = this.enemies[i].sprite.size;

        for(var j=0; j<this.bullets.length; j++) {
            var pos2 = this.bullets[j].pos;
            var size2 = this.bullets[j].sprite.size;

            if(boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                this.enemies.splice(i, 1);
                i--;

                // Add score
                this.setScore(100 + this.score);

                // Add an explosion
                this.explosions.push(new Explosion(pos));

                // Remove the bullet and stop this iteration
                this.bullets.splice(j, 1);
                break;
            }
        }

        if(boxCollides(pos, size, this.player.pos, this.player.sprite.size)) {
            this.gameOver();
        }
    }
};

Game.prototype.checkPlayerBounds = function() {
    // Check bounds
    if(this.player.pos[0] < 0) {
        this.player.pos[0] = 0;
    }
    else if(this.player.pos[0] > this.canvas.width - this.player.sprite.size[0]) {
        this.player.pos[0] = this.canvas.width - this.player.sprite.size[0];
    }

    if(this.player.pos[1] < 0) {
        this.player.pos[1] = 0;
    }
    else if(this.player.pos[1] > this.canvas.height - this.player.sprite.size[1]) {
        this.player.pos[1] = this.canvas.height - this.player.sprite.size[1];
    }
};

// Reset game to original state
Game.prototype.reset = function() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    this.isGameOver = false;
    this.gameTime = 0;
    this.setScore(0);

    this.enemies = [];
    this.bullets = [];

    this.player.pos = [50, this.canvas.height / 2];
};

Game.prototype.gameOver = function () {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    this.isGameOver = true;
};
