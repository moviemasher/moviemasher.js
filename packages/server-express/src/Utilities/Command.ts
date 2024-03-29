import path from 'path'
import { isNumeric, isPopulatedString } from "@moviemasher/moviemasher.js"

type StringTuple = [string, string]

const commandErrorRegex = [
  /Input frame sizes do not match \([0-9]*x[0-9]* vs [0-9]*x[0-9]*\)/,
  /Option '[0-9a-z_-]*' not found/,
  'Error:',
  'Cannot find a matching stream',
  'Unable to parse option value',
  'Invalid too big or non positive size',
]
const commandNL = "\n"
export const commandExpandComplex = (trimmed: string): string => {
  if (!trimmed.includes(';')) return trimmed
  
  const lines = trimmed.split(';')
  const broken = lines.map(line => {
    const [firstChar, secondChar] = line
    if (firstChar !== '[' || isNumeric(secondChar)) return `${commandNL}${line}`
    return line
  })
  return broken.join(`;${commandNL}`)
}
export const commandQuoteComplex = (trimmed: string): string => {
  if (!trimmed.includes(';')) return trimmed
  
  return `'${trimmed}'`
}

// export const command
export const commandErrors = (...args: any[]): string[] => {
  return args.flatMap(arg => {
    const stringArg = String(arg)
    const lines = stringArg.split(commandNL).map(line => line.trim())
    return lines.filter(line => commandErrorRegex.some(regex => line.match(regex)))
  })
}

export const commandArgsString = (args: string[], destination: string, ...errors: any[]): string => {
  let name = ''
  const isError = !!errors.length
  const params: StringTuple[] = []
  const rootPath = `${path.resolve('./')}/`
  args.forEach(arg => {
    if (!isPopulatedString(arg)) return

    const trimmed = arg.trim()
    const firstArgChar = trimmed.slice(0, 1)
    const isName = firstArgChar === '-' 
    if (isName) {
      if (name) params.push([name, ''])
      name = trimmed.slice(1)
    } else {
      if (name) params.push([name, trimmed.replaceAll(rootPath, '')])
      name = ''
    }
  })

  const displayParams: string[] = []
  if (isError && destination) {
    displayParams.push(`${destination} failed`)
    displayParams.push(...commandErrors(...errors))
  }
  
  displayParams.push('ffmpeg')
  displayParams.push(...params.map(([name, value]) => (
    value ? `-${name} ${commandExpandComplex(value)}${commandNL}` : `-${name}${commandNL}`
  )))
  if (destination) displayParams.push(destination)
  
  if (!isError) params.unshift(['y', ''])
  const commandParams = params.map(([name, value]) => (
     value ? `-${name} ${commandQuoteComplex(value)}` : `-${name}`
  ))
  commandParams.unshift('ffmpeg')
  if (destination) commandParams.push(destination)

  const blocks = [displayParams.join(commandNL)]
  blocks.push(...errors)
  blocks.push(commandParams.join(' '))
  return blocks.join(`${commandNL}${commandNL}`)
}