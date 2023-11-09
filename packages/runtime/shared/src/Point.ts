export interface Point {
  x: number
  y: number
}

export interface Points extends Array<Point>{}

export type PointTuple = [Point, Point]

export type PropertyPoint = 'x' | 'y'