
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

export type EngineState<TState extends object = {}> = {
  renderStatistics: Statistics;
  engine: {
    frameId: number | null;
    deltaTime: number;
    lastUpdated: number;
    error: Error | null;
  };
  static: {
    targetFrameRate: number;
    targetFrameTime: number;
    targetUpdateTime: number;
  };
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

export const createGameState = <TState extends object = {}>(initialState: TState): EngineState<TState> => {
  let status: Status = "uninitialized";
  let deltaTime = 0;
  let lastUpdated = 0;
  let frameTime = 0;

  let totalFrames = 0;
  let averageFPS = 0;
  let longestFrameTime = 0;
  let shortestFrameTime = Infinity;

  const state: EngineState<TState> = {
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
    set status(value: Status) { 
      console.trace("status", value);
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
