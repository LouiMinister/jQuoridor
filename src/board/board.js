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
      const coords = new Array(9).fill(null).map((_, idx) => {
        return idx + 1;
      });
  
      const status = "Next player: X";
  
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {coords.map((_, x_idx) => {
              // y_idx 0일경우 가로gutter 렌더링,
              if (x_idx === 0) {
                // x_idx 0일경우 marker부터 렌더링
                return [
                  this.renderMarker(x_idx, 0),
                  this.renderGutter(x_idx, 0, "horizonal"),
                  this.renderMarker(x_idx, 0),
                ];
              }
  
              return [
                // 이후로는 가로guttergutter - marker 순으로
                this.renderGutter(x_idx, 0, "horizonal"),
                this.renderMarker(x_idx, 0),
              ];
            })}
          </div>
          {coords.map((_, y_idx) => {
            return [
              <div className="board-row">
                {coords.map((_, x_idx) => {
                  if (x_idx === 0) {
                    // x_idx 0일때 세로 gutter - square - 세로 gutter 순으로 렌더링
                    return [
                      this.renderGutter(0, y_idx, "vertical"),
                      this.renderSquare(x_idx, y_idx),
                      this.renderGutter(x_idx, y_idx, "vertical"),
                    ];
                  }
  
                  return [
                    // 이후로는 square - 세로gutter 렌더링, 세로gutter로 마무리
                    this.renderSquare(x_idx, y_idx),
                    this.renderGutter(x_idx, y_idx, "vertical"),
                  ];
                })}
              </div>,
              <div className="board-row">
                {coords.map((_, x_idx) => {
                  // 가로 gutter 렌더링
                  if (x_idx === 0) {
                    // x_idx 0일때 마커부터
                    return [
                      this.renderMarker(x_idx, y_idx),
                      this.renderGutter(x_idx, y_idx, "horizonal"),
                      this.renderMarker(x_idx, y_idx),
                    ];
                  }
  
                  return [
                    // marker로 마무리
                    this.renderGutter(x_idx, y_idx, "horizonal"),
                    this.renderMarker(x_idx, y_idx),
                  ];
                })}
              </div>,
            ];
          })}
        </div>
      );
    }
  }
  
  export default Board