import type { EngineState } from "../createInitialGameState";

export const registerEventListeners = (state: EngineState) => {
  window.addEventListener('resize', () => {
    state.engine.canvas.width = window.innerWidth;
    state.engine.canvas!.height = window.innerHeight;
  });

  state.engine.canvas.addEventListener('mousemove', (ev) => {
    state.engine.mouseX = ev.clientX
    state.engine.mouseY = ev.clientY;
  });

  state.engine.canvas.addEventListener('keydown', (ev) => {
    state.engine.keys[ev.key] = true;
  });

  state.engine.canvas.addEventListener('keyup', (ev) => {
    state.engine.keys[ev.key] = false;
  });
}
