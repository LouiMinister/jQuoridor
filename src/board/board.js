import Square from "./square/square.js"
import Gutter from "./gutter/gutter.js"
import Marker from "./marker/marker.js"
import React from "react";

class Board extends React.Component {

    renderSquare(x_coords, y_coords) {
      return <Square />;
    }
  
    renderGutter(x_coords, y_coords, type) {
      return <Gutter type={type} />;
    }
  
    renderMarker(x_coords, y_coords) {
      return <Marker />;
    }
  
    render() {
      const coords = new Array(this.props.size * 2 - 1).fill(null).map((_, idx) => {
        return idx + 1;
      });

      const boardStyle = {
        display: "grid",
        gridTemplateColumns: "34px repeat(8, 10px 34px)",
        gridTemplateRows: "34px repeat(8, 10px 34px)",
      }

      const status = "Next player: X";
  
      return (
        <div>
          <div className="status">{status}</div>
          <div style={boardStyle}>
          {coords.map((_, y_idx) => {
            return coords.map((_, x_idx) => {
              if (x_idx % 2 === 0 && y_idx %2 === 0){
                return this.renderSquare(x_idx, y_idx);
              }
              else if (x_idx % 2 === 1 && y_idx % 2 === 1){
                return this.renderMarker(x_idx, y_idx);
              }
              else if (x_idx % 2 === 1 && y_idx % 2 === 0){
                return this.renderGutter(x_idx,y_idx, "vertical");
              }
              else if (x_idx % 2 === 0 && y_idx % 2 === 1){
                return this.renderGutter(x_idx,y_idx, "horizontal");
              }
            })
          })}
          </div>
         
        </div>
      );
    }
  }
  
  export default Board