import "./index.css";
import Board from "./board/board";
import React from "react";
import ReactDOM from "react-dom";

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board size={9}/>
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
