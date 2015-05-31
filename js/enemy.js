function Enemy(pos) {
    this.pos = pos;
    this.speed = 100;
    this.sprite = new Sprite('img/sprites.png', [0, 78], [80, 39], 6, [0, 1, 2, 3, 2, 1]);
}

Enemy.prototype.move = function (dt) {
    this.pos[0] -= this.speed * dt;
}
