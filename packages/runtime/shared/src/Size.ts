import type { Lock } from './Lock.js'


export interface Size {
  width: number
  height: number
}

export interface Sizes extends Array<Size> {}
export interface SizeTuple extends Array<Size> { length: 2 }

// export type SizeTuple = [Size, Size]


export interface SizeOptions extends Partial<Size> {
  lock?: Lock
  shortest?: 'width' | 'height'
}


export type PropertySize = 'width' | 'height'
