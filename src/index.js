import { GameState } from "./states/game-state";
import { IntroState } from "./states/intro-state";
import { PreloadState } from "./states/preload-state";

export class Game extends Phaser.Game {
  constructor() {
    super({
      width: "100%",
      height: "100%",
      backgroundColor: "#000000",
      parent: "phaser-game",
    });

    this.state.add("preload", PreloadState, true);
    this.state.add("game", GameState, false);
    this.state.add("intro", IntroState, false);
  }
}

new Game();
