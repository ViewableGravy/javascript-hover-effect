import invariant from "tiny-invariant";
import { Animation } from "../components/animation";
import { Position } from "../components/position";
import type { EngineUpdater } from "./engine/game";
import type { GameState } from "./state";

export const createUpdater = (): EngineUpdater<GameState> => {
  return {
    onUpdate: (state, game) => {
      if (game.isRunning) {
        for (const entity of state.entities) {
          for (const component of entity.components.all()) {
            if (component.hasAction("frameCleanup")) {
              component.frameCleanup();
            } 
          }
        }

        if (state.lastPrintTime + 10000 < game.renderStatistics.lastUpdated) {
          state.printStatistics = true;
          state.lastPrintTime = game.renderStatistics.lastUpdated;
        } else {
          state.printStatistics = false;
        }
        
        const hover = state.entities.find((entity) => entity.name === "tile-hover");

        invariant(hover, "tile-hover entity not found");

        const [hoverPosition] = hover.components.getByType(Position);
        hoverPosition.x = game.engine.mouseX;
        hoverPosition.y = game.engine.mouseY;
        // const speed = 5;
        // if (state.keys.includes('ArrowUp') || state.keys.includes('w')) {
        //   hoverPosition.y = Math.max(hoverPosition.y - speed, 0);
        // }
        // if (state.keys.includes('ArrowDown') || state.keys.includes('s')) {
        //   hoverPosition.y = Math.min(hoverPosition.y + speed, state.canvas.height - 100);
        // }
        // if (state.keys.includes('ArrowLeft') || state.keys.includes('a')) {
        //   hoverPosition.x = hoverPosition.x - speed;
        // }
        // if (state.keys.includes('ArrowRight') || state.keys.includes('d')) {
        //   hoverPosition.x = Math.min(hoverPosition.x + speed, state.canvas.width - 100);
        // }

        for (const entity of state.entities) {
          // apply animation to the entity
          const animations = entity.components.getByType(Animation);

          for (const animation of animations) {
            animation.frame(game.engine.lastUpdated);
          }
        }
      }
    }
  }
}