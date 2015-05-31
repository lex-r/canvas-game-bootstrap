
var game = new Game();
game.init();

resources.load([
    'img/sprites.png',
    'img/terrain.png'
]);

resources.onReady(function() {
    game.ready();
});

// Game state
var player = {
    pos: [0, 0],
    speed: 200,
    sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
};

var bullets = [];
var enemies = [];
var explosions = [];
