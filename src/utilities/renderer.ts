import type { Assets } from "..";
import { Render } from "../components/buildingBlocks/renderable";
import { EngineRenderer, RenderCallback } from "./engine/renderer";
import type { GameState } from "./state";


export class Renderer implements EngineRenderer<GameState, Assets> {
  public render: RenderCallback<GameState, Assets> = (state) => {
    state.context.fillStyle = '#00005f';
    state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
  }

  public renderInitializing: RenderCallback<GameState, Assets> = (state, game) => {
    const entity = state.uniqueEntities["initializingText"];
    const [renderer] = entity.components.getByType(Render);
    renderer.render(state, game, entity);
  }

  public renderRunning: RenderCallback<GameState, Assets> = (state, game) => {
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
  }
}
