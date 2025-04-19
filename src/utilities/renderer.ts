import type { Assets } from "..";
import { Render } from "../components/buildingBlocks/renderable";
import type { EngineRenderer } from "./engine/game";
import type { GameState } from "./state";


export const createRenderer = (): EngineRenderer<GameState, Assets> => {
  return {
    onInitializingRender(state, game) {
      const entity = state.uniqueEntities["initializingText"];
      const [renderer] = entity.components.getByType(Render);
      renderer.render(state, game, entity);
    },
    onRunningRender(state, game) {
      if (state.printStatistics) {
        console.log('state', state)
        console.log('statistics', game.renderStatistics)
      }
      
      for (const entity of state.entities) {
        for (const component of entity.components.all()) {
          if (component instanceof Render) {
            component.render(state, game, entity);
          }
        }
      }
    },
    onRender(state) {
      state.context.fillStyle = '#00005f';
      state.context.fillRect(0, 0, state.canvas.width, state.canvas.height); 
    }
  }
}