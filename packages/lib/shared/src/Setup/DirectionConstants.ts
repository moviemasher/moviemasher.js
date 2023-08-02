import type { CornerDirection, Directions, SideDirection } from '@moviemasher/runtime-shared'
import { errorThrow } from '@moviemasher/runtime-shared'

export const DirectionLeft: SideDirection = 'left'
export const DirectionTop: SideDirection = 'top'
export const DirectionBottom: SideDirection = 'bottom'
export const DirectionRight: SideDirection = 'right'

export const DIRECTIONS_SIDE = [
  DirectionLeft,
  DirectionRight,
  DirectionTop,
  DirectionBottom,
]

export const isSideDirection = (value?: any): value is SideDirection => {
  return DIRECTIONS.includes(value as SideDirection)
}

export function assertSideDirection(value: any, name?: string): asserts value is SideDirection {
  if (!isSideDirection(value)) errorThrow(value, 'SideDirection', name)
}

export const DirectionTopRight: CornerDirection = 'top-right'
export const DirectionTopLeft: CornerDirection = 'top-left'
export const DirectionBottomRight: CornerDirection = 'bottom-right'
export const DirectionBottomLeft: CornerDirection = 'bottom-left'

export const DIRECTIONS_CORNER = [
  DirectionTopRight,
  DirectionTopLeft,
  DirectionBottomRight,
  DirectionBottomRight,
]

export const DIRECTIONS: Directions = [
  ...DIRECTIONS_CORNER,
  ...DIRECTIONS_SIDE,
]
