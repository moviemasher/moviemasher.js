import { isNumber, isObject } from '../Shared/SharedGuards.js';
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js';
import { CommaChar, EqualsChar, SemicolonChar } from '../Setup/Constants.js';
import { Point } from '@moviemasher/runtime-shared';




export const isPoint = (value: any): value is Point => {
  return isObject(value) &&
    'x' in value && 'y' in value &&
    isNumber(value.x) && isNumber(value.y);
};

export function assertPoint(value: any, name?: string): asserts value is Point {
  if (!isPoint(value))
    errorThrow(value, 'Point', name);
}


export const pointsEqual = (point: Point, pointEnd?: any) => {
  if (!isPoint(pointEnd))
    return false;

  return point.x === pointEnd.x && point.y === pointEnd.y;
};


export const pointCopy = (point: any): Point => {
  const { x, y } = point;
  return { x, y };
};

export const pointRound = (point: Point): Point => {
  const { x, y } = point;
  return { x: Math.round(x), y: Math.round(y) };
};

export const pointString = (point: Point): string => {
  const { x, y } = point;
  return [
    ['x', x].join(EqualsChar), ['y', y].join(EqualsChar)
  ].join(SemicolonChar);
};

export const pointValueString = (point: Point): string => {
  const { x, y } = point;
  return [x, y].join(CommaChar);
};

export const pointNegate = (point: Point): Point => {
  const { x, y } = point;
  return { x: -x, y: -y };
};
