import type { Assets } from "../..";
import type { EngineState } from "../../utilities/createInitialGameState";
import type { GameState } from "../../utilities/state";
import { Position } from "./position";
import { Render } from "./renderable";
import { Size } from "./size";

export class Image extends Render<{ position: typeof Position, size: typeof Size }> {
  constructor(public assetName: keyof Assets) {
    super({
      position: Position,
      size: Size,
    }, {
      displayName: "image",
    });
  }

  render(state: GameState, game: EngineState<GameState, Assets>): void {
    const { tickModifiedHeight, tickModifiedWidth } = this.getSingleDependency("size");
    const { x, y } = this.getSingleDependency("position").getTransformedPosition();

    state.context.drawImage(
      game.assets[this.assetName],
      x,
      y,
      tickModifiedWidth,
      tickModifiedHeight,
    )
  }
}