import type { EngineState } from "../createInitialGameState";

type Name<
  TAssets extends object, 
  TName extends keyof TAssets
> = TAssets[TName] extends HTMLImageElement ? TName : never

export class EngineUtils<TState extends object, TAssets extends object> {
  constructor(private state: EngineState<TState, TAssets>) {}

  public loadImage = async <TName extends keyof TAssets>(src: string, name: Name<TAssets, TName>) => {
    const hoverImage = new Image();
    hoverImage.src = src;
    
    try {
      await hoverImage.decode();
      // @ts-ignore any name passed to this function must be a key of TAssets that resolves to an HTMLImageElement
      this.state.assets[name] = hoverImage;
    } catch (error) {
      throw new Error(`Failed to load image: ${src}`)
    }
  }
}
