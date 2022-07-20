import { throwError } from "./Is";
import { isPoint, Point } from "./Point";
import { isSize, Size } from "./Size";



export interface Rect extends Size, Point { }
export const isRect = (value: any): value is Rect => {
  return isSize(value) && isPoint(value) 
}
export function assertRect(value: any, name?: string): asserts value is Rect {
  if (!isRect(value)) throwError(value, 'Rect', name)
}



export type Rects = Rect[]

export type RectTuple = [Rect, Rect]