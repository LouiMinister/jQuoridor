export type CoordKey = string | ''; // ${number}:${number}
export class Coord {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getKey(): CoordKey {
    return `${this.x}:${this.y}`;
  }
}