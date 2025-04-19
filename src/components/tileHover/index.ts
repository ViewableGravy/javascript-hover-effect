import { Components } from "../../utilities/entitity-component-system/components";
import { Entity } from "../../utilities/entitity-component-system/entity";
import { Animation } from "../animation";
import { Easing } from "../animation/easing";
import { Interpolater } from "../animation/interpolater";
import { KeyFrame } from "../animation/keyframe";
import { Image as GameImage } from "../buildingBlocks/gameImage";
import { Position } from "../buildingBlocks/position";
import { Scale } from "../buildingBlocks/scale";
import { Size } from "../buildingBlocks/size";

export const Tile = {
  Create() {
    return new Entity(
      "tile-hover",
      new Components([
        new Position(0, 0, { anchor: "center" }),
        new Size(100, 100),
        new GameImage("hover"),
        new Animation({
          keyframes: new KeyFrame({
            0: 1,
            50: 0.90,
            100: 1,
          }),
          duration: 2000,
          loop: true,
          easing: Easing.linear,
          interpolater: new Interpolater([
            new Scale()
          ])
        }),
      ])
    )
  }
}