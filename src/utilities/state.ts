import type { Assets } from "..";
import type { Entity } from "./entitity-component-system/entity";


export type GameState = InstanceType<typeof _State>;

export type UniqueEntityNames = 
  | "initializingText"

class _State {
  printStatistics: boolean;
  lastPrintTime: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  assets: Record<keyof Assets, HTMLImageElement>;
  entities: Array<Entity<any>> = [];
  uniqueEntities: Record<UniqueEntityNames, Entity<any>> = {} as Record<UniqueEntityNames, Entity<any>>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.printStatistics = false;
    this.lastPrintTime = 0;
    this.assets = {} as Record<keyof Assets, HTMLImageElement>;
    this.entities = [];
  }
}

export const createState = (canvas: HTMLCanvasElement): GameState => new _State(canvas);
