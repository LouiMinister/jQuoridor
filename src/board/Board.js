import Cell from "./cell/Cell";
import Gutter from "./gutter/Gutter";

function Board({ width, height }) {

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: `64px repeat(${width - 1}, 32px 64px)`,
    gridTemplateRows: `64px repeat(${height - 1}, 32px 64px)`,
  }

  return (
    <div style={boardStyle}>
      {
        new Array(height * 2 - 1).fill(null).map((_, columnIdx) => {
          return new Array(width * 2 - 1).fill(null).map((_, rowIdx) => {
            if (columnIdx % 2 === 0 && rowIdx % 2 === 0) {
              const key = `${Math.floor(columnIdx / 2)}:${Math.floor(rowIdx / 2)}`;
              return <Cell text={key} key={key} />
            } else {
              const key = `${(columnIdx) / 2}:${(rowIdx) / 2}`
              return (<Gutter text={key} key={key} />)
            }
          })
        })
      }
    </div>
  );
}

export default Board;