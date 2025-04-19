import { Component } from "../../utilities/entitity-component-system/component";
 
type Percent = number;

type Opts = {
  [key: Percent]: number;
}

export class KeyFrame extends Component {
  public percentages: Opts;

  constructor(opts: Opts) {
    super(undefined, {
      displayName: "keyframe",
    });
    this.percentages = opts;
  }
}