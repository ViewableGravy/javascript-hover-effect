import { createGameState, type EngineState } from "./utilities/createInitialGameState";

/***** TYPE DEFINITIONS *****/
export type ReadonlyEngineState = Readonly<Omit<EngineState, "external">>;
export type EngineRenderer<TState extends object> = {
  onRender: (
    state: TState, 
    global: ReadonlyEngineState
  ) => void;
}
export type EngineUpdater<TState extends object> = {
  onUpdate: (
    state: TState, 
    global: ReadonlyEngineState
  ) => void;
}
export type EngineInitializer<TState extends object> = {
  onInitialize: (
    state: TState, 
    global: ReadonlyEngineState
  ) => Promise<void>;
}

type Opts<TState extends object> = {
  state: TState,
  updater: EngineUpdater<NoInfer<TState>>
  renderer: EngineRenderer<NoInfer<TState>>
  initializer?: EngineInitializer<NoInfer<TState>>
}

/***** COMPONENT START *****/
export class Engine<TState extends object = {}> {
  private initializingPromise!: Promise<void>;

  public state: EngineState<TState>;
  public updater: EngineUpdater<TState>;
  public renderer: EngineRenderer<TState>;
  public initializer?: EngineInitializer<TState>;

  constructor(opts: Opts<TState>) {
    this.state = createGameState(opts.state);
    this.updater = opts.updater;
    this.renderer = opts.renderer;
    this.initializer = opts.initializer;
  }

  public start() {
    this.state.status = "initializing";

    this.initializingPromise?.then(() => void 0);
    this.initializingPromise?.catch(() => void 0);

    this.initializingPromise = this.initializer?.onInitialize(this.state.external, this.state) ?? Promise.resolve();
    this.initializingPromise
      .then(() => this.state.status = "running")
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

  private update() {
    this.updater.onUpdate(
      this.state.external,
      this.state
    );
  }

  private render() {
    this.renderer.onRender(
      this.state.external, 
      this.state
    );
  }
}