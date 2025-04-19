import type { Component } from "../utilities/ECS/component";

export type GetRelationship<TComponent extends Component> = TComponent extends Component<infer TRelationships> 
  ? TRelationships
  : never;