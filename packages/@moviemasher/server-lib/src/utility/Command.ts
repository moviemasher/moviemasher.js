import type { Rect, Size, Strings, Transparency, ValueRecord } from '@moviemasher/shared-lib/types.js'
import type { CommandFilter, CommandFilters, ServerAudioInstance } from '../types.js'
import type { EvaluationSize, ErrorObject, StringTuple } from '@moviemasher/shared-lib/types.js'

import { COLON, COMMA, DASH, DOT, EQUALS, ERROR, NEWLINE, SEMICOLON, SIZE_KEYS, SLASH, SPACE, arrayFromOneOrMore, arrayLast, } from '@moviemasher/shared-lib/runtime.js'
import { ENV_KEY, ENV } from './env.js'
import { $ALPHA, $FRAME, idGenerate } from '@moviemasher/shared-lib/runtime.js'
import { copyPoint } from '@moviemasher/shared-lib/utility/rect.js'
import { isNumeric, isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'

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

export const scaleFilter = (inputId: string, outputId: string, size: EvaluationSize): CommandFilter => {
  const options: ValueRecord = { 
    width: String(size.width),
    height: String(size.height),
    // sws_flags: 'accurate_rnd',
  }
  if (!(isNumeric(options.width) && isNumeric(options.height))) options.eval = $FRAME
  const outputs = []
  if (outputId) outputs.push(outputId)

  const commandFilter: CommandFilter = {
    ffmpegFilter: 'scale', options, inputs: [inputId], outputs
  }
  // console.log('scaleCommandFilter', commandFilter)
  return commandFilter
}

export const formatFilter = (inputId: string, outputId: string, pix_fmts = 'yuva420p'): CommandFilter => {
  const formatCommandFilter: CommandFilter = {
    ffmpegFilter: 'format',  options: { pix_fmts },
    inputs: [inputId], outputs: [outputId]
  }
  return formatCommandFilter

}

export const setPtsSpeedFilters = (inputId: string, outputId: string, instance: ServerAudioInstance): CommandFilters => {
  const filters: CommandFilters = []
  const { speed } = instance
  let filterInput = inputId
  const setptsFilter = 'setpts'
  const setptsId = idGenerate(setptsFilter)
  if (speed !== 1) {
    const firstSetptsCommandFilter: CommandFilter = {
      ffmpegFilter: setptsFilter,
      options: { expr: `PTS-STARTPTS` },
      inputs: [filterInput], outputs: [setptsId]
    }
    filters.push(firstSetptsCommandFilter)
    filterInput = setptsId
  }
  const secondSetptsCommandFilter: CommandFilter = {
    ffmpegFilter: setptsFilter,
    options: { expr: `((PTS)/${speed})-STARTPTS` },
    inputs: [filterInput], outputs: [outputId]
  }
  filters.push(secondSetptsCommandFilter)
  return filters
}


export const cropFilter = (inputId: string, outputId: string, rect: Rect): CommandFilter => {
  const options: ValueRecord =  { ...copyPoint(rect) }// exact: 1 
  const outputs = []
  if (outputId) outputs.push(outputId)
  const { width, height } = rect
  if (width) options.w = width
  if (height) options.h = height
  const cropFilter: CommandFilter = {
    ffmpegFilter: 'crop', options, inputs: [inputId], outputs
  }
  // console.log('cropFilter', cropFilter)
  return cropFilter
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

export const colorFilter = (outputId: string, color: string, rate: number, size?: Size, duration?: number ) => {
  const ffmpegFilter = 'color'
  const id = outputId || idGenerate('color')
 
  const options: ValueRecord = { color, rate }
  if (duration) options.duration = duration
  if (size) options.size = sizeValueString(size)
  const commandFilter: CommandFilter = {
    ffmpegFilter, options, inputs: [], outputs: [id]
  }
  // console.log('colorFilter', color, size, 'as', id)
  return commandFilter
}

export const setsarFilter = (inputId: string, outputId: string, size?: Size): CommandFilter => {
  const options: ValueRecord = {sar: 1}
  if (size) options.sar = SIZE_KEYS.map(key => size[key]).join(SLASH)
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'setsar', options,
    inputs: [inputId], outputs: [outputId]
  }
  return commandFilter
}

export const fpsFilter = (inputId: string, outputId: string, fps: number): CommandFilter => {
  const id = outputId || idGenerate('setsar')
  const options: ValueRecord = { fps }
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'fps', options, 
    inputs: [inputId], outputs: [outputId]
  }
  return commandFilter
}

export const copyFilter = (inputId: string, outputId: string, ) => {
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'copy', options: {}, 
    inputs: [inputId], outputs: [outputId]
  }
  // console.log('copyFilter', commandFilter)
  return commandFilter
}

export const alphamergeFilters = (maskInput: string, maskedInput: string, outputId: string, transparency: Transparency, debug?: boolean): CommandFilters => {
  const mergeFilter = debug ? 'overlay' : 'alphamerge'
  const extract = debug ? false : (transparency === $ALPHA)
  const extractFilter = 'alphaextract'
  const extractId = idGenerate(extractFilter)
  const filters: CommandFilters = []
  let inputId: string = maskInput
  if (extract) {
    const alphaCommandFilter: CommandFilter = {
      ffmpegFilter: extractFilter, options: {},
      inputs: [inputId], outputs: [extractId]
    }
    filters.push(alphaCommandFilter)
    inputId = extractId
  }
  const options: ValueRecord = {}
  const outputs = []
  if (outputId) outputs.push(outputId)
  const commandFilter: CommandFilter = {
    ffmpegFilter: mergeFilter, options,
    inputs: [maskedInput, inputId], outputs
  }
  filters.push(commandFilter)
  // console.log('alphamergeCommandFilters', filters)
  return filters
}

export const overlayFilter = (bottomInput: string, topInput: string, outputId: string, alpha?:boolean, values?: ValueRecord): CommandFilter =>{
  const doStack = false// !(alpha || values)
  
  const options: ValueRecord = doStack ? {} : { 
    alpha: 'straight', ...(values || {}) //format: alpha ? 'yuv420p10' : 'yuv420', 
  }
  const ffmpegFilter = doStack ? 'vstack' : 'overlay'

  const outputs: Strings = []
  if (outputId) outputs.push(outputId)
  
  
  const filter: CommandFilter = {
    ffmpegFilter, options,
    inputs: [bottomInput, topInput], outputs,
  }
  // console.log('overlayCommandFilter', topInput, 'over', bottomInput, 'as', outputId, values)
  return filter
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
    