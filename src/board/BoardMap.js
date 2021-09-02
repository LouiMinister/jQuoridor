export class BoardMap {
  width = undefined;
  height = undefined;
  spaces;
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.init();
  }

  init() {
    const spaces = { };
    for (let yI = 0; yI < this.height * 2 - 1; yI++) {
      for (let xI = 0; xI < this.width * 2 - 1; xI++) {
        const { x, y } = { x: xI / 2, y: yI / 2 };
        spaces[`${xI / 2}:${yI / 2}`] = { x: x, y: y, status: 'empty' };
      }
    }
    this.spaces = spaces;
  }

  buildToAry(callbackFn) {
    return new Array(this.height * 2 - 1).fill(null).map((_, columnIdx) => {
      return new Array(this.width * 2 - 1).fill(null).map((_, rowIdx) => {
        const coord = { x: columnIdx / 2, y: rowIdx / 2 };
        const key = `${coord.x}:${coord.y}`
        const space = this.spaces[key];
        return callbackFn({ coord, key, space });
      })
    })
  }
}