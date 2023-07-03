import type { Lock } from '@moviemasher/runtime-shared';
import { errorThrow } from '@moviemasher/runtime-shared';


export const LockWidth: Lock = 'width';
export const LockHeight: Lock = 'height';
export const LockNone: Lock = 'none';

export const Locks: Lock[] = [LockWidth, LockHeight, LockNone];

export const isLock = (value: any): value is Lock => (
  Locks.includes(value as Lock)
);

export function assertLock(value: any, name?: string): asserts value is Lock {
  if (!isLock(value))
    errorThrow(value, 'Lock', name);
}
