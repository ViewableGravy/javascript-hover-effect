import { Engine } from "./game";
import './style.css';
import { createInitializer } from "./utilities/initializer";
import { createRenderer } from "./utilities/renderer";
import { createState, type GameState } from "./utilities/state";
import { createUpdater } from "./utilities/updater";

// @ts-ignore
import Resolvers from "promise.withresolvers";
Resolvers.shim();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /* html */`
  <div>
    <canvas id="game"></canvas>
    <div id="fps" style="position: fixed; z-index: 2; top: 10px; right: 20px;" />
  </div>
`

const initializeApplication = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to get canvas context');
  }

  const engine = new Engine<GameState>({
    state: createState(canvas),
    renderer: createRenderer(),
    updater: createUpdater(),
    initializer: createInitializer()
  })

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  engine.start();
  engine.createFPSCounter(document.querySelector<HTMLDivElement>('#fps')!);

}

initializeApplication();

// const grid = document.querySelector<HTMLDivElement>('#grid')!;
// let clearGrid = createGrid(grid, {
//   cellSize: 50
// });

// window.addEventListener('resize', () => {
//   clearGrid();
//   clearGrid = createGrid(grid, {
//     cellSize: 50
//   });
// });
