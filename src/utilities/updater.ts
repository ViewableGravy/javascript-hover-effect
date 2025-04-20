import invariant from "tiny-invariant";
import type { Assets } from "..";
import { Animation } from "../components/animation";
import { Position } from "../components/buildingBlocks/position";
import { EngineUpdater, UpdaterCallback } from "./engine/updater";
import type { GameState } from "./state";


export class Updater implements EngineUpdater<GameState, Assets> {
  public update: UpdaterCallback<GameState, Assets> = () => {

  }

  public updateInitializing: UpdaterCallback<GameState, Assets> = (state, game) => {
    const entity = state.uniqueEntities.initializingText;

    for (const component of entity.components.all()) {
      if (component.hasAction("frameCleanup")) {
        component.frameCleanup();
      }
    }

    const animations = entity.components.getByType(Animation);
    for (const animation of animations) {
      animation.frame(game.engine.lastUpdated);
    }
  }

  public updateRunning: UpdaterCallback<GameState, Assets> = (state, game) => {
    if (game.isRunning) {
      const hover = state.entities.find((entity) => entity.name === "tile-hover");
      invariant(hover, "tile-hover entity not found");

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

      const [hoverPosition] = hover.components.getByType(Position);
      hoverPosition.x = game.engine.mouseX;
      hoverPosition.y = game.engine.mouseY;

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
