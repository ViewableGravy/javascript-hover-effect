import { EngineUtils } from "./createUtils";
import { ReadonlyEngineState } from "./engine";

export type UpdaterCallback<TState extends object, TAssets extends object> = (
  state: TState,
  global: ReadonlyEngineState,
  utils: EngineUtils<TState, TAssets>
) => void;

export interface EngineUpdater<TState extends object, TAssets extends object> {
  /**
   * A render function that is rendered upon all states of the engine.
   * This is run before all other render functions.
   */
  update: UpdaterCallback<TState, TAssets>;

  /**
   * A render function that is rendered when the engine is initializing.
   */
  updateInitializing?: UpdaterCallback<TState, TAssets>;

  /**
   * A render function that is rendered when the engine is running.
   */
  updateRunning?: UpdaterCallback<TState, TAssets>;

  /**
   * A render function that is rendered when the engine is paused.
   */
  updatePaused?: UpdaterCallback<TState, TAssets>;

}