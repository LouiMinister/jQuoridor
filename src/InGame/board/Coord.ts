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

  public isObstacleCenter(): boolean {
    return this.x % 1 === 0.5 && this.y % 1 === 0.5;
  }

  public between(coord: Coord) {
    return new Coord((this.x + coord.x) / 2, (this.y + coord.y) / 2);
  }
}