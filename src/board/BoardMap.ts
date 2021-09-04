import { Coord, CoordKey } from './Coord';
import { Obstacle } from './Obstacle';

export type Space = { coord: Coord, status: SpaceStatus };
export type SpaceStatus = 'empty' | 'obstacle' | 'pre-obstacle';
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
    return new Array(this.height * 2 - 1).fill(null).map((_, rowIdx) => {
      return new Array(this.width * 2 - 1).fill(null).map((_, columnIdx) => {
        const { x, y } = { x: columnIdx / 2, y: rowIdx / 2 };
        const coord = new Coord(x, y);
        const space = this.spaces[coord.toKey()];
        return callbackFn({ coord, space });
      })
    })
  }

  public coordToKey(x: number, y: number) {
    return `${x}:${y}`;
  }

  private updateSpace(space: Space) {
    const key = space.coord.toKey();
    this.spaces[key] = space;
  }

  public buildObstacle(coord: Coord, direction: obstacleDirection) {
    if (!coord.isObstacleCenter()) { return; }
    const obstacle = new Obstacle(coord, direction, 'obstacle');
    if (this.isObstacleConflict(obstacle)) { return; }
    const obstacleAsSpaceAry = obstacle.toSpaceAry();
    for (const obstacleBySpace of obstacleAsSpaceAry) {
      this.updateSpace(obstacleBySpace);
    }
  }

  public buildPreObstacle(coord: Coord, direction: obstacleDirection) {
    if (!coord.isObstacleCenter()) { return; }
    const obstacle = new Obstacle(coord, direction, 'pre-obstacle');
    if (this.isObstacleConflict(obstacle)) { return; }
    const obstacleAsSpaceAry = obstacle.toSpaceAry();
    for (const obstacleBySpace of obstacleAsSpaceAry) {
      this.updateSpace(obstacleBySpace);
    }
  }

  private isObstacleConflict(obstacle: Obstacle) {
    const obstacleAsSpaceAry = obstacle.toSpaceAry();
    for (const obstacleBySpace of obstacleAsSpaceAry) {
      if (this.spaces[obstacleBySpace.coord.toKey()].status === 'obstacle') {
        return true;
      }
    }
    return false;
  }

  public clearPreObstacle() {
    for (let yI = 0; yI < this.height * 2 - 1; yI++) {
      for (let xI = 0; xI < this.width * 2 - 1; xI++) {
        const { x, y } = { x: xI / 2, y: yI / 2 };
        const coord = new Coord(x, y);
        if (this.spaces[coord.toKey()].status === 'pre-obstacle') {
          this.spaces[coord.toKey()] = { coord: coord, status: 'empty' };
        }
      }
    }
  }

}

