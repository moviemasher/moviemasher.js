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

export const PointZero: Point = { x: 0, y: 0 }

export const pointCopy = (point: any): Point => {
  // assertPoint(point)

  const { x, y } = point
  return { x, y } 
}

export const pointRound = (point: Point): Point => {
  const { x, y } = point
  return { x: Math.round(x), y: Math.round(y) } 
}

export const pointString = (point: Point): string => {
  const { x, y } = point
  return `x=${x};y=${y}`
}
export const pointValueString = (point: Point): string => {
  const { x, y } = point
  return `${x},${y}`
}

export const pointNegate = (point: Point): Point => {
  const { x, y } = point
  return { x: -x, y: -y }
}
