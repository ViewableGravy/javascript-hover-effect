import './style.css';
import { Engine } from "./utilities/engine/game";
import { createInitializer } from "./utilities/initializer";
import { createRenderer } from "./utilities/renderer";
import { createState, GameState } from "./utilities/state";
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

export type Assets = {
  hover: HTMLImageElement
}

const initializeApplication = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#game')!;

  const engine = new Engine<GameState, Assets>({
    canvas: canvas,
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

// Delay initialization to ensure the DOM is fully loaded, otherwise we may start
// our animation frames and then there is a weird delay before code is run again
setTimeout(initializeApplication, 500);
