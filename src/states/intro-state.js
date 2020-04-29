export class IntroState extends Phaser.State {
  constructor() {
    super();
    this.playFingerAnimation = false;
    this.shoot = false;
  }

  preload() {}

  create() {
    this.createImages();
    this.createText();
    this.game.time.events.add(1000, this.leftSide, this);
  }

  update() {
    this.background.tilePosition.y += 1;
    if (this.playFingerAnimation) {
      if (this.finger.scale.x === 1) {
        let that = this;
        this.game.time.events.add(500, function () {
          that.finger.scale.set(1.2);
        });
      }
      if (this.finger.scale.x === 1.2) {
        let that = this;
        this.game.time.events.add(500, function () {
          that.finger.scale.set(1);
        });
      }
    }

    if (this.ball.y < 300) {
      this.ball.y = this.board.y - 12;
      this.ball.x = this.board.x;
      this.canShoot = true;
    }

    if (this.canShoot) {
      let randomX = -100 + Math.random() * (100 - -100);
      this.ball.body.velocity.set(randomX, -250);
      this.canShoot = false;
    }
  }

  createImages() {
    this.background = this.game.add.tileSprite(0, 0, 800, 600, "bg");
    this.big = this.game.add.image(0, 0, "big");
    this.big.visible = false;

    this.small = this.game.add.image(300, 0, "small");
    this.small.visible = false;

    this.finger = this.game.add.image(150, 300, "finger");
    this.finger.anchor.set(0.5);
    this.finger.visible = false;

    this.board = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.bottom - 50,
      "board"
    );
    this.board.anchor.set(0.5);
    this.game.physics.enable(this.board, Phaser.Physics.ARCADE);
    this.board.body.collideWorldBounds = true;
    this.board.visible = false;

    this.ball = this.game.add.sprite(this.board.x, this.board.y - 12, "ball");
    this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.anchor.set(0.5);
    this.ball.visible = false;
  }

  createText() {
    this.leftText = this.game.add.text(
      20,
      30,
      "Tap here to move \n the board \n to the left"
    );
    this.leftText.visible = false;

    this.rightText = this.game.add.text(
      520,
      30,
      "Tap here to move \n the board \n to the right"
    );
    this.rightText.visible = false;

    this.middleText = this.game.add.text(
      320,
      30,
      "Tap here \n to shoot \n the ball"
    );
    this.middleText.visible = false;
  }

  leftSide() {
    this.board.visible = true;
    this.big.visible = true;
    this.finger.visible = true;
    this.leftText.visible = true;
    this.playFingerAnimation = true;
    this.board.body.velocity.x = -100;
    this.game.time.events.add(4000, this.rightSide, this);
  }

  rightSide() {
    this.board.x = this.game.world.centerX;
    this.big.x = 500;
    this.finger.x = 650;
    this.rightText.visible = true;
    this.board.body.velocity.x = 100;
    this.leftText.visible = false;
    this.game.time.events.add(4000, this.middle, this);
  }

  middle() {
    this.ball.visible = true;
    this.board.x = this.game.world.centerX;
    this.board.body.velocity.x = 0;
    this.canShoot = true;

    this.big.visible = false;
    this.small.visible = true;
    this.rightText.visible = false;
    this.middleText.visible = true;
    this.finger.x = 400;
    let that = this;
    this.game.time.events.add(4000, function () {
      that.game.state.start("game");
    });
  }
}
