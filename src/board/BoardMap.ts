import Board from './Board';
import { Coord, CoordKey } from './Coord';
import { Obstacle } from './Obstacle';

export type Space = { coord: Coord, status: SpaceStatus, owner: string };
export type SpaceStatus = 'empty' | 'obstacle' | 'pre-obstacle' | 'marker' | 'pre-marker';
export type Spaces = { [key: CoordKey]: Space }; // key: ${number}:${number}
export type obstacleDirection = 'horizontal' | 'vertical';

export class BoardMap {
  private width: number = 0;
  private height: number = 0;
  private spaces: Spaces = {};
  private playerTurn: 'home' | 'away';
  private playerWaiting: {};
  constructor(width: number, height: number, waiting_max:number) {
    this.width = width;
    this.height = height;
    this.playerTurn = 'home';
    this.init();
    this.playerWaiting = {'home' : waiting_max, 'away': waiting_max};
  }

  private init() {
    const spaces: Spaces = {};
    for (let yI = 0; yI < this.height * 2 - 1; yI++) {
      for (let xI = 0; xI < this.width * 2 - 1; xI++) {
        const { x, y } = { x: xI / 2, y: yI / 2 };
        const coord = new Coord(x, y);
        const coordKey = coord.toKey();
        spaces[coordKey] = { coord: coord, status: 'empty', owner: '' };
      }
    }
    spaces[`${4}:${0}`] = { ...spaces[`${4}:${0}`], status: 'marker', owner: 'away' };
    spaces[`${4}:${8}`] = { ...spaces[`${4}:${8}`], status: 'marker', owner: 'home' };

    this.spaces = spaces;
  }

  public getPlayerTurn(): string {
    return this.playerTurn || 'home';
  }

  public getPlayerWaiting(): object {
    return this.playerWaiting;
  }

  public playerTurnEnd() {
    console.log('playerTurnEnd', this.playerTurn, this.playerTurn === 'home');
    if (this.playerTurn === 'home') {
      this.playerTurn = 'away';
    } else if (this.playerTurn === 'away') {
      this.playerTurn = 'home';
    }
  }

  public getSpaceToAry<T>(callbackFn: (param: { coord: Coord, space: Space }) => T): T[][] {
    return new Array(this.height * 2 - 1).fill(null).map((_, rowIdx) => {
      return new Array(this.width * 2 - 1).fill(null).map((_, columnIdx) => {
        const { x, y } = { x: columnIdx / 2, y: rowIdx / 2 };
        const coord = new Coord(x, y);
        const space = this.spaces[coord.toKey()];
        return callbackFn({ coord, space });
      })
    });
  }

  public coordToKey(x: number, y: number) {
    return `${x}:${y}`;
  }

  private updateSpace(space: Space) {
    const key = space.coord.toKey();
    this.spaces[key] = space;
  }

  public moveMarker(coord: Coord, owner: string) {
    this.clearSpaces(({ space }) => {
      return ((space.status === 'marker' || space.status === 'pre-marker') && space.owner === owner);
    });
    this.updateSpace({ coord: coord, status: 'marker', owner: owner });
  }

  public buildObstacle(coord: Coord, direction: obstacleDirection, owner: string) {
    if (!coord.isObstacleCenter()) { return; }
    const obstacle = new Obstacle(coord, direction, 'obstacle', owner);
    if (this.isObstacleConflict(obstacle)) { return; }
    const obstacleAsSpaceAry = obstacle.toSpaceAry();
    for (const obstacleBySpace of obstacleAsSpaceAry) {
      this.updateSpace(obstacleBySpace);
    }
    this.reduceWaiting();
  }

  public buildPreObstacle(coord: Coord, direction: obstacleDirection, owner: string) {
    if (!coord.isObstacleCenter()) { return; }
    const obstacle = new Obstacle(coord, direction, 'pre-obstacle', owner);
    if (this.isObstacleConflict(obstacle)) { return; }
    const obstacleAsSpaceAry = obstacle.toSpaceAry();
    for (const obstacleBySpace of obstacleAsSpaceAry) {
      this.updateSpace(obstacleBySpace);
    }

  }

