import type { ErrorObject, StringTuple, Strings } from '@moviemasher/runtime-shared'

import { DASH, DOT, NEWLINE, SEMICOLON, SPACE, arrayLast } from '@moviemasher/lib-shared'
import { ERROR, isNumeric, isPopulatedString } from '@moviemasher/runtime-shared'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'

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

export const commandString = (args: string[], destination: string, exapnded?: boolean): string => {
  let name = ''
  let foundYes = false
  const params: StringTuple[] = []
  
  const rootPath = ENVIRONMENT.get(ENV.DirRoot) 
  args.forEach(arg => {
    if (!isPopulatedString(arg)) return

    const trimmed = arg.trim()
    const firstArgChar = trimmed.slice(0, 1)
    const isName = firstArgChar === DASH
    if (isName) {
      if (name) {
        params.push([name, ''])
      }
      name = trimmed.slice(1)
      if (name === 'y') foundYes = true
    } else {
      if (name) params.push([name, trimmed.replaceAll(rootPath, '')])
      name = ''
    }
  })
  // make sure command has YES option
  if (!foundYes) params.unshift(['y', ''])
  const commandParams = params.map(([name, value]) => {
    const nameParam = `-${name}`
    if (!value) return nameParam

    if (exapnded) return `${nameParam} ${commandExpandComplex(value)}${NEWLINE}`

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

export const commandError = (args: Strings, destination: string, error: any, stderr?: string, _stdout?: string): ErrorObject => {
  const standard = stderr && stderr.split(NEWLINE).join(DOT + SPACE)
  const message = standard || String(error.message || error)
  const cause = commandString(args, destination) 
  return { name: ERROR.Ffmpeg, message, cause }
}

