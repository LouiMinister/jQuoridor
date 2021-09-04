import _ from 'lodash';
import { useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import { Coord } from "./Coord";
import Gutter from "./gutter/Gutter";

function Board({ width, height }:
  { width: number, height: number }) {

  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [boardMap, setBoardMap] = useState(new BoardMap(width, height));

  const onClickGutter = () => {
    boardMap.buildObstacle(new Coord(mouseCoord.x, mouseCoord.y), 'horizontal');
    setBoardMap(_.cloneDeep(boardMap));
  }

  const onMouseOver = (coord) => {
    const { x, y } = coord;
    boardMap.clearPreObstacle();
    boardMap.buildPreObstacle(new Coord(x, y), 'horizontal');
    setBoardMap(_.cloneDeep(boardMap));
    setMouseCoord({ x, y });
  }

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: `64px repeat(${width - 1}, 32px 64px)`,
    gridTemplateRows: `64px repeat(${height - 1}, 32px 64px)`,
  }

  return (
    <>
      <div>
        {`xCoord: ${mouseCoord.x} yCoord: ${mouseCoord.y}`}
      </div>
      <div style={boardStyle}>
        {
          boardMap.getSpaceToAry(({ coord, space }) => {
            if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
              return <Cell text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} status={space.status} />
            } else {
              return <Gutter text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} onClick={() => onClickGutter()} status={space.status} />
            }
          })
        }
      </div>
    </>
  );
}

export default Board;