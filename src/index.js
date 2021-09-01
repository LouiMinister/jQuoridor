import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  render() {
    return <button className="square">{/* TODO */}</button>;
  }
}

class Board extends React.Component {
  renderSquare(x_coords, y_coords) {
    return <Square />;
  }

  render() {
    const x_coords = new Array(9).fill(null).map((_, idx) => {
      return idx;
    });
    const y_coords = new Array(9).fill(null).map((_, idx) => {
      return idx;
    });

    const status = "Next player: X";

    return (
      <div>
        <div className="status">{status}</div>
        {y_coords.map((_, y_idx) => {
          return (
            <div className="board-row">
              {x_coords.map((_, x_idx) => {
                return this.renderSquare(x_idx, y_idx);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
