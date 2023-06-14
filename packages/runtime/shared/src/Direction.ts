
export type Direction = SideDirection | CornerDirection

export type SideDirection = EastDirection | NorthDirection | SouthDirection | WestDirection

export type EastDirection = 'east'
export type NorthDirection = 'north'
export type SouthDirection = 'south'
export type WestDirection = 'west'

export type NorthEastDirection = 'northeast'
export type NorthWestDirection = 'northwest'
export type SouthEastDirection = 'southeast'
export type SouthWestDirection = 'southwest'

export type CornerDirection = NorthEastDirection | NorthWestDirection | SouthEastDirection | SouthWestDirection

export type DirectionsArray = Direction[]
export type SideDirectionObject = {
  [index in SideDirection]?: boolean
}
