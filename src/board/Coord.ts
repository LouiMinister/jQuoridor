export type CoordKey = string | ''; // ${number}:${number}
export class Coord {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toKey(): CoordKey {
    return `${this.x}:${this.y}`;
  }
}