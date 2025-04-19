import { Component } from "../../utilities/entitity-component-system/component";
import { Components } from "../../utilities/entitity-component-system/components";
import { Easing } from "./easing";
import type { Interpolater } from "./interpolater";
import type { KeyFrame } from "./keyframe";

type Opts = {
  interpolater: Interpolater,
  keyframes: KeyFrame,
  duration: number,
  easing?: Easing,
  loop?: boolean,
}

export class Animation extends Component {
  public state: "playing" | "paused" | "stopped" = "playing";
  public keyframes: KeyFrame;
  public duration: number;
  public easing: Easing;
  public loop: boolean;
  public interpolater: Interpolater;

  private startTime: number = 0;
  private interpolatedValue: number = 0;

  constructor(opts: Opts) {
    super();
    this.keyframes = opts.keyframes;
    this.duration = opts.duration;
    this.easing = opts.easing || Easing.linear;
    this.loop = opts.loop || false;
    this.interpolater = opts.interpolater;
  }

  public registerParent(Parent: Components<Component>) {
    super.registerParent(Parent);
    this.keyframes.registerParent(Parent);
    this.interpolater.registerParent(Parent);
    
    return () => {
      super.unregisterParent();
      this.interpolater.unregisterParent();
      this.keyframes.unregisterParent();
    }
  }

  public play() {
    this.state = "playing";
  }

  public pause() {
    this.state = "paused";
  }

  public stop() {
    this.state = "stopped";
  }

  /**
   * Used by the animation system to update the animation during a frame
   */
  public frame(time: number) {
    // Update the animation based on the delta time
    if (this.state === "playing") {
      switch (this.easing) {
        case Easing.linear:
          return this.applyLinear(time);
        default:
          throw new Error(`Easing function ${this.easing} not implemented`);
      }
    }
  }

  private applyLinear(time: number) {
    const start = this.startTime;
    let progress = (time - start) / this.duration;

    if (this.loop) {
      progress = (progress % 1 + 1) % 1;
    } else {
      progress = Math.min(Math.max(progress, 0), 1);
    }

    const percent = progress * 100;
    const entries = Object.entries(this.keyframes.percentages)
      .map(([k, v]) => ({ percent: parseFloat(k), value: v }))
      .sort((a, b) => a.percent - b.percent);

    // Find the two keyframes we're between
    let i = 0;
    while (i < entries.length - 1 && entries[i + 1].percent < percent) {
      i++;
    }

    const from = entries[i];
    const to = entries[i + 1];

    if (to) {
      const localProgress =
        (percent - from.percent) / (to.percent - from.percent);
      this.interpolatedValue =
        from.value + (to.value - from.value) * localProgress;
    } else {
      this.interpolatedValue = entries[entries.length - 1].value;
    }

    this.interpolater.interpolate(this.interpolatedValue);
  }
}