import { Coord, CoordKey } from './Coord';

export type Space = { coord: Coord, status: SpaceStatus };
export type SpaceStatus = 'empty' | 'obstacle';
export type Spaces = { [key: CoordKey]: Space }; // key: ${number}:${number}
export type obstacleDirection = 'horizontal' | 'vertical';

export class BoardMap {
  width: number = 0;
  height: number = 0;
  spaces: Spaces = {};
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.init();
  }

  private init() {
    const spaces: Spaces = {};
    for (let yI = 0; yI < this.height * 2 - 1; yI++) {
      for (let xI = 0; xI < this.width * 2 - 1; xI++) {
        const { x, y } = { x: xI / 2, y: yI / 2 };
        const coord = new Coord(x, y);
        const coordKey = coord.toKey();
        spaces[coordKey] = { coord: coord, status: 'empty' };
      }
    }
    this.spaces = spaces;
  }

  public getSpaceToAry<T>(callbackFn: (param: { coord: Coord, space: Space }) => T): T[][] {
    return new Array(this.height * 2 - 1).fill(null).map((_, columnIdx) => {
      return new Array(this.width * 2 - 1).fill(null).map((_, rowIdx) => {
        const { x, y } = { x: columnIdx / 2, y: rowIdx / 2 };
        const coord = new Coord(x, y);
        const space = this.spaces[coord.toKey()];
        return callbackFn({ coord, space });
      })
    })
  }
}