import type { AssetName } from "../utilities/initializer";
import type { GameState } from "../utilities/state";
import { Position } from "./position";
import { Render } from "./renderable";
import { Size } from "./size";

export class Image extends Render<{ position: typeof Position, size: typeof Size }> {
  constructor(
    public assetName: AssetName
  ) {
    super({
      position: Position,
      size: Size,
    }, {
      displayName: "image",
    });
  }

  render(state: GameState): void {
    const { tickModifiedHeight, tickModifiedWidth } = this.getSingleDependency("size");
    const { x, y } = this.getSingleDependency("position").getTransformedPosition();

    state.context.drawImage(
      state.assets[this.assetName],
      x,
      y,
      tickModifiedWidth,
      tickModifiedHeight,
    )
  }
}