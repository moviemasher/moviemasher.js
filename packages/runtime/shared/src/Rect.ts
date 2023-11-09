import type { Point, PropertyPoint } from './Point.js'
import type { PropertySize, Size, SizeOptions } from './Size.js'

export interface Rect extends Size, Point { }

export interface Rects extends Array<Rect>{}

export type RectTuple = [Rect, Rect]

export interface RectOptions extends SizeOptions, Partial<Point> {}

export type PropertyRect = PropertySize | PropertyPoint