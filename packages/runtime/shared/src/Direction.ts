
export type Direction = SideDirection | CornerDirection

export type SideDirection = 'top' | 'right' | 'bottom' | 'left'


export type CornerDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface Directions extends Array<Direction>{}
export type SideDirectionRecord = {
  [index in SideDirection]?: boolean
}
