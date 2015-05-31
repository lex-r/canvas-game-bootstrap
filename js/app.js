
var game = new Game();
game.init();

resources.load([
    'img/sprites.png',
    'img/terrain.png'
]);

resources.onReady(function() {
    game.ready();
});
