import { Space, SpaceStatus } from './BoardMap';
import { Coord } from './Coord';

export type ObstacleDirection = 'horizontal' | 'vertical';

export class Obstacle {
  coord: Coord;
  direction: ObstacleDirection;
  status: SpaceStatus;
  owner: string;
  constructor(coord: Coord, direction: ObstacleDirection, status: SpaceStatus, owner: string) {
    this.coord = coord;
    this.direction = direction;
    this.status = status;
    this.owner = owner;
  }

  public toSpaceAry(): Space[] {
    const obstacle: Space[] = [-0.5, 0, 0.5].map((val) => {
      let coord: Coord;
      if (this.direction === 'horizontal') {
        coord = new Coord(this.coord.x + val, this.coord.y);
      } else {
        coord = new Coord(this.coord.x, this.coord.y + val);
      }
      return { coord: coord, status: this.status, owner: this.owner } as Space
    });
    return obstacle;
  }
}