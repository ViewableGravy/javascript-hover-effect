import type { ReadonlyEngineState } from "../../utilities/engine/engine";
import { Component, type Opts } from "../../utilities/entitity-component-system/component";
import type { Entity } from "../../utilities/entitity-component-system/entity";
import type { GameState } from "../../utilities/state";


export abstract class Render<TDependencies extends Record<string, new (...args: any) => any> = {}> extends Component<TDependencies> {
  constructor(dependencies: TDependencies = {} as TDependencies, opts?: Opts) {
    super(dependencies, opts);
  }

  abstract render(state: GameState, game: ReadonlyEngineState, me: Entity): void;
}