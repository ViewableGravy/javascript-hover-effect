import invariant from "tiny-invariant";
import type { Component } from "./component";

export class Components<const TComponent extends Component = Component> {
  protected components: Map<string, TComponent> = new Map();

  constructor(components: Array<TComponent>) {
    components.forEach((component) => {
      component.registerParent(this);
      this.add(component);
    });
  }

  all = () => Array.from(this.components.values());
  get = (id: string) => this.components.get(id);
  has = (id: string) => this.components.has(id);

  add = (component: TComponent) => {
    if (this.components.has(component.id)) {
      throw new Error(`Component with id ${component.id} already exists`);
    }
    component.registerParent(this);
    this.components.set(component.id, component);
  }

  remove = (id: string) => {
    const component = this.components.get(id);
    if (component) {
      component.unregisterParent();
      this.components.delete(id);
    }
  }
  
  hasByType = <T>(type: new (...args: any[]) => T): boolean => {
    for (const component of this.components.values()) {
      if (component instanceof type) {
        return true;
      }
    }
    return false;
  }

  getByType = <T, TRequiresAtLeastOne extends boolean = true>(
    type: new (...args: any[]) => T, 
    // @ts-ignore
    requireAtleastOne: TRequiresAtLeastOne = true
  ): GetByTypeReturnType<T, TRequiresAtLeastOne> => {
    let components = [];
    for (const component of this.components.values()) {
      if (component instanceof type) {
        components.push(component);
      }
    }

    if (requireAtleastOne) {
      invariant(components.length, `caller expected at least one component of type ${type.name}`);
      return components as GetByTypeReturnType<T, TRequiresAtLeastOne>;
    }

    return components as GetByTypeReturnType<T, TRequiresAtLeastOne>;
  }
}

type GetByTypeReturnType<T, TRequiresAtLeastOne extends boolean> = TRequiresAtLeastOne extends true
  ? [T] & Array<T>
  : Array<T>;