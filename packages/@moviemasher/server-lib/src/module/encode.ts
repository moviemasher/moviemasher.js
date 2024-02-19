
import type { AVType, AbsolutePath, AssetObject, DataOrError, DecodeArgs, DropResource, DropType, EncodeFunction, EncodeOptions, Encoding, EncodingType, EndpointRequest, MashAssetObject, Numbers, OutputOptions, Probing, ProbingOptions, RawType, StringDataOrError, Strings, VideoOutputOptions } from '@moviemasher/shared-lib/types.js'
import type { RunningCommand } from '../command/RunningCommand.js'
import type { CommandFilters, CommandInput, CommandOptions, EncodeCommands, EncodeDescription, EncodeDescriptions, PrecodeCommands, ServerMashDescriptionOptions } from '../types.js'

import { $AUDIO, $BOTH, $DECODE, $DURATION, $IMAGE, $JSON, $MASH, $NUMBER, $PROBE, $RAW, $TXT, $VIDEO, COLON, DASH, DOT, ERROR, MOVIEMASHER, NEWLINE, PROBING_TYPES, errorCaught, idGenerate, idReset, isDefiniteError, isProbing, namedError, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import { isAboveZero, isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { assertAboveZero, isMashAsset } from '@moviemasher/shared-lib/utility/guards.js'
import path from 'path'
import { RunningCommandClass } from '../command/RunningCommandClass.js'
import { ENV, ENV_KEY } from '../utility/env.js'
import { EventServerManagedAsset } from '../utility/events.js'
import { directoryCreatePromise, fileNameFromOptions, fileWriteJsonPromise, fileWritePromise } from '../utility/file.js'
import { assertAbsolutePath, isServerAsset, isServerMashAsset } from '../utility/guard.js'
import { idUnique } from '../utility/id.js'
import { jobHasErrored, jobHasFinished, jobHasStarted } from '../utility/job.js'

type PathDurationTuple = [string, number]

const $TS = 'ts'
const $WAV = 'wav'

// import { exec } from 'child_process'
// import { promisify } from 'util'

// const execPromise = promisify(exec)

// const spawnPromise = async (cmd: string, args: Strings): Promise<StringDataOrError> => {
//   try {
//     // stdout is reserved for data, feedback provided by stderr
//     const { stderr } =  await execPromise([cmd, ...args].join(' '))
//     return { data: stderr }
//   } catch (err) { return errorCaught(err) }
// }

const createDirectoryPromise = async (outPath: string): Promise<StringDataOrError> => {
  const parentDir = path.dirname(outPath)
  // console.log('createDirectoryPromise', parentDir)
  const orError = await directoryCreatePromise(parentDir)
  // console.log('createDirectoryPromise', orError)
  return orError
}

const createDirectorAndDebugPromise = async (instance: RunningCommand, outPath: string, index = -1): Promise<StringDataOrError> => {
  const orError = await createDirectoryPromise(outPath)
  if (isDefiniteError(orError)) return orError

  const suffix = isPositive(index) ? `-${index}` : ''
  const commandsText = instance.commandString(outPath)
  const dir = path.dirname(outPath)
  const commandPath = path.join(dir, `command${suffix}.${$TXT}`)
  const writeOrError = await fileWritePromise(commandPath, commandsText)
  if (isDefiniteError(writeOrError)) return writeOrError

  return { data: outPath }
}

const probePromise = async (outPath: AbsolutePath, type: DropType): Promise<DataOrError<Probing>> => {
  const decodeOptions: ProbingOptions = { types: PROBING_TYPES }
  const request: EndpointRequest = { endpoint: outPath, path: outPath }
  const resource: DropResource = { request, type }
  const args: DecodeArgs = { resource, type: $PROBE, options: decodeOptions}
  const promise = MOVIEMASHER.promise($DECODE, args)
  const orError = await promise
  if (isDefiniteError(orError)) return orError

  const { data: probing } = orError
  if (!isProbing(probing)) return namedError(ERROR.Internal, 'decoding')

  return { data: probing }
}

const renderResultPromise = async (outPath: string, instance: RunningCommand): Promise<StringDataOrError> => {
  const orError = await instance.runPromise(outPath)
  if (isDefiniteError(orError)) return orError
  
  return { data: outPath }
}

const concatString = (fileDurations: PathDurationTuple[]): string => {
  const lines = ['ffconcat version 1.0']
  lines.push(...fileDurations.flatMap(fileDuration => {
    const [file, duration] = fileDuration
    return [`file '${file}'`, `duration ${duration}`]
  }))
  return lines.join(NEWLINE)
}

const commandPromise = async (pathFragment: string, outputPath: AbsolutePath, encodingType: EncodingType, outputOptions: OutputOptions, commandDescription: EncodeDescription, index = -1) => {
  const debug = ENV.get(ENV_KEY.Debug, $NUMBER)
    outputOptions.options ||= {}
  const { options } = outputOptions  
  const { duration } = commandDescription

  const commandOptions: CommandOptions = {
    output: outputOptions, ...commandDescription
  }
  switch (encodingType) {
    case $IMAGE: {
      options['frames:v'] = 1
      break
    }
    default: {
      if (duration) options.t = duration
    }
  }
  const instance =  new RunningCommandClass(pathFragment, commandOptions)
  if (debug) {
    const orError = await createDirectorAndDebugPromise(instance, outputPath, index)
    if (isDefiniteError(orError)) return orError
  } else {
    const orError = await createDirectoryPromise(outputPath)
    if (isDefiniteError(orError)) return orError
  }
  const orError = await renderResultPromise(outputPath, instance)
  if (isDefiniteError(orError)) return orError
  
  return await probePromise(outputPath, encodingType)
}

const combineDescriptions = async (descriptions: EncodeDescriptions, encodingType: EncodingType, pathFragment: string, outputOptions: OutputOptions): Promise<DataOrError<EncodeDescription>> => {
  // make a unique directory for the concat files
  const dir = encodeOutputPath(pathFragment, idGenerate('concat'))
  const directoryOrError = await directoryCreatePromise(dir)
  if (isDefiniteError(directoryOrError)) return directoryOrError

  const concatFilePath = path.join(dir, [encodingType, $TXT].join(DOT))
  const { extension } = outputOptions

  const fileDurations: PathDurationTuple[] = []
  for (const [index, description] of descriptions.entries()) {
    const baseName = `concat-${index}`
    const fileName = `${baseName}.${extension}`
    const outputPath = path.join(dir, fileName)
    assertAbsolutePath(outputPath)

    const { duration } = description
    if (!isAboveZero(duration)) return namedError(ERROR.Internal, $DURATION)
  
    const concatFileDuration: PathDurationTuple = [fileName, duration]
    
    const probingOrError = await commandPromise(pathFragment, outputPath, encodingType, outputOptions, description, index)
    if (isDefiniteError(probingOrError)) return probingOrError

    const { duration: probeDuration } = probingOrError.data.data
  
    if (!isAboveZero(probeDuration)) return namedError(ERROR.Internal, 'probeDuration')
    if (duration !== probeDuration) return namedError(ERROR.Internal, 'duration mismatch')

    fileDurations.push(concatFileDuration) 
  }

  
  const concatFile = concatString(fileDurations)
  const writeOrError = await fileWritePromise(concatFilePath, concatFile)
  if (isDefiniteError(writeOrError)) return writeOrError
  
  const durations = fileDurations.map(([_, duration]) => duration)
  const duration = durations.reduce((total, duration) => total + duration, 0)
  const commandInputId = idGenerate('concatted')
  const avType = encodingType === $AUDIO ? $AUDIO : $VIDEO
  const concatInput: CommandInput = { source: concatFilePath, avType }
  const description: EncodeDescription = { 
    commandFilters: [{ 
      inputs: [[commandInputId, avType[0]].join(COLON)], ffmpegFilter: 'copy', 
      options: {}, outputs: []
    }],
    inputsById: { [commandInputId]: concatInput}, 
    duration, avType
  }
  return {data: description}
}

const combinedRenderingDescriptionPromise = async (pathFragment: string, mashCommands: EncodeCommands): Promise<DataOrError<EncodeCommands>> => {
  // we'll return this or error object
  const result = { data: mashCommands }
  const { visibleDescriptions, audibleDescriptions, outputOptions, encodingType } = mashCommands
  const visibleCount = visibleDescriptions?.length 
  const audibleCount = audibleDescriptions?.length 
  // make sure we have some descriptions
  if (!(visibleCount || audibleCount)) return namedError(ERROR.Internal, 'descriptions')
  
  // if no concatenation is required, it's considered 'combined'
  if (visibleCount === 1 && audibleCount === 1) return result
  
  if (visibleCount && visibleCount > 1) {
    const { 
      audioBitrate, audioChannels, audioCodec, audioRate, options, ...rest 
    } = outputOptions
    const videoOptions: OutputOptions = { 
      ...rest, options: { ...options, an: '' }, extension: $TS 
    }
    const descriptionOrError = await combineDescriptions(visibleDescriptions, encodingType, pathFragment, videoOptions)
    if (isDefiniteError(descriptionOrError)) return descriptionOrError

    const { data: description } = descriptionOrError
    mashCommands.visibleDescriptions = [description]
  }

  if (audibleCount && audibleCount > 1) {
   const { 
      width, height, videoBitrate, videoCodec, videoRate, options, ...rest 
    } = outputOptions
    const audioOptions: OutputOptions = { 
      ...rest, options: { ...options, vn: '' }, extension: $WAV 
    }
    const descriptionOrError = await combineDescriptions(audibleDescriptions, encodingType, pathFragment, audioOptions)
    if (isDefiniteError(descriptionOrError)) return descriptionOrError

    const { data: description } = descriptionOrError
    mashCommands.audibleDescriptions = [description]
  }
  return result
}

const precodePromise = async (pathFragment: string, commands:PrecodeCommands): Promise<DataOrError<AbsolutePath[]>> => {
  const { commandDescriptions: descriptions, outputOptions, times } = commands
  const visibleCount = descriptions?.length 
  // make sure we have some descriptions
  if (!visibleCount) return namedError(ERROR.Internal, 'descriptions')
  
  const { 
    audioBitrate, audioChannels, audioCodec, audioRate, options: optionsOutput, ...rest 
  } = outputOptions
  const options: VideoOutputOptions = { 
    ...rest, options: { ...optionsOutput, an: '' }, extension: $TS 
  }
 
  const dir = encodeOutputPath(pathFragment, idGenerate('precode'))
  const directoryOrError = await directoryCreatePromise(dir)
  if (isDefiniteError(directoryOrError)) return directoryOrError

  const { extension } = options
  const data: AbsolutePath[] = []
  for (const [index, videoDescription] of descriptions.entries()) {
    const fileName = `precode-${index}.${extension}`
    const outputPath = path.join(dir, fileName)
    assertAbsolutePath(outputPath)

    const { duration, clip, inputsById } = videoDescription
    if (!isAboveZero(duration)) return namedError(ERROR.Internal, 'duration')
    const { timeRange } = clip
    const description = { ...videoDescription, avType: $VIDEO }
    const filtered = times.filter(time => timeRange.intersects(time))

    const [id] = Object.entries(inputsById).find(([id, input]) => input.avType === $VIDEO && id.startsWith(clip.content.id)) || []
    if (!id) return namedError(ERROR.Internal, 'id')

    options.options![`force_key_frames`] = filtered.map(time => time.seconds - timeRange.seconds).join(',')
    const probingOrError = await commandPromise(pathFragment, outputPath, $VIDEO, options, description, index)
    if (isDefiniteError(probingOrError)) return probingOrError

    const { duration: probeDuration } = probingOrError.data.data
  
    if (!isAboveZero(probeDuration)) return namedError(ERROR.Internal, 'probeDuration')
    if (duration !== probeDuration) return namedError(ERROR.Internal, 'duration mismatch')

    clip.precoding = outputPath
    data.push(outputPath)
  }
  return { data }
}

const mergedDescriptions = (descriptions: EncodeDescriptions): EncodeDescription | undefined => {
  switch (descriptions.length) {
    case 0: return
    case 1: return descriptions[0]
  }
  const filters: CommandFilters = []
  const durations: Numbers = []
  const types = new Set<AVType>()
  const inputsById = Object.fromEntries(descriptions.flatMap(description => {
    const { duration, inputsById: inputs, commandFilters, avType } = description
    assertAboveZero(duration, $DURATION)

    durations.push(duration)
    types.add(avType)
    if (commandFilters?.length) filters.push(...commandFilters)
    return inputs ? Object.entries(inputs) : []
  }))
  const avType = types.size === 1 ? [...types.values()].pop()! : $BOTH
  const commandDescription: EncodeDescription = { 
    inputsById, commandFilters: filters, avType, duration: Math.max(...durations)
  }
  return commandDescription
}

const mergedDescription = (flatDescription: EncodeCommands): EncodeDescription | undefined => {
  const { visibleDescriptions, audibleDescriptions } = flatDescription
  const descriptions: EncodeDescriptions = []
  // audible descriptions must come last
  if (visibleDescriptions) descriptions.push(...visibleDescriptions)
  if (audibleDescriptions) descriptions.push(...audibleDescriptions)
  return mergedDescriptions(descriptions) 
}

const writeMash = async (pathFragment: string, mashObject: AssetObject): Promise<StringDataOrError> => {
  const fileName = [$MASH, $JSON].join(DOT)
  const filePath = encodeOutputPath(pathFragment, fileName)
  const jsonOrError = await fileWriteJsonPromise(filePath, mashObject)
  if (isDefiniteError(jsonOrError)) return jsonOrError

  return { data: fileName }
}

const writeRawMash = async (pathFragments: string[], raw: AssetObject): Promise<DataOrError<AssetObject>> => {
  const result = { data: raw }
  const debug = ENV.get(ENV_KEY.Debug, $NUMBER)
  if (!debug) return result

  const fileName = [$MASH, DASH, $RAW, DOT, $JSON].join('')
  pathFragments.push(fileName)
  const filePath = encodeOutputPath(...pathFragments)
  const jsonOrError = await fileWriteJsonPromise(filePath, raw)
  if (isDefiniteError(jsonOrError)) return jsonOrError

  return result
}

const encodeOutputPath = (...pathFragments: string[]): AbsolutePath => {
  const root = path.resolve(ENV.get(ENV_KEY.OutputRoot))
  assertAbsolutePath(root)

  return absolutePathJoin(root, ...pathFragments)
}


const writeEncodingPromise = async (id: string, filePath: string, type: RawType) => {
  const relativeRoot = ENV.get(ENV_KEY.RelativeRequestRoot)
  const endpoint = relativeRoot ? path.relative(relativeRoot, filePath) : filePath
  const data: Encoding = { id, type, request: { endpoint } }
  return await jobHasFinished(id, data)
}

const absolutePathJoin = (absolutePath: AbsolutePath, ...pathFragments: string[]): AbsolutePath => {
  const joined = path.join(absolutePath, ...pathFragments)
  assertAbsolutePath(joined)

  return joined
}

const encodePromise = async ( mashAssetObject: MashAssetObject, id: string, encodeOptions: EncodeOptions = {}, encodingType?: EncodingType, prefix?: string): Promise<StringDataOrError> => {
  try {
    const pathFragments: Strings = [id]
    const type = encodingType || mashAssetObject.type 

    if (prefix) pathFragments.unshift(prefix)
    const pathFragment = path.join(...pathFragments) 
    const options = typeOutputOptions(type, encodeOptions)
    const encodePath = encodeOutputPath(pathFragment)
    const outputPath = absolutePathJoin(encodePath, fileNameFromOptions(options, type))
    const expectDuration = type !== $IMAGE
    idReset()
    const writeEmptyOrError = await jobHasStarted(id)
    if (isDefiniteError(writeEmptyOrError)) return writeEmptyOrError

    const writeRawOrError = writeRawMash(pathFragments, mashAssetObject)
    if (isDefiniteError(writeRawOrError)) return namedError(ERROR.Internal, 'writeRawPromise')

    // console.log('encode dispatching EventServerManagedAsset')
    const assetEvent = new EventServerManagedAsset(mashAssetObject)
    MOVIEMASHER.dispatch(assetEvent)
    const { asset } = assetEvent.detail
    if (!isServerMashAsset(asset)) {
      console.log('encode invalid mash asset', !!asset, isMashAsset(asset), isServerAsset(asset), mashAssetObject)
      return namedError(ERROR.Syntax, 'invalid mash asset')
    }
        // console.log('encode dispatched EventServerManagedAsset')

    const { assetObject } = asset
    const writeMashOrError = await writeMash(pathFragment, assetObject)
    if (isDefiniteError(writeMashOrError)) return writeMashOrError
    
    const args: ServerMashDescriptionOptions = { 
      encodePath, assetType: type, outputOptions: options
    }
    // console.log('encode dispatching EventServerMashDescription', args)
    const mashDescription = asset.mashDescription(args)
    const cacheOrError = await mashDescription.intrinsicsPromise
    if (isDefiniteError(cacheOrError)) return cacheOrError

    if (mashDescription.needsPrecoding) {
      const precodeCommandsOrError = await mashDescription.precodeCommandsPromise()
      if (isDefiniteError(precodeCommandsOrError)) return precodeCommandsOrError

      const { data: precodeCommands } = precodeCommandsOrError
      if (precodeCommands) {
        const precodeOrError = await precodePromise(pathFragment, precodeCommands)
        if (isDefiniteError(precodeOrError)) return precodeOrError

        // return namedError(ERROR.Unimplemented, 'precode')
      }
    }

    const encodeCommandsOrError = await mashDescription.encodeCommandsPromise()
    if (isDefiniteError(encodeCommandsOrError)) return encodeCommandsOrError

    const { data: encodeMashCommands} = encodeCommandsOrError

    // console.log('encode mashCommands', mashCommands.encodingType, mashDescription.time)

    const flatCommandsOrError = await combinedRenderingDescriptionPromise(pathFragment, encodeMashCommands)
    if (isDefiniteError(flatCommandsOrError)) return flatCommandsOrError

    const { data: flatCommands } = flatCommandsOrError
    const { outputOptions } = flatCommands
    const commandDescription = mergedDescription(flatCommands)
    if (!commandDescription) return namedError(ERROR.Internal, `required ${type} failed`)

    if (expectDuration) {
      const { duration } = commandDescription
      if (!duration) return namedError(ERROR.ImportDuration)
      
      // console.log('encode CREATE commandPromise', {encodingId})
      const probingOrError = await commandPromise(pathFragment, outputPath, type, outputOptions, commandDescription)
      if (isDefiniteError(probingOrError)) return probingOrError

      const { duration: probeDuration } = probingOrError.data.data
      if (!isPositive(probeDuration)) return namedError(ERROR.Internal, 'probeDuration')

    }
  
    const writeOrError = await writeEncodingPromise(id, outputPath, type)
    if (isDefiniteError(writeOrError)) return writeOrError
    
    return { data: outputPath }
  }
  catch (err) { return errorCaught(err) }
}

/**
 * Initiates an encode job.
 * @param asset What to encode.
 * @param encodeOptions Optional encode options, populated with defaults based on encodingType.
 * @param encodingType Optional output RawType, defaults to asset.type.
 * @param id Optional id for encode job, defaults to random UUID. Must be provided if encode status will be checked.
 * @param prefix Optional directory prefix appended to the environment's output directory.
 * @returns Promise returning object with error or data property containing the path to the encoded file.
 */
export const encode = (asset: MashAssetObject, encodeOptions?: EncodeOptions, encodingType?: EncodingType, id?: string, prefix?: string): Promise<StringDataOrError> => {
  const encodeId = id || idUnique()

  return encodePromise(asset, encodeId, encodeOptions, encodingType, prefix).then(orError => {
    if (isDefiniteError(orError)) return jobHasErrored(encodeId, orError.error).then(() => orError)

    return orError
  })
 
}


export const serverEncodeFunction: EncodeFunction = (args, jobOptions = {}) => {
  // console.log('serverEncodeFunction', args, jobOptions)
  const { user, id } = jobOptions
  const { asset, options, type} = args
  const { type: assetType } = asset
  const encodingType = type || assetType
  return encode(asset, options, encodingType, id, user)
}