import { EngineUtils } from "./createUtils";
import { ReadonlyEngineState } from "./engine";

export type InitializeCallback<TState extends object, TAssets extends object> = (
  state: TState,
  global: ReadonlyEngineState,
  utils: EngineUtils<TState, TAssets>
) => Promise<void>;

export interface EngineInitializer<TState extends object, TAssets extends object> {
  initialize: InitializeCallback<TState, TAssets>;
}