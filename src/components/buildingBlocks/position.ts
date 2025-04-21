import { Component } from "../../utilities/entitity-component-system/component";
import { Size } from "./size";

type Anchor = "top-left" | "center";
type Opts = {
  anchor?: Anchor
}

export class Position extends Component<{ size: typeof Size }> {
  public x: number;
  public y: number;
  public anchor: Anchor;

  constructor(x: number, y: number, opts?: Opts) {
    super({ 
      dependencies: {
        size: Size 
      },
      displayName: "position",
    });
    this.x = x;
    this.y = y;
    this.anchor = opts?.anchor ?? "top-left";
  }

  getTransformedPosition() {
    const size = this.getSingleDependency("size");

    switch (this.anchor) {
      case "top-left":
        return {
          x: this.x,
          y: this.y,
        };
      case "center":
        return {
          x: this.x - (size?.tickModifiedWidth ?? 0) / 2,
          y: this.y - (size?.tickModifiedHeight ?? 0) / 2,
        };
    }
  }
}