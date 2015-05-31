var Game = {
    canvas:         undefined,
    ctx:            undefined,
    terrainPattern: undefined,
    lastTime:       undefined,
    gameTime:       0,
    isGameOver:     false,
    score:          0
};

Game.init = function () {
    // Create the canvas
    Game.canvas        = document.createElement("canvas");
    Game.ctx           = Game.canvas.getContext("2d");
    Game.canvas.width  = 512;
    Game.canvas.height = 480;
    document.body.appendChild(Game.canvas);
};

Game.init();

// The main game loop
Game.main = function() {
    var now = Date.now();
    var dt  = (now - Game.lastTime) / 1000.0;

    Game.update(dt);
    Game.render();

    Game.lastTime = now;
    requestAnimFrame(Game.main);
};

Game.ready = function() {
    Game.terrainPattern = Game.ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    document.getElementById('play-again').addEventListener('click', function() {
        Game.reset();
    });

    Game.reset();
    Game.lastTime = Date.now();
    Game.main();
}

Game.setScore = function(score) {
    Game.score = score;
    document.getElementById('score').innerHTML = score;
}

// Update game objects
Game.update = function(dt) {
    Game.gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(Math.random() < 1 - Math.pow(.993, Game.gameTime)) {
        enemies.push(new Enemy([Game.canvas.width, Math.random() * (Game.canvas.height - 39)]));
    }

    checkCollisions();
};

// Draw everything
Game.render = function() {
    Game.ctx.fillStyle = Game.terrainPattern;
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    // Render the player if the game isn't over
    if(!Game.isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

// Reset game to original state
Game.reset = function() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    Game.isGameOver = false;
    Game.gameTime = 0;
    Game.setScore(0);

    enemies = [];
    bullets = [];

    player.pos = [50, Game.canvas.height / 2];
};