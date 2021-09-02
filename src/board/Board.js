import { useEffect, useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import Gutter from "./gutter/Gutter";

function Board({ width, height }) {
  const [mouseCoord, setMouseCoord] = useState({ x: undefined, y: undefined });
  const [boardMap, setBoardMap] = useState(new BoardMap(width, height));

  useEffect(() => {
    return;
  }, [mouseCoord])

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
          boardMap.buildToAry(({ coord, key, space }) => {
            if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
              return <Cell text={key} key={key} onMouseOver={() => setMouseCoord(coord)} status={space.status} />
            } else {
              return <Gutter text={key} key={key} onMouseOver={() => setMouseCoord(coord)} status={space.status} />
            }
          })
        }
      </div>
    </>
  );
}

export default Board;