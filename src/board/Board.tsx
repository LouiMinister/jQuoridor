import _ from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import { Coord } from "./Coord";
import Gutter from "./gutter/Gutter";
import { ObstacleDirection } from './Obstacle';
import Waiting from './waiting/waiting';

function boardMapReducer(boardMap: BoardMap, action): BoardMap {
  switch (action.type) {
    case 'BUILD_OBSTACLE':
      boardMap.clearSpaces(({ space }) => space.status === 'pre-marker');
      boardMap.buildObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      break;
    case 'BUILD_PRE_OBSTACLE':
      boardMap.clearSpaces(({ space }) => space.status === 'pre-obstacle');
      boardMap.buildPreObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      break;
    case 'BUILD_PRE_MARKER':
      boardMap.predictNextMarkerPath(new Coord(action.x, action.y), action.playerTurn);
      break;
    case 'MOVE_MARKER':
      boardMap.moveMarker(new Coord(action.x, action.y), action.playerTurn);
      break;
    case 'PLAYER_TURN_END':
      boardMap.playerTurnEnd();
      break;
  }
  return _.cloneDeep(boardMap);
}

function Board({ width, height, marker_max }:
  { width: number, height: number, marker_max: number }) {

  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [obstacleDirectionMode, setObstacleDirectionMode] = useState('horizontal' as ObstacleDirection)
  const [boardMap, boardMapDispatch] = useReducer(boardMapReducer, new BoardMap(width, height));
  const playerTurn = useMemo(() => boardMap.getPlayerTurn(), [boardMap]);

  useEffect(() => {
    boardMapDispatch({ type: 'BUILD_PRE_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode, playerTurn });
  }, [mouseCoord, obstacleDirectionMode, playerTurn])

  const onClickGutter = useCallback(() => {
    boardMapDispatch({ type: 'BUILD_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode, playerTurn });
    boardMapDispatch({ type: 'PLAYER_TURN_END' });
  }, [mouseCoord, obstacleDirectionMode, playerTurn]);

  const onMouseOver = useCallback((coord) => {
    const { x, y } = coord;
    setMouseCoord({ x, y });
  }, [setMouseCoord]);

  const onClickMarker = useCallback(() => {
    boardMapDispatch({ type: 'BUILD_PRE_MARKER', x: mouseCoord.x, y: mouseCoord.y, playerTurn });
  }, [mouseCoord.x, mouseCoord.y, playerTurn]);

  const onClickPreMarker = useCallback(() => {
    boardMapDispatch({ type: 'MOVE_MARKER', x: mouseCoord.x, y: mouseCoord.y, playerTurn });
    boardMapDispatch({ type: 'PLAYER_TURN_END' });
  }, [mouseCoord, playerTurn]);

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
    }
  }, [width, height])

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
      <div>
        {`xCoord: ${mouseCoord.x} yCoord: ${mouseCoord.y} payerTurn: ${playerTurn}`}
      </div>
      <div style={waitingStyle}>
        {Array.from({ length: marker_max * 2 - 1 }, (v, i) => i).map((i) => {
          if (i % 2 === 0) {
            let waitingkey = `${i}:home`;
            return <Waiting key={waitingkey}></Waiting>;
          } else {
            return <div></div>;
          }
        })}
      </div>
      <div style={boardStyle} onContextMenu={(e) => { e.preventDefault(); switchObstacleDirectionMode(); }}>
        {
          boardMap.getSpaceToAry(({ coord, space }) => {
            if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
              return <Cell text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} onClickMarker={() => onClickMarker()} onClickPreMarker={() => { onClickPreMarker() }} status={space.status} owner={space.owner} />
            } else {
              return <Gutter text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} onClick={() => onClickGutter()} status={space.status} />
            }
          })
        }
      </div>
      <div style={waitingStyle}>
        {Array.from({ length: marker_max * 2 - 1 }, (v, i) => i).map((i) => {
          if (i % 2 === 0) {
            let waitingkey = `${i}:home`;
            return <Waiting key={waitingkey}></Waiting>;
          } else {
            return <div></div>;
        }
        })}
      </div>
    </>
  );
}

export default Board;