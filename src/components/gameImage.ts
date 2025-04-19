import invariant from "tiny-invariant";
import type { ReadonlyEngineState } from "../game";
import type { Entity } from "../utilities/ECS/entity";
import type { AssetNames } from "../utilities/initializer";
import type { GameState } from "../utilities/state";
import { Position } from "./position";
import { Render } from "./renderable";
import { Size } from "./size";

export class Image extends Render<{ position: typeof Position, size: typeof Size }> {
  constructor(
    public assetName: AssetNames
  ) {
    super({
      position: Position,
      size: Size,
    });
  }

  render(state: GameState, game: ReadonlyEngineState, me: Entity): void {
    const [position] = this.getDependencies("position");
    const [size] = this.getDependencies("size");
    
    invariant(position, "GameImage must have a Position component");
    invariant(size, "GameImage must have a Size component");

    const { x, y } = position.getTransformedPosition();

    state.context.drawImage(
      state.assets[this.assetName],
      x,
      y,
      size.tickModifiedWidth,
      size.tickModifiedHeight,
    )
  }
}