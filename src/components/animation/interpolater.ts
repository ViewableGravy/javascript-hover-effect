import type { Component } from "../../utilities/entitity-component-system/component";
import { Components } from "../../utilities/entitity-component-system/components";

type NumberApplicableComponent = Component & {
  apply: (value: number) => void;
}

export class Interpolater extends Components<NumberApplicableComponent> {
  constructor(components: Array<NumberApplicableComponent>) {
    super(components);
  }

  interpolate = (value: number) => {
    this.components.forEach((component) => {
      component.apply(value);
    })
  }

  registerParent(Parent: Components<Component>) {
    this.components.forEach((component) => {
      component.registerParent(Parent);
    })
  }

  unregisterParent() {
    this.components.forEach((component) => {
      component.unregisterParent();
    })
  }
}