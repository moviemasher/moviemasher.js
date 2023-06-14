import type { Point, PointTuple } from '@moviemasher/runtime-shared';
import type { Size, SizeTuple } from '@moviemasher/runtime-shared';
import { errorThrow } from '@moviemasher/runtime-shared';
import { PointZero } from "./PointConstants.js";
import { isPoint, pointCopy, pointRound, pointsEqual, pointString } from "./PointFunctions.js";
import { isSize, sizeCopy, sizeRound, sizesEqual, sizeString } from "./SizeFunctions.js";
import { SemicolonChar } from '../Setup/Constants.js';
import { Rect, RectTuple } from '@moviemasher/runtime-shared';


export const isRect = (value: any): value is Rect => {
  return isSize(value) && isPoint(value);
};
export function assertRect(value: any, name?: string): asserts value is Rect {
  if (!isRect(value))
    errorThrow(value, 'Rect', name);
}

export const rectsEqual = (rect: Rect, rectEnd: any): boolean => {
  if (!isRect(rectEnd))
    return false;

  return pointsEqual(rect, rectEnd) && sizesEqual(rect, rectEnd);
};

export const rectFromSize = (size: Size, point?: Point): Rect => {
  const definedPoint = point || PointZero;
  const { width, height } = size;
  return {
    x: definedPoint.x, y: definedPoint.y, width, height,
  };
};

export const rectsFromSizes = (sizes: SizeTuple, points?: PointTuple): RectTuple => {
  const definedPoints = points || [PointZero, PointZero];
  const [size, sizeEnd] = sizes;
  const [point, pointEnd] = definedPoints;
  return [rectFromSize(size, point), rectFromSize(sizeEnd, pointEnd)];
};

export const rectCopy = (rect: any) => {
  return { ...pointCopy(rect), ...sizeCopy(rect) };
};

export const rectRound = (rect: Rect): Rect => {
  return { ...sizeRound(rect), ...pointRound(rect) };
};

export const centerPoint = (size: Size, inSize: Size): Point => {
  return {
    x: Math.round((size.width - inSize.width) / 2),
    y: Math.round((size.height - inSize.height) / 2)
  };
};

export const rectString = (dimensions: any): string => {
  const bits: string[] = [];
  if (isSize(dimensions))
    bits.push(sizeString(dimensions));
  if (isPoint(dimensions))
    bits.push(pointString(dimensions));
  return bits.join(SemicolonChar);
};
