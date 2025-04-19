import _ from "lodash";
import type { FrameCleanable } from "../../components/frameCleanable";
import type { Components } from "./components";

export type ActionsMap = {
  frameCleanup: FrameCleanable;
  any: Component;
}

export type Actions = "any" | "frameCleanup";

export type Opts = {
  cardinality?: "unique" | "non-unique";
  displayName?: string;
}

// export type Component<TAction extends Actions = Actions> = {
//   id: string;
//   actions: Array<TAction>;
//   registerParent: (parent: Components<any>) => () => void;
//   unregisterParent: () => void;
//   hasAction: <TAction extends Actions>(action: TAction) => this is Component & ActionsMap[TAction];
// }

/***** COMPONENT START *****/
export class Component<TDependencies extends Record<string, new (...args: any) => any> = {}> {
  protected parent!: Components<any>;
  public id = _.uniqueId("component");
  public actions: Array<Actions> = [];
  public dependencies: TDependencies;
  private cardinality: "unique" | "non-unique" = "unique";

  constructor(dependencies: TDependencies = {} as TDependencies, opts: Opts = {}) {
    this.dependencies = dependencies;
    this.cardinality = opts.cardinality ?? "unique";
    this.id = opts.displayName ? `${opts.displayName}-${this.id}` : this.id;
  }

  public registerParent(parent: Components<any>) {
    this.parent = parent;

    if (this.cardinality === "unique") {
      if (this.parent.getByType(this.constructor as any, false).length >= 1) {
        throw new Error(`Component ${this.id} is unique but multiple instances found`);
      }
    }

    return () => this.unregisterParent();
  }

  public unregisterParent() {
    this.parent = null as any;
  }

  /**
   * Determine what actions this component has. Actions are functionality that is attached to the component,
   * not relying on inheritance to provide functionality.
   */
  public hasAction<TAction extends Actions>(action: TAction): this is Component & ActionsMap[TAction] {
    return this.actions.includes(action);
  }

  /**
   * get a dependency by name rather than needing to import the instance. This returns an array of components
   * matching that instance type and name. This is  used internally to get relevant dependencies.
   */
  protected getDependencies<TName extends keyof TDependencies>(name: TName) {
    try {
      return this.parent.getByType<InstanceType<TDependencies[TName]>, true>(
        this.dependencies[name] as TDependencies[TName]
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Error getting dependency \"${name.toString()}\" from component ${this.id}: ${e.message}`);
      } else {
        throw e;
      }
    }
  }

  /**
   * Returns a single dependency of the given name. If there are multiple dependencies of the same name,
   * an error is thrown. 
   */
  protected getSingleDependency<TName extends keyof TDependencies>(name: TName) {
    const dependencies = this.getDependencies(name);
    if (dependencies.length > 1) {
      throw new Error(`Multiple dependencies found for ${name.toString()} in component ${this.id}`);
    }
    return dependencies[0];
  }
}
