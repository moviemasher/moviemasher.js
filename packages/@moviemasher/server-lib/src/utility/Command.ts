import type { CommandFilter, CommandFilters, ErrorObject, Size, StringTuple, Strings, ValueRecord } from '@moviemasher/shared-lib/types.js'

import { COLON, COMMA, DASH, DOT, EQUALS, ERROR, NEWLINE, SEMICOLON, SPACE, arrayFromOneOrMore, arrayLast, idGenerate } from '@moviemasher/shared-lib/runtime.js'
import { isNumeric, isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { $DirRoot, ENV } from './env.js'
import { sizeValueString } from '@moviemasher/shared-lib/utility/rect.js'

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


export const commandString = (args: string[], destination: string, expanded?: boolean): string => {
  let name = ''
  let foundYes = false
  const params: StringTuple[] = []
  
  const rootPath = ENV.get($DirRoot) 
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

export const formatFilter = (inputId: string, outputId: string, pix_fmts = 'yuva420p'): CommandFilter => {
  const formatCommandFilter: CommandFilter = {
    ffmpegFilter: 'format',  options: { pix_fmts },
    inputs: [inputId], outputs: [outputId]
  }
  return formatCommandFilter

}

export const spectrumFilter = (outputId: string, rate: number, size?: Size): CommandFilter => {
  const ffmpegFilter = 'colorspectrum'
  const id = outputId || idGenerate('colorspectrum')

  const options: ValueRecord = { rate }
  if (size) options.size = sizeValueString(size)

  const commandFilter: CommandFilter = {
    ffmpegFilter, options, inputs: [], outputs: [id]
  }
  // console.log('colorspectrum', rate, 'as', id)
  return commandFilter
}

export const filtersString = (filters: CommandFilter | CommandFilters): string => {
  const array = arrayFromOneOrMore(filters)
  return array.map(filter => {
    const { ffmpegFilter, inputs, outputs, options } = filter
    const input = inputs.map(input => `[${input}]`).join('')
    const strings: Strings = []
    if (input) strings.push(input)
    strings.push(ffmpegFilter)
    const option = Object.entries(options).map(([k, v]) => `${k}=${v}`).join(COLON)
    if (option) strings.push(EQUALS, option)
    const output = outputs.map(output => `[${output}]`).join('')
    if (output) strings.push(output)
    return strings.join('')
  }).join(COMMA)
}


        // private amixCommandFilters(args: CommandFilterArgs): CommandFilters {
    //   const { chainInput, filterInput } = args
    //   const commandFilter: CommandFilter = {
    //     ffmpegFilter: 'amix',
    //     inputs: [chainInput, filterInput],
    //     options: { normalize: 0 }, outputs: []
    //   }
    //   return [commandFilter]
    // }



    // audibleCommandFilters(args: AudibleCommandFilterArgs): CommandFilters {
    //   const commandFilters: CommandFilters = []
    //   const { time, clipTime } = args
    //   assertTimeRange(time)
    //   assertTimeRange(clipTime)

    //   const { fps } = time

    //   const intersection = time.intersection(clipTime)
    //   if (!intersection) return commandFilters

    //   const { id, speed } = this


    //   const [_, startTrimFrame] = this.assetFrames(fps)
    //   // const durationTime = timeFromArgs(durationFrames - (startTrimFrame - endTrimFrame), fps)
    //   const duration = intersection.lengthSeconds * speed // Math.min(time.seconds, durationTime.seconds, clipTime.lengthSeconds)


    //   let filterInput = [id, 'a'].join(COLON)

    //   const trimFilter = 'atrim'
    //   const trimId = idGenerate(trimFilter)

    //   // const assetTime = this.assetTime(time)
    //   // const { frame } = assetTime
    //   // console.log(this.constructor.name, 'audibleCommandFilters', {time, clipTime, assetTime})
    //   const trimOptions: ValueRecord = { duration }
    //   if (startTrimFrame) trimOptions.start = startTrimFrame / fps

    //   const commandFilter: CommandFilter = {
    //     inputs: [filterInput],
    //     ffmpegFilter: trimFilter,
    //     options: trimOptions,
    //     outputs: [trimId]
    //   }
    //   commandFilters.push(commandFilter)
    //   filterInput = trimId

    //   if (speed !== 1) {
    //     const atempoFilter = 'atempo'
    //     const atempoId = idGenerate(atempoFilter)
    //     const atempoCommandFilter: CommandFilter = {
    //       inputs: [filterInput],
    //       ffmpegFilter: atempoFilter,
    //       options: { tempo: speed },
    //       outputs: [atempoId]
    //     }
    //     commandFilters.push(atempoCommandFilter)
    //     filterInput = atempoId
    //   }


    //   const delays = (clipTime.seconds - time.seconds) * 1000
    //   if (delays) {
    //     const adelayFilter = 'adelay'
    //     const adelayId = idGenerate(adelayFilter)
    //     const adelayCommandFilter: CommandFilter = {
    //       ffmpegFilter: adelayFilter,
    //       options: { delays, all: 1 },
    //       inputs: [filterInput], outputs: [adelayId]
    //     }
    //     commandFilters.push(adelayCommandFilter)
    //     filterInput = adelayId
    //   }
    //   commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }))
    //   return commandFilters
    // }
    
export const copyFilter = (inputId: string, outputId: string, ) => {
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'copy', options: {}, 
    inputs: [inputId], outputs: [outputId]
  }
  // console.log('copyFilter', commandFilter)
  return commandFilter
}

