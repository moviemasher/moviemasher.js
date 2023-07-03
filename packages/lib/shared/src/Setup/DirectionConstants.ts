import type { CornerDirection, DirectionsArray, SideDirection } from '@moviemasher/runtime-shared';
import { errorThrow } from '@moviemasher/runtime-shared';


export const DirectionEast: SideDirection = 'east';
export const DirectionNorth: SideDirection = 'north';
export const DirectionSouth: SideDirection = 'south';
export const DirectionWest: SideDirection = 'west';


export const SideDirections = [
  DirectionEast,
  DirectionNorth,
  DirectionSouth,
  DirectionWest,
];

export const isSideDirection = (value?: any): value is SideDirection => {
  return Directions.includes(value as SideDirection);
};
export function assertSideDirection(value: any, name?: string): asserts value is SideDirection {
  if (!isSideDirection(value)) errorThrow(value, 'SideDirection', name);
}

export const DirectionNorthEast: CornerDirection = 'northeast';
export const DirectionNorthWest: CornerDirection = 'northwest';
export const DirectionSouthEast: CornerDirection = 'southeast';
export const DirectionSouthWest: CornerDirection = 'southwest';

export const CornerDirections = [
  DirectionNorthEast,
  DirectionNorthWest,
  DirectionSouthEast,
  DirectionSouthWest,
];

export const Directions: DirectionsArray = [
  ...CornerDirections,
  ...SideDirections,
];
