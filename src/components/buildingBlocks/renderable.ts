import type { ReadonlyEngineState } from "../../utilities/engine/engine";
import { Component, type Dependencies, type Opts } from "../../utilities/entitity-component-system/component";
import type { Entity } from "../../utilities/entitity-component-system/entity";
import type { GameState } from "../../utilities/state";


export abstract class Render<TDependencies extends Dependencies = {}> extends Component<TDependencies> {
  constructor(opts?: Opts<TDependencies>) {
    super(opts);
  }

  abstract render(state: GameState, game: ReadonlyEngineState, me: Entity): void;
}