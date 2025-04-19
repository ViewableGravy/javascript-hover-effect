import type { Entity } from "./entitity-component-system/entity";
import type { AssetName } from "./initializer";


export type GameState = InstanceType<typeof _State>;

class _State {
  x: number;
  y: number;
  mouseX: number;
  mouseY: number;
  keys: string[];
  printStatistics: boolean;
  lastPrintTime: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  assets: Record<AssetName, HTMLImageElement>;
  entities: Array<Entity<any>> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.x = 100;
    this.y = 100;
    this.keys = [];
    this.printStatistics = false;
    this.lastPrintTime = 0;
    this.assets = {} as Record<AssetName, HTMLImageElement>;
    this.entities = [];
    this.mouseX = 0;
    this.mouseY = 0;
  }
}

export const createState = (canvas: HTMLCanvasElement): GameState => new _State(canvas);
