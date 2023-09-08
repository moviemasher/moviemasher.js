import type { ClientAsset } from '@moviemasher/runtime-client'
import type { Framed, Indexed, Ordered, Tracked } from '@moviemasher/runtime-shared'

import { isRequestable } from '../Base/Requestable/RequestableFunctions.js'

export const sortByFrame = (a : Framed, b : Framed) : number => (
  a.frame - b.frame
)

export const sortByOrder = (a : Ordered, b : Ordered) : number => {
  const { order: orderA = Number.MAX_SAFE_INTEGER } = a
  const { order: orderB = Number.MAX_SAFE_INTEGER } = b
  return orderA - orderB
}

export const sortByIndex = (a : Indexed, b : Indexed) : number => (
  a.index - b.index
)

export const sortByTrack = (a : Tracked, b : Tracked) : number => (
  a.trackNumber - b.trackNumber
)

export const sortByRequestable = (a: ClientAsset, b: ClientAsset): number => {
  const aIsRequestable = isRequestable(a)
  const bIsRequestable = isRequestable(b)
  if (aIsRequestable === bIsRequestable) return 0
  if (aIsRequestable) return -1
  return 1
}
