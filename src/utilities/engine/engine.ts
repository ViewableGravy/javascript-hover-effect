import { createGameState, type EngineState } from "../createInitialGameState";
import { EngineUtils } from "./createUtils";
import { EngineInitializer } from "./initializer";
import { registerEventListeners } from "./register-event-listeners";
import { EngineRenderer } from "./renderer";
import { EngineUpdater } from "./updater";

/***** TYPE DEFINITIONS *****/
export type ReadonlyEngineState = Readonly<Omit<EngineState, "external">>;

type Opts<TState extends object, TAssets extends object> = {
  canvas: HTMLCanvasElement
  state: TState,
  updater: EngineUpdater<NoInfer<TState>, NoInfer<TAssets>>
  renderer: EngineRenderer<NoInfer<TState>, NoInfer<TAssets>>
  initializer?: EngineInitializer<NoInfer<TState>, NoInfer<TAssets>>
}

/***** COMPONENT START *****/
export class Engine<
  TState extends object = {},
  TAssets extends object = {}
> {
  private initializingPromise!: Promise<void>;

  public state: EngineState<TState, TAssets>;
  public updater: EngineUpdater<TState, TAssets>;
  public renderer: EngineRenderer<TState, TAssets>;
  public initializer?: EngineInitializer<TState, TAssets>;
  public utils: EngineUtils<TState, TAssets>;

  constructor(opts: Opts<TState, TAssets>) {
    this.state = createGameState<TState, TAssets>(opts.canvas, opts.state);
    this.updater = opts.updater;
    this.renderer = opts.renderer;
    this.initializer = opts.initializer;
    this.utils = new EngineUtils<TState, TAssets>(this.state);
  }

  public start() {
    this.state.status = "initializing";

    this.initialize();

    this.initializingPromise?.then(() => void 0);
    this.initializingPromise?.catch(() => void 0);

    this.initializingPromise = this.initializer?.initialize(this.state.external, this.state, this.utils) ?? Promise.resolve();
    this.initializingPromise
      .then(() => {
        this.state.status = "running";
        console.log("Engine initialized successfully");
      })
      .catch((e) => {
        this.state.status = "error"
        this.state.engine.error = e;
        console.error("Engine initialization error:", e);
      })

    this.gameLoop(performance.now());
  }

  public stop() {
    this.state.status = "stopped";

    cancelAnimationFrame(this.state.engine.frameId!);
  }

  public createFPSCounter(element: HTMLElement) {
    setInterval(() => {
      element.innerHTML = Math.min(1000 / this.state.renderStatistics.frameTime, 120).toFixed(1) + " fps";
    }, 100);
  }

  private gameLoop(time: number) {
    this.state.engine.lastUpdated = time;

    // Update game state
    this.update();

    // Render game state
    this.render();

    // Request the next frame
    this.state.engine.frameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  private initialize() {
    registerEventListeners(this.state);
  }

  private update() {
    this.updater.update(
      this.state.external,
      this.state,
      this.utils
    );

    this.updateCallback?.(
      this.state.external,
      this.state,
      this.utils
    );
  }

  private render() {
    this.renderer.render(
      this.state.external,
      this.state,
      this.utils
    );

    this.renderCallback?.(
      this.state.external,
      this.state,
      this.utils
    )
  }

  private get renderCallback() {
    switch (this.state.status) {
      case "initializing":
        return this.renderer.renderInitializing;
      case "running":
        return this.renderer.renderRunning;
      case "paused":
        return this.renderer.renderPaused;
      default:
        throw new Error("Invalid engine status");
    }
  }

  private get updateCallback() {
    switch (this.state.status) {
      case "initializing":
        return this.updater.updateInitializing;
      case "running":
        return this.updater.updateRunning;
      case "paused":
        return this.updater.updatePaused;
      default:
        throw new Error("Invalid engine status");
    }
  }
}