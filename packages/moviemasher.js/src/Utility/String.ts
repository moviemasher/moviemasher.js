import { isAboveZero, isPopulatedString } from "./Is"

export const stringSeconds = (seconds : number, fps : number = 0, lengthSeconds : number = 0) : string => {
  const bits: string[] = []
  let pad = 2
  let time = 60 * 60 // an hour
  let do_rest = false
  
  const duration = lengthSeconds || seconds

  // console.log("stringSeconds seconds", seconds, "fps", fps, "duration", duration)
  if (duration >= time) {
    if (seconds >= time) {
      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else bits.push('00:')
  }
  time = 60 // a minute
  if (do_rest || (duration >= time)) {
    // console.log("stringSeconds duration", duration, ">=", time, "time")
    if (do_rest) bits.push(':')
    if (seconds >= time) {
      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else bits.push('00:')
  } else {
    // console.log("stringSeconds duration", duration, "<", time, "time")
  }
  time = 1 // a second

  if (do_rest || (duration >= time)) {
    // console.log("stringSeconds duration", duration, ">=", time, "time")

    if (do_rest) bits.push(':')
    if (seconds >= time) {
      // console.log("stringSeconds seconds", seconds, ">=", time, "time")


      bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'))
      do_rest = true
      seconds = seconds % time
    } else {
      // console.log("stringSeconds seconds", seconds, "<", time, "time")
      bits.push('00')
    }
  } else {
    // console.log("stringSeconds duration", duration, "<", time, "time")
    bits.push('00')
  }
  if (fps > 1) {
    // console.log("stringSeconds fps", fps, "> 1")

    if (fps === 10) pad = 1
    bits.push('.')
    if (seconds) {
       // console.log("stringSeconds seconds", seconds, "true pad", pad)

      if (pad === 1) seconds = Math.round(seconds * 10) / 10
      else seconds = Math.round(100 * seconds) / 100
      
      // console.log("stringSeconds seconds", String(seconds), "presliced")
      seconds = Number(String(seconds).slice(2))

      // console.log("stringSeconds seconds", seconds, "sliced")

      bits.push(String(seconds).padEnd(pad, '0'))
      // console.log("stringSeconds seconds", seconds, "padded")
    } else {
      // console.log("stringSeconds seconds", seconds, "false")
      bits.push('0'.padStart(pad, '0'))
    }
  } else {
    // console.log("stringSeconds fps", fps, "<= 1")
  }
  return bits.join('')
}

export const stringWidthForFamilyAtHeight = (string: string, family: string, height: number): [number, number, number] => {
  if (!(isPopulatedString(string) && isAboveZero(height))) return [0, 0, 0]

  if (!globalThis.document) throw 'wrong environment'
  
  const canvas = globalThis.document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.font = `${height}px ${family}`

  const text = ctx.measureText(string)
  const font = new FontFace(family, string)
  const { actualBoundingBoxLeft, actualBoundingBoxRight, width, actualBoundingBoxAscent, fontBoundingBoxAscent } = text
  // console.log("stringWidthForFamilyAtHeight", ctx.font, height, width, actualBoundingBoxLeft,actualBoundingBoxAscent, text)
  return [width, actualBoundingBoxLeft, height - actualBoundingBoxAscent]
}//fontBoundingBoxAscent -

export const stringPluralize = (count: number, value: string, suffix = 's'): string => {
  if (!isPopulatedString(value)) return value

  return `${count} ${value}${count === 1 ? '' : suffix}`
}
