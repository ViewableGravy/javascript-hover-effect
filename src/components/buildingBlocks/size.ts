import { Component } from "../../utilities/entitity-component-system/component";
import type { FrameCleanable } from "../frameCleanable";


export class Size extends Component implements FrameCleanable {
  public width: number;
  public height: number;

  /** Width that has had effects applied throughout tick */
  public tickModifiedWidth: number = 0;
  /** Height that has had effects applied throughout tick */
  public tickModifiedHeight: number = 0;

  constructor(width: number, height: number) {
    super(undefined, {
      displayName: "size",
    });
    this.width = width;
    this.height = height;
    this.tickModifiedWidth = width;
    this.tickModifiedHeight = height;
    this.actions.push("frameCleanup")
  }

  frameCleanup(): void {
    this.tickModifiedWidth = this.width;
    this.tickModifiedHeight = this.height;
  }
  
}