import type { Framed, Indexed, Ordered, Tracked } from './Base.js'

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
