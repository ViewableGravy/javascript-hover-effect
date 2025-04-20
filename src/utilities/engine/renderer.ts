import { EngineUtils } from "./createUtils";
import { ReadonlyEngineState } from "./engine";

export type RenderCallback<TState extends object, TAssets extends object> = (
  state: TState,
  global: ReadonlyEngineState,
  utils: EngineUtils<TState, TAssets>
) => void;

export interface EngineRenderer<TState extends object, TAssets extends object> {
  /**
   * A render function that is rendered upon all states of the engine.
   * This is run before all other render functions.
   */
  render: RenderCallback<TState, TAssets>;

  /**
   * A render function that is rendered when the engine is initializing.
   */
  renderInitializing?: RenderCallback<TState, TAssets>;

  /**
   * A render function that is rendered when the engine is running.
   */
  renderRunning?: RenderCallback<TState, TAssets>;

  /**
   * A render function that is rendered when the engine is paused.
   */
  renderPaused?: RenderCallback<TState, TAssets>;

}