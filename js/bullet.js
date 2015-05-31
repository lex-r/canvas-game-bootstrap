function Bullet(pos, dir) {
    this.pos = pos;
    this.dir = dir;

    switch (dir) {
        case 'forward':
            this.sprite = new Sprite('img/sprites.png', [0, 39], [18, 8]);
            this.speedX = 500;
            this.speedY = 0;
            break;
        case 'up':
            this.sprite = new Sprite('img/sprites.png', [0, 50], [9, 5]);
            this.speedX = 0;
            this.speedY = -500;
            break;
        case 'down':
            this.sprite = new Sprite('img/sprites.png', [0, 60], [9, 5]);
            this.speedX = 0;
            this.speedY = 500;
            break;
    }
}

Bullet.prototype.move = function(dt) {
    this.pos[0] += this.speedX * dt;
    this.pos[1] += this.speedY * dt;
}
