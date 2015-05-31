function Explosion(pos) {
    this.pos = pos;
    this.sprite = new Sprite('img/sprites.png',
        [0, 117],
        [39, 39],
        16,
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        null,
        true);
}
