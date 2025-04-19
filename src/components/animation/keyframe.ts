import { Component } from "../../utilities/ECS/component";
 
type Percent = number;

type Opts = {
  [key: Percent]: number;
}

export class KeyFrame extends Component {
  public percentages: Opts;

  constructor(opts: Opts) {
    super();
    this.percentages = opts;
  }
}