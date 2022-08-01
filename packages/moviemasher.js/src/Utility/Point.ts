import { isNumber, isObject } from "./Is";
import { throwError } from "./Throw";

export interface Point {
  x: number;
  y: number;
}

export const isPoint = (value: any): value is Point => {
  return isObject(value) && isNumber(value.x) && isNumber(value.y) 
}

export function assertPoint(value: any, name?: string): asserts value is Point {
  if (!isPoint(value)) throwError(value, 'Point', name)
}

export type PointTuple = [Point, Point];


export const pointsEqual = (point: Point, pointEnd?: any) => {
  if (!isPoint(pointEnd)) return false

  return point.x === pointEnd.x && point.y === pointEnd.y
}

export const pointTransform = (point: Point, pointEnd: Point | undefined): Point => {
  if (!isPoint(pointEnd)) return { x: 0, y: 0 }

  return {
    x: pointEnd.x - point.x,
    y: pointEnd.y - point.y,
  }
}

export const PointZero: Point = { x: 0, y: 0 }
