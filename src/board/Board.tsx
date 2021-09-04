import _ from 'lodash';
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BoardMap } from "./BoardMap";
import Cell from "./cell/Cell";
import { Coord } from "./Coord";
import Gutter from "./gutter/Gutter";
import { ObstacleDirection } from './Obstacle';

function boardMapReducer(boardMap: BoardMap, action): BoardMap {
  switch (action.type) {
    case 'BUILD_OBSTACLE':
      boardMap.buildObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode);
      break;
    case 'BUILD_PRE_OBSTACLE':
      boardMap.clearPreObstacle();
      boardMap.buildPreObstacle(new Coord(action.x, action.y), action.obstacleDirectionMode);
      console.log('BUILD_PRE_OBSTACLE', action);
      break;
  }
  return _.cloneDeep(boardMap);
}

function Board({ width, height }:
  { width: number, height: number }) {

  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [obstacleDirectionMode, setObstacleDirectionMode] = useState('horizontal' as ObstacleDirection)
  const [boardMap, boardMapDispatch] = useReducer(boardMapReducer, new BoardMap(width, height));

  useEffect(() => {
    boardMapDispatch({ type: 'BUILD_PRE_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode });
  }, [mouseCoord, obstacleDirectionMode])

  const onClickGutter = useCallback(() => {
    boardMapDispatch({ type: 'BUILD_OBSTACLE', x: mouseCoord.x, y: mouseCoord.y, obstacleDirectionMode });
  }, [mouseCoord, obstacleDirectionMode]);

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
      display: "grid",
      gridTemplateColumns: `64px repeat(${width - 1}, 32px 64px)`,
      gridTemplateRows: `64px repeat(${height - 1}, 32px 64px)`,
    }
  }, [width, height])

  return (
    <>
      <div>
        {`xCoord: ${mouseCoord.x} yCoord: ${mouseCoord.y}`}
      </div>
      <div style={boardStyle} onContextMenu={(e) => { e.preventDefault(); switchObstacleDirectionMode(); }}>
        {
          boardMap.getSpaceToAry(({ coord, space }) => {
            if (Number.isInteger(coord.x) && Number.isInteger(coord.y)) {
              return <Cell text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} status={space.status} />
            } else {
              return <Gutter text={coord.toKey()} key={coord.toKey()} onMouseOver={() => onMouseOver(coord)} onClick={() => onClickGutter()} status={space.status} />
            }
          })
        }
      </div>
    </>
  );
}

export default Board;