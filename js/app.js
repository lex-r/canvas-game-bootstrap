
var game = new Game();
game.init();

Sound.load('sound/blaster.wav', 'blaster');
Sound.load('sound/explosion.wav', 'explosion');

resources.load([
    'img/sprites.png',
    'img/terrain.png'
]);

resources.onReady(function() {
    game.ready();
});
