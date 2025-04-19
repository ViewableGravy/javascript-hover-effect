import { Component } from "../../utilities/entitity-component-system/component";
import { Size } from "./size";


export class Scale extends Component<{ size: typeof Size }> {
  public percent: number;

  constructor(defaultPercent: number = 1) {
    super({ 
      size: Size 
    }, {
      displayName: "scale",
    });
    this.percent = defaultPercent;
  }

  public apply = (scale?: number) => {
    const [size] = this.getDependencies("size");

    size.tickModifiedHeight = size.height * (scale ?? this.percent);
    size.tickModifiedWidth = size.width * (scale ?? this.percent);
  }
}