  public isSpaceStatus(coord: Coord, status: SpaceStatus) {
    return this.isInBoard(coord) && this.spaces[coord.toKey()].status === status;
  }

  public isSpaceOwner(coord: Coord, owner: string) {
    return this.isInBoard(coord) && this.spaces[coord.toKey()].owner === owner;
  }

  public isInBoard(coord: Coord) {
    return 0 <= coord.x && 0 <= coord.y && coord.x <= this.width - 1 && coord.y <= this.height - 1;
  }

  public predictNextMarkerPath(coord: Coord, owner: string) { // 로직 정리 필요
    if (this.spaces[coord.toKey()].owner !== owner) { return; }
    const predictedPath = [new Coord(-1, 0), new Coord(1, 0), new Coord(0, 1), new Coord(0, -1)]
      .reduce((coordAry: Coord[], delta: Coord) => {
        let movedCoord = new Coord(coord.x + delta.x, coord.y + delta.y);
        if (!this.isInBoard(movedCoord) || this.isSpaceStatus(movedCoord.between(coord), 'obstacle')) { return coordAry; } // 보드 범위 밖이거나 장애물로 막힌 경우
        if (!this.isSpaceStatus(movedCoord, 'marker')) {  // 움직일 곳에 마커가 없는 경우
          coordAry.push(movedCoord);
        } else {  // 움직일 곳에 마커가 있는 경우
          const jumpedCoords = new Coord(movedCoord.x + delta.x, movedCoord.y + delta.y); // 마커 점프
          if (!this.isInBoard(jumpedCoords) || this.isSpaceStatus(movedCoord.between(jumpedCoords), 'obstacle')) {  // 점프할 곳이 장애물로 막혀있는 경우이거나 보드 밖인경우
            const jumpedSideCoords: Coord[] = [];
            if (delta.x === 0) {
              jumpedSideCoords.push(new Coord(movedCoord.x + 1, movedCoord.y), new Coord(movedCoord.x - 1, movedCoord.y));  // 상대 마커 옆으로 뛰기
            } else {
              jumpedSideCoords.push(new Coord(movedCoord.x, movedCoord.y + 1), new Coord(movedCoord.x, movedCoord.y - 1)); // 상대 마커 옆으로 뛰기
            }
            console.log('jumpedSideCoords', jumpedSideCoords);
            coordAry.push(  // 옆으로 뛴것들 중에 장애물이 없거나 보드 안인 경우만 추가
              ...(jumpedSideCoords.filter((jumpedSideCoord) => {
                return !this.isSpaceStatus(movedCoord.between(jumpedSideCoord), 'obstacle') && this.isInBoard(jumpedSideCoord)
              }))
            )
          } else {  // 점프 할 곳이 막혀있지 않은 경우
            coordAry.push(jumpedCoords);
          }
        }
        return coordAry;
      }, [])
    console.log('predictPath', predictedPath);
    for (const coord of predictedPath) {
      const preMarker: Space = { coord: coord, status: 'pre-marker', owner: owner };
      this.updateSpace(preMarker);
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

  public clearSpaces(isWillBeCleared: (param: { coord: Coord, space: Space }) => boolean) {
    for (let yI = 0; yI < this.height * 2 - 1; yI++) {
      for (let xI = 0; xI < this.width * 2 - 1; xI++) {
        const { x, y } = { x: xI / 2, y: yI / 2 };
        const coord = new Coord(x, y);
        if (isWillBeCleared({ coord: coord, space: this.spaces[coord.toKey()] })) {
          this.spaces[coord.toKey()] = { coord: coord, status: 'empty', owner: '' };
        }
      }
    }
  }

  private reduceWaiting(){
    this.playerWaiting[this.playerTurn] -= 1;
    return;
  }
}

