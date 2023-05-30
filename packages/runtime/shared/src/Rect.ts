import type { Point } from './Point.js'
import type { Size } from './Size.js'
import type { Lock } from './Lock.js'

export interface Rect extends Size, Point { }

export type Rects = Rect[]

export type RectTuple = [Rect, Rect]

export interface RectOptions extends Partial<Rect> {
  lock?: Lock
}
