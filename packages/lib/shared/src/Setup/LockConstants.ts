import type { Lock } from '@moviemasher/runtime-shared'
import { errorThrow } from '@moviemasher/runtime-shared'


export const LockWidth: Lock = 'width'
export const LockHeight: Lock = 'height'
export const LockNone: Lock = 'none'
export const LockLongest: Lock = 'longest'
export const LockShortest: Lock = 'shortest'

export const Locks: Lock[] = [LockHeight, LockLongest, LockNone, LockShortest, LockWidth]

export const isLock = (value: any): value is Lock => (
  Locks.includes(value as Lock)
)

export function assertLock(value: any, name?: string): asserts value is Lock {
  if (!isLock(value))
    errorThrow(value, 'Lock', name)
}

export const AspectFlip = 'flip'
export const AspectMaintain = 'maintain'

export const Aspects = [AspectFlip, AspectMaintain] 