import type { EngineInitializer } from "../game";

import HoverImage from "../assets/hover.webp";
import { Animation } from "../components/animation";
import { Easing } from "../components/animation/easing";
import { Interpolater } from "../components/animation/interpolater";
import { KeyFrame } from "../components/animation/keyframe";
import { Image as GameImage } from "../components/gameImage";
import { Position } from "../components/position";
import { Scale } from "../components/scale";
import { Size } from "../components/size";
import { Components } from "./ECS/components";
import { Entity } from "./ECS/entity";
import type { GameState } from "./state";

export type AssetNames = "hover";

export const createInitializer = (): EngineInitializer<GameState> => {
  return {
    onInitialize: async (state, game) => {
      const loadImage = createLoadImage(state);

      window.addEventListener('resize', () => {
        state.canvas.width = window.innerWidth;
        state.canvas.height = window.innerHeight;
      });

      window.addEventListener('keydown', (ev) => {
        if (state.keys.includes(ev.key)) {
          return;
        }

        state.keys.push(ev.key);
      })

      window.addEventListener('keyup', (ev) => {
        state.keys = state.keys.filter((key) => key !== ev.key);
      })

      window.addEventListener("mousemove", (ev) => {
        const { clientX, clientY } = ev;

        state.mouseX = clientX;
        state.mouseY = clientY;
      })

      state.entities.push(
        new Entity(
          "tile-hover",
          new Components([
            new Position(0, 0, { anchor: "center" }),
            new Size(400, 400),
            new GameImage("hover"),
            new Animation({
              keyframes: new KeyFrame({
                0: 1,
                50: 0.90,
                100: 1,
              }),
              duration: 2000,
              loop: true,
              easing: Easing.linear,
              interpolater: new Interpolater([
                new Scale()
              ])
            }),
          ])
        )
      )

      const promises = [
        loadImage(HoverImage, "hover")
      ]

      return Promise.all(promises).then(() => void 0);
    }
  }
}

const createLoadImage = (state: GameState) => {
  return (src: string, name: AssetNames): Promise<void> => {
    const { resolve, reject, promise } = Promise.withResolvers<void>();
  
    const hoverImage = new Image();
    hoverImage.src = src;

    // Setup a maximum timeout for the image load
    const timeout = setTimeout(() => {
      if (hoverImage.complete) {
        resolve();
      } else {
        reject(new Error(`Failed to load image: ${src}`));
      }
    }, 1000);

    // Clear the timeout when the image loads or fails
    promise.then(() => clearTimeout(timeout));
    promise.catch(() => clearTimeout(timeout));
  
    // Add event listeners for load and error
    hoverImage.addEventListener("error", (error) => {
      reject(new Error(`Failed to load image: ${error.filename}`));
    })
  
    hoverImage.addEventListener("load", () => {
      state.assets[name] = hoverImage;
      resolve();
    })

    return promise;
  }
}
