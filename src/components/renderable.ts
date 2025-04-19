import type { ReadonlyEngineState } from "../game";
import { Component } from "../utilities/ECS/component";
import type { Entity } from "../utilities/ECS/entity";
import type { GameState } from "../utilities/state";


export abstract class Render<TDependencies extends Record<string, new (...args: any) => any> = {}> extends Component<TDependencies> {
  constructor(dependencies: TDependencies = {} as TDependencies) {
    super(dependencies);
  }

  abstract render(state: GameState, game: ReadonlyEngineState, me: Entity): void;
}