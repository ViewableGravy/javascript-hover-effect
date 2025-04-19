import { uniqueId } from "lodash";
import type { Component } from "./component";
import type { Components } from "./components";


export class Entity<TComponent extends Component = Component> {
  public _id: string;

  constructor(
    public name: string,
    public components: Components<TComponent>
  ) {
    this._id = uniqueId(name);
  }
}