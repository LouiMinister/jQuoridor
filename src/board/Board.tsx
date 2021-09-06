import _ from "lodash";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import { Coord } from "./Coord";
import Gutter from "./gutter/Gutter";
<<<<<<< HEAD
import { ObstacleDirection } from './Obstacle';
=======
import { ObstacleDirection } from "./Obstacle";
>>>>>>> 7cacf6b64be00559b12547257ce2e116b7551f30
import Waiting from "./waiting/waiting";

function boardMapReducer(boardMap: BoardMap, action): BoardMap {
  switch (action.type) {
<<<<<<< HEAD
    case 'BUILD_OBSTACLE':
      boardMap.buildObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
=======
    case "BUILD_OBSTACLE":
      boardMap.buildObstacle(
        new Coord(action.x, action.y),
        action.obstacleDirectionMode,
        action.playerTurn
      );
>>>>>>> 7cacf6b64be00559b12547257ce2e116b7551f30
      break;
    case "BUILD_PRE_OBSTACLE":
      boardMap.clearPreObstacle();
<<<<<<< HEAD
      boardMap.buildPreObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      console.log('BUILD_PRE_OBSTACLE', action);
=======
      boardMap.buildPreObstacle(
        new Coord(action.x, action.y),
        action.obstacleDirectionMode,
        action.playerTurn
      );
      console.log("BUILD_PRE_OBSTACLE", action);
>>>>>>> 7cacf6b64be00559b12547257ce2e116b7551f30
      break;
  }
  return _.cloneDeep(boardMap);
}

<<<<<<< HEAD
function Board({width,height,marker_max,}: 
  { width: number;height: number;marker_max: number;}) {
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [obstacleDirectionMode, setObstacleDirectionMode] = useState('horizontal' as ObstacleDirection)
  const [boardMap, boardMapDispatch] = useReducer(boardMapReducer, new BoardMap(width, height));
  const [playerTurn, setPlayerTurn] = useState('home');

  useEffect(() => {
    boardMapDispatch({ type: 'BUILD_PRE_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode, playerTurn });
  }, [mouseCoord, obstacleDirectionMode, playerTurn])

  const onClickGutter = useCallback(() => {
    boardMapDispatch({ type: 'BUILD_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode, playerTurn });
=======
function Board({
  width,
  height,
  marker_max,
}: {
  width: number;
  height: number;
  marker_max: number;
}) {
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [obstacleDirectionMode, setObstacleDirectionMode] = useState(
    "horizontal" as ObstacleDirection
  );
  const [boardMap, boardMapDispatch] = useReducer(
    boardMapReducer,
    new BoardMap(width, height)
  );
  const [playerTurn, setPlayerTurn] = useState("home");

  useEffect(() => {
    boardMapDispatch({
      type: "BUILD_PRE_OBSTACLE",
      x: mouseCoord.x,
      y: mouseCoord.y,
      obstacleDirectionMode,
      playerTurn,
    });
  }, [mouseCoord, obstacleDirectionMode, playerTurn]);

  const onClickGutter = useCallback(() => {
    boardMapDispatch({
      type: "BUILD_OBSTACLE",
      x: mouseCoord.x,
      y: mouseCoord.y,
      obstacleDirectionMode,
      playerTurn,
    });
>>>>>>> 7cacf6b64be00559b12547257ce2e116b7551f30
  }, [mouseCoord, obstacleDirectionMode, playerTurn]);

  const onMouseOver = useCallback(
    (coord) => {
      const { x, y } = coord;
      setMouseCoord({ x, y });
    },
    [setMouseCoord]
  );

  const switchObstacleDirectionMode = useCallback(() => {
    if (obstacleDirectionMode === "horizontal") {
      setObstacleDirectionMode("vertical");
    } else {
      setObstacleDirectionMode("horizontal");
    }
  }, [obstacleDirectionMode]);

  const boardStyle = useMemo(() => {
    return {
      justifyContent: "center",
      display: "grid",
      gridTemplateColumns: `64px repeat(${width - 1}, 32px 64px)`,
      gridTemplateRows: `64px repeat(${height - 1}, 32px 64px)`,
    };
  }, [width, height]);

  const waitingStyle = useMemo(() => {
    return {
      marginBottom: "10px",
      marginTop: "10px",
      justifyContent: "center",
      display: "grid",
      gridTemplateColumns: `40px repeat(${marker_max - 1}, 45px 40px)`,
    };
  }, [marker_max]);

  return (
    <>
      <div>{`xCoord: ${mouseCoord.x} yCoord: ${mouseCoord.y}`}</div>

      {/* 말 대기중 */}
      <div style={waitingStyle}>
        {Array.from({ length: marker_max * 2 - 1 }, (v, i) => i).map((i) => {
          if (i % 2 === 0) {
            let key = `${i}:home`;
            return <Waiting key={key}></Waiting>;
          } else {
            return <div></div>;
          }
        })}
      </div>
<<<<<<< HEAD
      <div style={boardStyle} onContextMenu={(e) => { e.preventDefault(); switchObstacleDirectionMode(); }}>
        {
          boardMap.getSpaceToAry(({ coord, space }) => {
            if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
              return <Cell text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} status={space.status} owner={space.owner} />
            } else {
              return <Gutter text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} onClick={() => onClickGutter()} status={space.status} />
            }
=======

      <div
        style={boardStyle}
        onContextMenu={(e) => {
          e.preventDefault();
          switchObstacleDirectionMode();
        }}
      >
        {boardMap.getSpaceToAry(({ coord, space }) => {
          if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
            return (
              <Cell
                text={coord.toKey()}
                key={coord.toKey()}
                onMouseOver={() => onMouseOver(coord)}
                status={space.status}
                owner={space.owner}
              />
            );
          } else {
            return (
              <Gutter
                text={coord.toKey()}
                key={coord.toKey()}
                onMouseOver={() => onMouseOver(coord)}
                onClick={() => onClickGutter()}
                status={space.status}
              />
            );
          }
>>>>>>> 7cacf6b64be00559b12547257ce2e116b7551f30
        })}
        {/* 말 대기중 */}
      </div>

      <div style={waitingStyle}>
        {Array.from({ length: marker_max * 2 - 1 }, (v, i) => i).map((i) => {
          if (i % 2 === 0) {
            let key = `${i}:home`;
            return <Waiting key={key}></Waiting>;
          } else {
            return <div></div>;
<<<<<<< HEAD
        }
=======
          }
>>>>>>> 7cacf6b64be00559b12547257ce2e116b7551f30
        })}
      </div>
    </>
  );
}

export default Board;
