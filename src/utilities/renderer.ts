import { Render } from "../components/renderable";
import type { EngineRenderer } from "./engine/game";
import type { GameState } from "./state";


export const createRenderer = (): EngineRenderer<GameState> => {
  return {
    onRender(state, game) {
      
      if (game.isRunning) {
        const { canvas, context, x, y } = state;
        
        context.fillStyle = '#00005f';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.rect(0, 0, 100, 100);
        
        if (state.printStatistics) {
          console.log('state', state)
          console.log('statistics', game.renderStatistics)
        }
        
        context.beginPath();
        context.fillStyle = '#ff0000';
        context.fillRect(x, y, 100, 100);
        context.closePath();
        
        for (const entity of state.entities) {
          for (const component of entity.components.all()) {
            if (component instanceof Render) {
              component.render(state, game, entity);
            }
          }
        }
        
        if (state.assets["hover"]) {
          context.drawImage(state.assets["hover"], x + 100, y, 100, 100);
        }
      }
    }
  }
}