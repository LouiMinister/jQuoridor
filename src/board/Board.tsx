import _ from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import { Coord } from "./Coord";
import Gutter from "./gutter/Gutter";
import { ObstacleDirection } from './Obstacle';
import Waiting from "./waiting/waiting";

function boardMapReducer(boardMap: BoardMap, action): BoardMap {
  switch (action.type) {
    case 'BUILD_OBSTACLE':
      boardMap.buildObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      break;
    case 'BUILD_PRE_OBSTACLE':
      boardMap.clearPreObstacle();
      boardMap.buildPreObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      console.log('BUILD_PRE_OBSTACLE', action);
      break;
  }
  return _.cloneDeep(boardMap);
}

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
  }, [mouseCoord, obstacleDirectionMode, playerTurn]);

  const onMouseOver = useCallback((coord) => {
    const { x, y } = coord;
    setMouseCoord({ x, y });
  }, [setMouseCoord]);

  const switchObstacleDirectionMode = useCallback(() => {
    if (obstacleDirectionMode === 'horizontal') {
      setObstacleDirectionMode('vertical');
    } else {
      setObstacleDirectionMode('horizontal');
    }
  }, [obstacleDirectionMode])

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
      <div style={boardStyle} onContextMenu={(e) => { e.preventDefault(); switchObstacleDirectionMode(); }}>
        {
          boardMap.getSpaceToAry(({ coord, space }) => {
            if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
              return <Cell text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} status={space.status} owner={space.owner} />
            } else {
              return <Gutter text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} onClick={() => onClickGutter()} status={space.status} />
            }
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
        }
        })}
      </div>
    </>
  );
}

export default Board;