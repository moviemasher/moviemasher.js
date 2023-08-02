import type { Lock } from './Lock.js'

export interface Size {
  width: number
  height: number
}
export type Sizes = Size[]
export type SizeTuple = [Size, Size]

export interface SizeOptions extends Partial<Size> {
  lock?: Lock
  shortest?: 'width' | 'height'
}

export type PropertySize = 'width' | 'height'
