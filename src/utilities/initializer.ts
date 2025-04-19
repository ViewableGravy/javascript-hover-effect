import type { EngineInitializer } from "./engine/game";

import type { Assets } from "..";
import HoverImage from "../assets/hover.webp";
import { Position } from "../components/buildingBlocks/position";
import { Initializing } from "../components/loaders/initializing";
import { Tile } from "../components/tileHover";
import type { GameState } from "./state";

export const createInitializer = (): EngineInitializer<GameState, Assets> => {
  return {
    onInitialize: async (state, _, utils) => {
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
}
