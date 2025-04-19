import type { Component } from "../utilities/entitity-component-system/component";

export type GetRelationship<TComponent extends Component> = TComponent extends Component<infer TRelationships> 
  ? TRelationships
  : never;