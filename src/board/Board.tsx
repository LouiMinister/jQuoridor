import _ from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import { Coord } from "./Coord";
import Gutter from "./gutter/Gutter";
import { ObstacleDirection } from './Obstacle';
import LeftObstacle from './leftObstacle/LeftObstacle';

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
      action.type = ''
      break;
  }
  return _.cloneDeep(boardMap);
}

function Board({ width, height, obstacleMax: ObstacleMax }:
  { width: number, height: number, obstacleMax: number }) {

  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [obstacleDirectionMode, setObstacleDirectionMode] = useState('horizontal' as ObstacleDirection)
  const [boardMap, boardMapDispatch] = useReducer(boardMapReducer, new BoardMap(width, height, ObstacleMax));
  const playerTurn = useMemo(() => boardMap.getPlayerTurn(), [boardMap]);
  const playerWaiting = useMemo(() => boardMap.getPlayerLeftObstacle(), [boardMap]);

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

  const renderLeftObstacles = ((player) => {
    
    {return <div style={leftObstacleStyle}>
        {Array.from({ length: playerWaiting[player]}, (v, i) => i).map((i) => {
          let leftObstacleKey = `${i}:${player}`;
          return <LeftObstacle key={leftObstacleKey}></LeftObstacle>;
        })}
      </div>
      }
  })

  const boardStyle = useMemo(() => {
    return {
      justifyContent: "center",
      display: "grid",
      gridTemplateColumns: `64px repeat(${width - 1}, 32px 64px)`,
      gridTemplateRows: `64px repeat(${height - 1}, 32px 64px)`,
    }
  }, [width, height])

  const leftObstacleStyle = useMemo(() => {
    return {
      height: "120px",
      marginBottom: "10px",
      marginTop: "10px",
      justifyContent: "center",
      display: "grid",
      columnGap: "40px",
      gridTemplateColumns: `repeat(${ObstacleMax}, 40px)`,
    };
  }, [ObstacleMax]);

  return (
    <>
      <div>
        {`xCoord: ${mouseCoord.x} yCoord: ${mouseCoord.y} payerTurn: ${playerTurn}`}
      </div>
      { renderLeftObstacles('away') }
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
      { renderLeftObstacles('home') }
    </>
  );
}

export default Board;