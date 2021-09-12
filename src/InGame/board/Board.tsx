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
      if (action.gameWinner) break; // 게임 끝났을 때, 행동 불가
      boardMap.clearSpaces(({ space }) => space.status === 'pre-marker');
      boardMap.buildObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      break;
    case 'BUILD_PRE_OBSTACLE':
      if (action.gameWinner) break;
      boardMap.clearSpaces(({ space }) => space.status === 'pre-obstacle');
      boardMap.buildPreObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode, action.playerTurn);
      break;
    case 'BUILD_PRE_MARKER':
      if (action.gameWinner) break;
      boardMap.predictNextMarkerPath(new Coord(action.x, action.y), action.playerTurn);
      break;
    case 'MOVE_MARKER':
      if (action.gameWinner) break;
      boardMap.moveMarker(new Coord(action.x, action.y), action.playerTurn);
      action.type = ''
      break;
    case 'RESET_BOARD':
      boardMap.resetBoard(action.maxObstacle);
      break;
  }
  return _.cloneDeep(boardMap);
}

function Board({ width, height, maxObstacle }:
  { width: number, height: number, maxObstacle: number }) {

  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [obstacleDirectionMode, setObstacleDirectionMode] = useState('horizontal' as ObstacleDirection)
  const [boardMap, boardMapDispatch] = useReducer(boardMapReducer, new BoardMap(width, height, maxObstacle));
  const playerTurn = useMemo(() => boardMap.getPlayerTurn(), [boardMap]);
  const playerLeftObstacle = useMemo(() => boardMap.getPlayerLeftObstacle(), [boardMap]);
  const winner = useMemo(() => boardMap.getWinner(), [boardMap]);

  useEffect(() => {
    boardMapDispatch({ type: 'BUILD_PRE_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode, playerTurn, gameWinner: winner});
  }, [mouseCoord, obstacleDirectionMode, playerTurn, winner])

  const onClickGutter = useCallback(() => {
    boardMapDispatch({ type: 'BUILD_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode, playerTurn, gameWinner: winner });
  }, [mouseCoord, obstacleDirectionMode, playerTurn, winner]);

  const onMouseOver = useCallback((coord) => {
    const { x, y } = coord;
    setMouseCoord({ x, y });
  }, [setMouseCoord]);

  const onClickMarker = useCallback(() => {
    boardMapDispatch({ type: 'BUILD_PRE_MARKER', x: mouseCoord.x, y: mouseCoord.y, playerTurn, gameWinner: winner });
  }, [mouseCoord.x, mouseCoord.y, playerTurn, winner]);

  const onClickPreMarker = useCallback(() => {
    boardMapDispatch({ type: 'MOVE_MARKER', x: mouseCoord.x, y: mouseCoord.y, playerTurn, gameWinner: winner });
  }, [mouseCoord, playerTurn, winner]);

  const onClickResetButton = useCallback(() => {
    boardMapDispatch({ type: 'RESET_BOARD', maxObstacle });
  }, [maxObstacle]);


  const switchObstacleDirectionMode = useCallback(() => {
    if (obstacleDirectionMode === 'horizontal') {
      setObstacleDirectionMode('vertical');
    } else {
      setObstacleDirectionMode('horizontal');
    }
  }, [obstacleDirectionMode])

  const renderLeftObstacles = ((player) => {
    return <div style={leftObstacleWrapper}>
        {Array.from({ length: playerLeftObstacle[player]}, (v, i) => i).map((i) => {
          let leftObstacleKey = `${i}:${player}`;
          return <LeftObstacle key={leftObstacleKey}></LeftObstacle>;
        })}
      </div>
  })

  const boardStyle = useMemo(() => {
    return {
      justifyContent: "center",
      display: "grid",
      gridTemplateColumns: `64px repeat(${width - 1}, 32px 64px)`,
      gridTemplateRows: `64px repeat(${height - 1}, 32px 64px)`,
    }
  }, [width, height])

  const leftObstacleWrapper = useMemo(() => {
    return {
      height: "120px",
      marginBottom: "10px",
      marginTop: "10px",
      justifyContent: "center",
      display: "grid",
      columnGap: "40px",
      gridTemplateColumns: `repeat(${maxObstacle}, 40px)`,
    };
  }, [maxObstacle]);

  return (
    <>
      <div>
        {`xCoord: ${mouseCoord.x} yCoord: ${mouseCoord.y} playerTurn: ${playerTurn} gameWinner: ${winner}`}
      </div>
      <button onClick={() => onClickResetButton()}>RESET</button>
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