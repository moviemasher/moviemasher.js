import { ContextFactory } from "../Context"
import { isAboveZero, isPopulatedString } from "./Is"

export const stringSeconds = (seconds : number, fps : number, duration : number) : string => {
  let time, pad, do_rest, s = ''
  if (! duration) duration = seconds
  time = 60 * 60 // an hour
  pad = 2
  if (duration >= time) {
    if (seconds >= time) {
      s += String(Math.floor(seconds / time)).padStart(pad, '0')
      do_rest = true
      seconds = seconds % time
    } else s += '00:'
  }
  time = 60 // a minute
  if (do_rest || (duration >= time)) {
    if (do_rest) s += ':'
    if (seconds >= time) {
      s += String(Math.floor(seconds / time)).padStart(pad, '0')
      do_rest = true
      seconds = seconds % time
    } else s += '00:'
  }
  time = 1 // a second
  if (do_rest || (duration >= time)) {
    if (do_rest) s += ':'
    if (seconds >= time) {
      s += String(Math.floor(seconds / time)).padStart(pad, '0')
      do_rest = true
      seconds = seconds % time
    } else s += '00'
  } else s += '00'
  if (fps > 1) {
    if (fps === 10) pad = 1
    s += '.'
    if (seconds) {
      if (pad === 1) seconds = Math.floor(seconds * 10) / 10
      else seconds = Math.floor(100 * seconds) / 100
      seconds = Number(String(seconds).slice(2, 2))
      s += String(seconds).padStart(pad, '0')
    } else s += '0'.padStart(pad, '0')
  }
  return s
}

export const stringWidthForFamilyAtHeight = (string: string, family: string, height: number): [number, number] => {
  if (!(isPopulatedString(string) && isAboveZero(height))) return [0, 0]

  const canvas = globalThis.document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.font = `${height}px ${family}`

  const text = ctx.measureText(string)
  // console.log("stringWidthForFamilyAtHeight", ctx.font, text)
  const { actualBoundingBoxLeft, actualBoundingBoxRight } = text
  return [actualBoundingBoxRight + actualBoundingBoxLeft, actualBoundingBoxLeft]
}

export const stringPluralize = (count: number, value: string, suffix = 's'): string => {
  if (!isPopulatedString(value)) return value

  return `${count} ${value}${count === 1 ? '' : suffix}`
}
