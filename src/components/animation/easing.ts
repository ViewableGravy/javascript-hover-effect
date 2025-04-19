

export class Easing {
  static linear(t: number): number {
    return t;
  }

  static easeInQuad(t: number): number {
    return t * t;
  }

  static easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  static easeInOutQuad(t: number): number {
    if (t < 0.5) return 2 * t * t;
    return -1 + (4 * t) - (4 * t * t);
  }

  // Add more easing functions as needed
}