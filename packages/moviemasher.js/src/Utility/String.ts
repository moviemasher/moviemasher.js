import { isPopulatedString } from "./Is"

const stringSeconds = (seconds : number, fps : number, duration : number) : string => {
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
      seconds = Number(String(seconds).substr(2, 2))
      s += String(seconds).padStart(pad, '0')
    } else s += '0'.padStart(pad, '0')
  }
  return s
}

const stringCapitalize = (value : string) : string => {
  if (!isPopulatedString(value)) return value

  return `${value[0].toUpperCase()}${value.substr(1)}`
}
const stringPluralize = (count: number, value: string, suffix = 's'): string => {
  if (!isPopulatedString(value)) return value

  return `${count} ${value}${count === 1 ? '' : suffix}`
}

const StringUtility = {
  seconds: stringSeconds, capitalize: stringCapitalize, pluralize: stringPluralize,
}
export { StringUtility as String, stringSeconds, stringCapitalize, stringPluralize }
