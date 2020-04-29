export class PreloadState extends Phaser.State {
  preload() {
    this.game.load.image("board", "./assets/board1.png");
    this.game.load.image("ball", "./assets/ball.png");
    this.game.load.image("bg", "./assets/background.png");
    this.game.load.image("box0", "./assets/box0.png");
    this.game.load.image("box1", "./assets/box1.png");
    this.game.load.image("box2", "./assets/box2.png");
    this.game.load.image("box3", "./assets/box3.png");
    this.game.load.image("restart", "./assets/restart.png");
    this.game.load.image("finger", "./assets/finger.png");
    this.game.load.image("big", "./assets/bigSquare.png");
    this.game.load.image("small", "./assets/smallSquare.png");
  }

  create() {
    this.game.state.start("game");
  }
}
