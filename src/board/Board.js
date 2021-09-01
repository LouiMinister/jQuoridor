import Cell from "./cell/Cell";
import Gutter from "./gutter/Gutter";

function Board({ width, height }) {

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: "64px repeat(8, 8px 64px)",
    gridTemplateRows: "64px repeat(8, 8px 64px)",
  }

  return (
    <div style={boardStyle}>
      {
        new Array(height * 2 - 1).fill(null).map((_, columnIdx) => {
          return new Array(width * 2 - 1).fill(null).map((_, rowIdx) => {
            if (columnIdx % 2 === 0 && rowIdx % 2 === 0) {
              return (<Cell />)
            } else {
              return (<Gutter />)
            }
          })
        })
      }
    </div>
  );
}

export default Board;