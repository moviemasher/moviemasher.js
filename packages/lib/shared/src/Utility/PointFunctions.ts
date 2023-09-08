import { isNumber, isObject } from "@moviemasher/runtime-shared"
import { errorThrow } from '@moviemasher/runtime-shared'
import { CommaChar, EqualsChar, SemicolonChar } from '../Setup/Constants.js'
import { Point } from '@moviemasher/runtime-shared'
import { isAboveZero } from "../Shared/SharedGuards.js"


export const isPoint = (value: any): value is Point => {
  return isObject(value) &&
    'x' in value && 'y' in value &&
    isNumber(value.x) && isNumber(value.y)
}


export const pointAboveZero = (point: any): point is Point => {
  if (!isPoint(point)) return false

  const { x, y } = point
  return isAboveZero(x) && isAboveZero(y)
}

export function assertPoint(value: any, name?: string): asserts value is Point {
  if (!isPoint(value))
    errorThrow(value, 'Point', name)
}


export const pointsEqual = (point: Point, pointEnd?: any) => {
  if (!isPoint(pointEnd)) return false

  return point.x === pointEnd.x && point.y === pointEnd.y
}


export const pointCopy = (point: any): Point => {
  const { x, y } = point
  return { x, y }
}

export const pointRound = (point: Point): Point => {
  const { x, y } = point
  return { x: Math.round(x), y: Math.round(y) }
}

export const pointString = (point: Point): string => {
  const { x, y } = point
  return [
    ['x', x].join(EqualsChar), ['y', y].join(EqualsChar)
  ].join(SemicolonChar)
}

export const pointValueString = (point: Point): string => {
  const { x, y } = point
  return [x, y].join(CommaChar)
}

export const pointNegate = (point: Point): Point => {
  const { x, y } = point
  return { x: -x, y: -y }
}

export const pointFlip = (point: Point): Point => {
  const { x, y } = point
  return { x: y, y: x }
}

export const pointTranslate = (point: Point, translate: Point, negate = false): Point => {
  const { x, y } = point
  const negator = negate ? -1 : 1
  const { x: tx, y: ty } = translate
  return { x: x + tx * negator, y: y + ty * negator }
}

