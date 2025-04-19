
type Status = 
  | "loading" 
  | "running" 
  | "paused" 
  | "stopped" 
  | "initializing" 
  | "uninitialized"
  | "error";

type Statistics = {
  readonly totalFrames: number;
  readonly frameDelta: number;
  readonly averageFPS: number;
  readonly longestFrameTime: number;
  readonly shortestFrameTime: number;
  readonly lastUpdated: number;  
  frameTime: number;
}

export type UninitializedEngine = {
  error: null;
  canvas: HTMLCanvasElement;
  frameId: null;
  deltaTime: number;
  lastUpdated: number;
  mouseX: number;
  mouseY: number;
  keys: Record<string, boolean>;
}

export type RunningEngine = {
  error: null;
  canvas: HTMLCanvasElement;
  frameId: number;
  deltaTime: number;
  lastUpdated: number;
  mouseX: number;
  mouseY: number;
  keys: Record<string, boolean>;
}

export type Engine = UninitializedEngine | RunningEngine;

export type EngineState<
  TState extends object = {}, 
  TAssets extends object = {}
> = {
  renderStatistics: Statistics;
  engine: Engine;
  static: {
    targetFrameRate: number;
    targetFrameTime: number;
    targetUpdateTime: number;
  };
  assets: TAssets;
  external: TState;
  status: Status;
  isRunning: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  isUninitialized: boolean;
  isError: boolean;
}

export const createGameState = <
  TState extends object = {}, 
  TAssets extends object = {}
>(canvas: HTMLCanvasElement, initialState: TState): EngineState<TState, TAssets> => {
  let status: Status = "uninitialized";
  let deltaTime = 0;
  let lastUpdated = 0;
  let frameTime = 0;

  let totalFrames = 0;
  let averageFPS = 0;
  let longestFrameTime = 0;
  let shortestFrameTime = Infinity;

  const state: EngineState<TState, TAssets> = {
    renderStatistics: {
      get totalFrames() { return totalFrames },
      get averageFPS() { return averageFPS },
      get longestFrameTime() { return longestFrameTime },
      get shortestFrameTime() { return shortestFrameTime },
      get frameTime() { return frameTime },
      get frameDelta() { return deltaTime },
      get lastUpdated() { return lastUpdated },
      set frameTime(value: number) {
        frameTime = value;
        longestFrameTime = Math.max(this.longestFrameTime, value);
        shortestFrameTime = Math.min(Math.max(this.shortestFrameTime, 8), value);
        averageFPS = 1000 / value;
        totalFrames++;
      }
    },
    engine: {
      frameId: null,
      error: null,
      canvas: canvas,
      mouseX: 0,
      mouseY: 0,
      keys: {},
      get deltaTime() { return deltaTime },
      get lastUpdated() { return lastUpdated },
      set lastUpdated(time: number) { 
        deltaTime = time - lastUpdated;
        state.renderStatistics.frameTime = state.engine.deltaTime - state.renderStatistics.frameTime / 20;
        lastUpdated = time 
      },
    },
    static: {
      targetFrameRate: 120,
      targetFrameTime: 1000 / 120,
      targetUpdateTime: 1000 / 60
    },
    /** Store for external state (outside of the engine) */
    external: initialState,
    assets: {} as TAssets,
    set status(value: Status) { 
      if (value === "error") {
        console.trace("Engine has entered an error state");
      }
      status = value; 
    },
    get status() { return status; },
    get isRunning() { return status === "running"; },
    get isPaused() { return status === "paused"; },
    get isStopped() { return status === "stopped"; },
    get isLoading() { return status === "loading"; },
    get isInitializing() { return status === "initializing"; },
    get isUninitialized() { return status === "uninitialized"; },
    get isError() { return status === "error"; },
  }

  /***** Factory return *****/
  return state
}
