import type { ReadonlyEngineState } from "../../utilities/engine/game";
import { Components } from "../../utilities/entitity-component-system/components";
import { Entity } from "../../utilities/entitity-component-system/entity";
import type { GameState } from "../../utilities/state";
import { Animation } from "../animation";
import { Easing } from "../animation/easing";
import { Interpolater } from "../animation/interpolater";
import { KeyFrame } from "../animation/keyframe";
import { Position } from "../buildingBlocks/position";
import { Render } from "../buildingBlocks/renderable";
import { Scale } from "../buildingBlocks/scale";
import { Size } from "../buildingBlocks/size";

export const Initializing = {
  Create(position: Position) {
    return new Entity(
      "initializing",
      new Components([
        position,
        new Size(50, 50),
        new Animation({
          keyframes: new KeyFrame({
            0: 1,
            50: 0.80,
            100: 1,
          }),
          duration: 2000,
          loop: true,
          easing: Easing.linear,
          interpolater: new Interpolater([
            new Scale()
          ])
        }),
        new TextRender("Initializing..."),
      ])
    );
  }
}

export class TextRender extends Render<{ position: typeof Position, size: typeof Size }> {
  constructor(private text: string) {
    super({
      position: Position,
      size: Size,
    }, {
      displayName: "text"
    });
  }

  render(state: GameState, game: ReadonlyEngineState, me: Entity): void {
    const { tickModifiedHeight } = this.getSingleDependency("size");
    const { x, y } = this.getSingleDependency("position").getTransformedPosition();

    state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);
    state.context.fillStyle = "white";
    state.context.textAlign = "center";
    state.context.textBaseline = "middle";
    state.context.font = `${tickModifiedHeight}px sans-serif`;
    state.context.fillText(this.text, x, y);
  }
}