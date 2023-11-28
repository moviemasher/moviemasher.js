import type { CornerDirection, Directions, SideDirection } from './Direction.js';


export const LEFT: SideDirection = 'left';
export const TOP: SideDirection = 'top';
export const BOTTOM: SideDirection = 'bottom';
export const RIGHT: SideDirection = 'right';

export const DIRECTIONS_SIDE: SideDirection[] = [
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
]

export const TOP_RIGHT: CornerDirection = 'top-right'
export const TOP_LEFT: CornerDirection = 'top-left'
export const BOTTOM_RIGHT: CornerDirection = 'bottom-right'
export const BOTTOM_LEFT: CornerDirection = 'bottom-left'

export const DIRECTIONS_CORNER = [
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
]

export const DIRECTIONS_ALL: Directions = [
  ...DIRECTIONS_CORNER,
  ...DIRECTIONS_SIDE,
]
