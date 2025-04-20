

import type { Assets } from "..";
import HoverImage from "../assets/hover.webp";
import { Position } from "../components/buildingBlocks/position";
import { Initializing } from "../components/loaders/initializing";
import { Tile } from "../components/tileHover";
import { EngineInitializer, InitializeCallback } from "./engine/initializer";
import type { GameState } from "./state";

export class Initializer implements EngineInitializer<GameState, Assets> {

  public initialize: InitializeCallback<GameState, Assets> = async (state, _, utils) => {
    state.uniqueEntities["initializingText"] = Initializing.Create(
      new Position(
        state.canvas.width / 2,
        state.canvas.height / 2,
        { anchor: "center" }
      ),
    )

    state.entities.push(
      Tile.Create()
    )

    const promises = [
      utils.loadImage(HoverImage, "hover"),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(void 0);
        }, 5000);
      })
    ]

    await Promise.all(promises);

    state.canvas.style.cursor = "none";
  }

}
