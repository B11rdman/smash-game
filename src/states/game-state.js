export class GameState extends Phaser.State {
  constructor() {
    super();
    this.onBoard = true;
    this.score = 0;
    this.won = false;
    this.index = 0;
    this.totalBlocks = 0;
    this.lives = 3;
    this.rotateTimes = 0;
    this.rotateSpeed = 5;
    this.isMoving = false;
  }
  preload() {}

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.background = this.game.add.tileSprite(0, 0, 800, 600, "bg");
    this.arrows = this.game.input.keyboard.createCursorKeys();
    this.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this._createBoard();
    this._createBall();
    this._createBlocks();
    this.createText();
  }

  update() {
    this.background.tilePosition.y += 1;
    this._boardMovement();
    this._ifLowerThanBoard();
    this._ballOnBoard();
    this.collisions();
    this.scoreText.text = `Score: ${this.score}`;
    this.LivesText.text = `Score: ${this.lives}`;
    this._checkScore();
    this.ifLost();
    this.ifWon();
    if (this.restart.visible) {
      let that = this;
      this.game.time.events.add(1500, function () {
        if (that.rotateTimes <= 360 / that.rotateSpeed) {
          that.restart.angle += that.rotateSpeed;
          that.rotateTimes++;
        }
      });
    }

    if (this.rotateTimes === 360 / this.rotateSpeed) {
      let that = this;
      this.game.time.events.add(1500, function () {
        that.rotateTimes = 0;
      });
    }
  }

  _createBoard() {
    this.board = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.bottom - 50,
      "board"
    );
    this.board.anchor.set(0.5);
    this.game.physics.enable(this.board, Phaser.Physics.ARCADE);
    this.board.body.collideWorldBounds = true;
    this.board.body.immovable = true;
  }

  _boardMovement() {
    this.board.body.velocity.x = 0;
    if (this.game.input.activePointer.isDown) {
      if (this.game.input.activePointer.x > 500) {
        this.board.body.velocity.x = 250;
        this.isMoving = true;
      } else if (this.game.input.activePointer.x < 300) {
        this.isMoving = true;
        this.board.body.velocity.x = -250;
      }
    }

    if (this.arrows.right.isDown) {
      this.isMoving = true;
      this.board.body.velocity.x = 250;
    } else if (this.arrows.left.isDown) {
      this.isMoving = true;
      this.board.body.velocity.x = -250;
    }
  }

  _createBlocks() {
    this.blocks = this.game.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = Phaser.Physics.ARCADE;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 10; j++) {
        let block = this.blocks.create(j * 60, i * 40, `box${i}`);
        block.body.immovable = true;
        this.totalBlocks++;
      }
    }
    this.blocks.x = 100;
    this.blocks.y = 100;
  }

  _createBall() {
    this.ball = this.game.add.sprite(this.board.x, this.board.y - 12, "ball");
    this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.collideWorldBounds = true;
    this.ball.anchor.set(0.5);
    this.ball.body.bounce.set(1);
  }

  _ifLowerThanBoard() {
    if (this.ball.y > this.board.y + 10) {
      this.ball.visible = false;
      this.lives--;
      this.ball.x = this.board.x;
      this.ball.y = this.board.y - 12;
      this.ball.body.velocity.y = 0;
      this.ball.body.velocity.x = 0;
      let that = this;
      this.game.time.events.add(1500, function () {
        that.ball.visible = true;
        that.onBoard = true;
      });
    }
  }

  _ballOnBoard() {
    if (this.onBoard) {
      this.ball.x = this.board.x;
      this.ball.y = this.board.y - 12;
    }
    if (
      this.onBoard &&
      ((this.input.activePointer.isDown &&
        this.input.activePointer.x < 500 &&
        this.input.activePointer.x > 300) ||
        this.shoot.isDown) &&
      this.lives > 0
    ) {
      let randomX = -100 + Math.random() * (100 - -100);
      this.ball.body.velocity.set(randomX, -250);
      this.onBoard = false;
    }
  }

  hitsBoard() {
    let delta = this.ball.x - this.board.x;
    let vX = delta * 10;
    this.ball.body.velocity.set(vX, -250);
  }

  collisions() {
    this.hitBoard = this.game.physics.arcade.collide(
      this.ball,
      this.board,
      this.hitsBoard,
      null,
      this
    );
    this.game.physics.arcade.collide(
      this.ball,
      this.blocks,
      this.hitsBlock,
      null,
      this
    );
  }

  hitsBlock(item1, item2) {
    const items = [item1, item2];
    const ball = items.find((item) => item.key === "ball");
    const box = items.find((item) => item.key !== "ball");
    box.kill();
    this.score += 10;
  }

  createText() {
    this.scoreText = this.game.add.text(50, 20, `Score: ${this.score}`);

    this.LivesText = this.game.add.text(650, 20, `Lives: ${this.lives}`);

    this.winText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 100,
      "YOU WON !!! \n tap to play again",
      {
        font: "64px",
      }
    );
    this.winText.anchor.set(0.5);
    this.winText.visible = false;

    this.loseText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 100,
      "YOU LOST :( \n tap to restart ",
      {
        font: "64px",
      }
    );
    this.loseText.anchor.set(0.5);
    this.loseText.visible = false;

    this.restart = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY + 50,
      "restart"
    );
    this.restart.anchor.set(0.5);
    this.restart.inputEnabled = true;
    this.restart.angle = 0;
    this.restart.visible = false;
  }

  _checkScore() {
    if (this.score === this.totalBlocks * 10) {
      this.won = true;
      this.ball.destroy();
    }
  }

  ifLost() {
    if (!this.won && this.lives === 0) {
      this.loseText.visible = true;
      this.restart.visible = true;
      let that = this;
      this.restart.events.onInputDown.add(this.playAgain, this);
    }
  }

  ifWon() {
    if (this.won) {
      this.restart.visible = true;
      this.winText.visible = true;
      // this.blocks.destroy();
      let that = this;
      this.restart.events.onInputDown.add(this.playAgain, this);
    }
  }

  playAgain() {
    this.won = false;
    this.lives = 3;
    this.loseText.visible = false;
    this.blocks = null;
    this.score = 0;
    this.state.restart();
    this.onBoard = true;
    this.totalBlocks = 0;
    this.restart.visible = false;
  }
}
