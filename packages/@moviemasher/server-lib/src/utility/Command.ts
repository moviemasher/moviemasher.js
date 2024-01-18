import type { ErrorObject, Size, StringTuple, Strings, Value } from '@moviemasher/shared-lib/types.js'

import { isSize } from '@moviemasher/shared-lib/utility/guards.js'
import { sizesEqual } from '@moviemasher/shared-lib/utility/rect.js'
import { DASH, DOT, ERROR, NEWLINE, SEMICOLON, SPACE, arrayLast, isNumber, isNumeric, isPopulatedString } from '@moviemasher/shared-lib/runtime.js'
import { ENV_KEY, ENV } from './EnvironmentConstants.js'

const commandExpandComplex = (trimmed: string): string => {
  if (!trimmed.includes(SEMICOLON)) return trimmed
  
  const lines = trimmed.split(SEMICOLON)
  const broken = lines.map(line => {
    const [firstChar, secondChar] = line
    if (firstChar !== '[' || isNumeric(secondChar)) return `${NEWLINE}${line}`
    return line
  })
  return broken.join(`${SEMICOLON}${NEWLINE}`)
}

const commandQuoteComplex = (trimmed: string): string => {
  if (!trimmed.includes(SEMICOLON)) return trimmed
  
  return `'${trimmed}'`
}

export const sizeValueString = (size: Size): string => {
  const { width, height } = size
  return [width, height].join('x')
}

export const commandString = (args: string[], destination: string, expanded?: boolean): string => {
  let name = ''
  let foundYes = false
  const params: StringTuple[] = []
  
  const rootPath = ENV.get(ENV_KEY.DirRoot) 
  args.forEach(arg => {
    if (!isPopulatedString(arg)) return

    const trimmed = arg.trim()
    const firstArgChar = trimmed.slice(0, 1)
    const isName = firstArgChar === DASH
    if (isName) {
      if (name) params.push([name, ''])
      name = trimmed.slice(1)
      if (name === 'y') foundYes = true
    } else {
      if (name) params.push([name, trimmed])//.replace(rootPath, '')
      name = ''
    }
  })
  // make sure command has YES option
  if (!foundYes) params.unshift(['y', ''])
  const commandParams = params.map(([name, value]) => {
    const nameParam = `-${name}`
    if (!value) return nameParam

    if (expanded) return `${nameParam} ${commandExpandComplex(value)}${NEWLINE}`

    return `${nameParam} ${commandQuoteComplex(value)}` 
  })
  commandParams.unshift('ffmpeg')
  if (destination) {
    const replaced = destination.replace(rootPath, '')
    const lastParam = arrayLast(commandParams)
    if (!lastParam?.endsWith(replaced)) commandParams.push(replaced)
  }
  return commandParams.join(' ')
}

// TODO: surface common errors
export const commandError = (args: Strings, destination: string, error: any, stderr?: string, _stdout?: string): ErrorObject => {
  const standard = stderr && stderr.split(NEWLINE).join(DOT + SPACE)
  const message = standard || String(error.message || error)
  const cause = commandString(args, destination, true) 
  return { name: ERROR.Ffmpeg, message, cause }
}

export const tweenPosition = (videoRate: number, duration: number, offset = 0): string => {
  const frames = (offset - 1) + (videoRate * duration) //+ ((offset - 1) * (1 / videoRate)))
  const nLessOffset = parens(operate($SUBTRACT, ['n', offset]))
  return String(parens(operate($DIVIDE, [nLessOffset, frames])))
}

export const tweenOption = (optionStart: number, optionEnd: number, pos: string, round?: boolean): Value => {

  const start = round ? Math.round(optionStart) : optionStart
  if (!isNumber(optionEnd)) return start

  const end = round ? Math.round(optionEnd) : optionEnd
  if (start === end) return start
 
  return parens(operate($ADD, [start, parens(operate($MULTIPLY, [end - start, pos]))]))
}

export const tweenMaxSize = (size: Size, sizeEnd?: any): Size => {
  const { width, height } = size
  if (!isSize(sizeEnd) || sizesEqual(size, sizeEnd)) return { width, height }

  return {
    width: Math.max(width, sizeEnd.width),
    height: Math.max(height, sizeEnd.height),
  }
}
