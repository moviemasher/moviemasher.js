
import type { CommandFilters, CommandInput, CommandInputs, ServerMediaRequest } from '@moviemasher/runtime-server'
import type { AVType, AssetObject, AssetType, DataOrError, DecodeOptions, EncodeOptions, Encoding, EncodingType, MashAssetObject, Numbers, OutputOptions, Probing, StringDataOrError, Strings, VideoOutputOptions } from '@moviemasher/runtime-shared'
import type { RunningCommand } from '../RunningCommand/RunningCommand.js'
import type { CommandDescription, CommandDescriptions, CommandOptions, MashDescriberOptions, MashDescription } from './MashDescriberTypes.js'

import { AVTypeBoth, AVTypeVideo, COLON, DASH, DOT, JsonExtension, NEWLINE, TextExtension, assertTrue, isAboveZero, isEncoding, isPositive, outputOptions, sizeAboveZero } from '@moviemasher/lib-shared'
import { EventReleaseServerManagedAssets, EventServerDecode, EventServerEncode, EventServerEncodeStatus, EventServerManagedAsset, MovieMasher } from '@moviemasher/runtime-server'
import { AUDIO, ERROR, IMAGE, MASH, NUMBER, PROBE, RAW, VIDEO, namedError, errorCaught, isDate, isDefiniteError, isProbing } from '@moviemasher/runtime-shared'
import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { runningCommandInstance } from '../RunningCommand/RunningCommandFactory.js'
import { directoryCreatePromise, filePathExists, fileWriteJsonPromise, fileWritePromise } from '../Utility/File.js'
import { KindsProbe } from '@moviemasher/lib-shared'
import { isServerMashAsset } from '../guard/mash.js'
import { outputFileName } from '../Utility/OutputFunctions.js'
import { MashDescriberClass } from './MashDescriberClass.js'
import { jobHasErrored, jobHasFinished, jobHasStarted, jobGetStatus } from '../Utility/JobFunctions.js'
import { JOB_ENCODING } from '../Utility/JobConstants.js'

type PathDurationTuple = [string, number]

const TsExtension = 'ts'

const execPromise = promisify(exec)

const createDirectoryPromise = async (outPath: string): Promise<StringDataOrError> => {
  const parentDir = path.dirname(outPath)
  // console.log('createDirectoryPromise', parentDir)
  const orError = await directoryCreatePromise(parentDir)
  // console.log('createDirectoryPromise', orError)
  return orError
}

const spawnPromise = async (cmd: string, args: Strings): Promise<StringDataOrError> => {
  try {
    // stdout is reserved for data, feedback provided by stderr
    const { stderr } =  await execPromise([cmd, ...args].join(' '))
    return { data: stderr }
  } catch (err) { return errorCaught(err) }
}

const createDirectorAndDebugPromise = async (instance: RunningCommand, outPath: string, index = -1): Promise<StringDataOrError> => {
  const orError = await createDirectoryPromise(outPath)
  if (isDefiniteError(orError)) return orError

  const suffix = isPositive(index) ? `-${index}` : ''
  const commandsText = instance.commandString(outPath)
  const dir = path.dirname(outPath)
  const commandPath = path.join(dir, `command${suffix}.${TextExtension}`)
  const writeOrError = await fileWritePromise(commandPath, commandsText)
  if (isDefiniteError(writeOrError)) return writeOrError

  return { data: outPath }
}

const attemptWriteDotPromise = async (instance: RunningCommand, outDirectory: string, index = -1): Promise<StringDataOrError> => {
  const { graphString } = instance
  const suffix = isPositive(index) ? `-${index}` : ''

  const graphPath = path.join(outDirectory, `graph${suffix}.${TextExtension}`)
  const graphOrError = await fileWritePromise(graphPath, graphString)
  if (isDefiniteError(graphOrError)) return graphOrError

  const dotPath = path.join(outDirectory, `graph${suffix}.dot`)
  const graph2dot = 'graph2dot'
  const args = [`-i ${graphPath}`, `-o ${dotPath}`]
  if (!filePathExists(graph2dot)) return namedError(ERROR.Internal, 'no graph2dot')

  const dotOrError = await spawnPromise(graph2dot, args)
  if (isDefiniteError(dotOrError)) return dotOrError

  return { data: outDirectory }
}

const probePromise = async (outPath: string, assetType: AssetType): Promise<DataOrError<Probing>> => {
  // console.log('decodePromise', { outPath, outDirectory, index })
  // const suffix = isPositive(index) ? `-${index}` : ''
  // const decodingId = idGenerate('decoding')
  const decodeOptions: DecodeOptions = { types: KindsProbe }
  // const probePath = path.join(outDirectory, `${PROBE}${suffix}.${JsonExtension}`)
  const request: ServerMediaRequest = {
    endpoint: outPath,
    path: outPath,
  }
  const event = new EventServerDecode(PROBE, assetType, request, '', JsonExtension, decodeOptions)
  MovieMasher.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  if (!promise) return namedError(ERROR.Unimplemented, EventServerDecode.Type)

  const orError = await promise
  if (isDefiniteError(orError)) return orError

  const { data: json } = orError
  const decoding = JSON.parse(json)
  if (!isProbing(decoding)) return namedError(ERROR.Internal, 'decoding')

  return { data: decoding }
}

const encodingTypeCommandOptions = (outputOptions: OutputOptions, encodingType: EncodingType, commandDescription: CommandDescription) => {
  outputOptions.options ||= {}
  const { options } = outputOptions  
  const { duration } = commandDescription
  const commandOptions: CommandOptions = {
    output: outputOptions, ...commandDescription
  }
  switch (encodingType) {
    case IMAGE: {
      options['frames:v'] = 1
      break
    }
    default: {
      if (duration) options.t = duration
    }
  }
  return commandOptions
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

const commandPromise = async (pathFragment: string, outputPath: string, encodingType: EncodingType, outputOptions: OutputOptions, commandDescription: CommandDescription, index = -1) => {
  const debug = ENVIRONMENT.get(ENV.Debug, NUMBER)
  const commandOptions = encodingTypeCommandOptions(outputOptions, encodingType, commandDescription)
  const instance = runningCommandInstance(pathFragment, commandOptions)
  if (debug) {
    const orError = await createDirectorAndDebugPromise(instance, outputPath, index)
    if (isDefiniteError(orError)) return orError
  } else {
    const orError = await createDirectoryPromise(outputPath)
    if (isDefiniteError(orError)) return orError
  }
  const orError = await renderResultPromise(outputPath, instance)
  if (isDefiniteError(orError)) {
    if (debug) await attemptWriteDotPromise(instance, path.dirname(outputPath), index)
    return orError
  }
  return await probePromise(outputPath, encodingType)
}

const combinedRenderingDescriptionPromise = async (pathFragment: string, encodingType: EncodingType, renderingDescription: MashDescription): Promise<DataOrError<MashDescription>> => {
  const { visibleCommandDescriptions, audibleCommandDescription, outputOptions } = renderingDescription
  const length = visibleCommandDescriptions?.length
  if (!length || length === 1) return { data: renderingDescription }
  
  const extension = TsExtension
  const { 
    audioBitrate, audioChannels, audioCodec, audioRate, 
    options: outputOptionsOptions = {}, ...rest 
  } = outputOptions as VideoOutputOptions
  const visibleOptions = { ...outputOptionsOptions, an: '' }

  const dir = encodeOutputPath(pathFragment, 'concat')
  const directoryOrError = await directoryCreatePromise(dir)
  if (isDefiniteError(directoryOrError)) return directoryOrError

  const fileDurations: PathDurationTuple[] = []

  for (const [index, description] of visibleCommandDescriptions.entries()) {
    const baseName = `concat-${index}`
    const fileName = `${baseName}.${extension}`
    const outputPath = path.join(dir, fileName)
    const { duration } = description
    if (!isAboveZero(duration)) return namedError(ERROR.Internal, 'duration')
   
    const concatFileDuration: PathDurationTuple = [fileName, duration]
    const options: OutputOptions = { ...rest, options: visibleOptions, extension }
    const probingOrError = await commandPromise(pathFragment, outputPath, encodingType, options, description, index)
    if (isDefiniteError(probingOrError)) return probingOrError

    const { duration: probeDuration } = probingOrError.data.data
  
    if (!isAboveZero(probeDuration)) return namedError(ERROR.Internal, 'probeDuration')

    if (duration !== probeDuration) return namedError(ERROR.Internal, 'duration mismatch')


    fileDurations.push(concatFileDuration) 
  }

  const concatFile = concatString(fileDurations)
  const concatFilePath = path.join(dir, 'concat.txt')
  const writeOrError = await fileWritePromise(concatFilePath, concatFile)
  if (isDefiniteError(writeOrError)) return writeOrError

  if (!sizeAboveZero(outputOptions)) return namedError(ERROR.Internal, 'outputOptions not size')
  
  const { width, height } = outputOptions
  const commandInput: CommandInput = { source: concatFilePath }
  const durations = fileDurations.map(([_, duration]) => duration)
  const duration = durations.reduce((total, duration) => total + duration, 0)
  const inputs = audibleCommandDescription?.inputs || []
  const description: CommandDescription = { 
    inputs: [commandInput], duration, avType: AVTypeVideo
  }
  if (inputs.length) {
    description.commandFilters = [{ 
      inputs: [`${inputs.length}${COLON}v`], ffmpegFilter: 'copy', 
      options: {}, outputs: []
    }]  
  }
  const renderingOutputOptions: VideoOutputOptions = {
    ...outputOptions, 
    // videoCodec: 'copy',
    options: outputOptionsOptions,
    width, height,
  }
  const combinedDescription: MashDescription = {
    encodingType,
    audibleCommandDescription, 
    visibleCommandDescriptions: [description],
    outputOptions: renderingOutputOptions, 
  }
  return { data: combinedDescription }
}

const commandDescriptionsMerged = (descriptions: CommandDescriptions): CommandDescription => {
  const inputs: CommandInputs = []
  const commandFilters: CommandFilters = []
  const durations: Numbers = []
  const types = new Set<AVType>()

  descriptions.forEach(description => {
    const { duration, inputs: descriptionInputs, commandFilters: filters, avType } = description
    types.add(avType)

    if (descriptionInputs?.length) {
      if (avType === AVTypeVideo) inputs.push(...descriptionInputs)
      else inputs.unshift(...descriptionInputs)
    }
    if (filters?.length) commandFilters.push(...filters)
    if (duration) durations.push(duration)
  })
  const avType = types.size === 1 ? [...types.values()].pop()! : AVTypeBoth
  const commandDescription: CommandDescription = { inputs, commandFilters, avType }
  assertTrue(durations.length === descriptions.length, 'each description has duration')
  commandDescription.duration = Math.max(...durations)
  return commandDescription
}

const commandDescriptionMerged = (flatDescription: MashDescription): CommandDescription | undefined => {
  const { visibleCommandDescriptions, audibleCommandDescription } = flatDescription
  const descriptions: CommandDescriptions = []
  const length = visibleCommandDescriptions?.length
  if (length) {
    assertTrue(length === 1, 'flat') 

    const [visibleCommandDescription] = visibleCommandDescriptions
    descriptions.push(visibleCommandDescription)
  }
  // audio must come last
  if (audibleCommandDescription) descriptions.push(audibleCommandDescription)

  if (!descriptions.length) return

  const [description] = descriptions
  const merged = descriptions.length > 1 ? commandDescriptionsMerged(descriptions) : description
  return merged
}

const writeMash = async (pathFragment: string, mash: AssetObject): Promise<StringDataOrError> => {
  const fileName = [MASH, JsonExtension].join(DOT)
  const filePath = encodeOutputPath(pathFragment, fileName)
  const jsonOrError = await fileWriteJsonPromise(filePath, mash)
  if (isDefiniteError(jsonOrError)) return jsonOrError

  return { data: fileName }
}

const writeRawMash = async (pathFragment: string, raw: AssetObject): Promise<DataOrError<AssetObject>> => {
  const result = { data: raw }
  const debug = ENVIRONMENT.get(ENV.Debug, NUMBER)
  if (!debug) return result

  const fileName = [MASH, DASH, RAW, DOT, JsonExtension].join('')
  const filePath = encodeOutputPath(pathFragment, fileName)
  const jsonOrError = await fileWriteJsonPromise(filePath, raw)
  if (isDefiniteError(jsonOrError)) return jsonOrError

  return result
}

const encodeOutputPath = (pathFragment: string, name: string) => {
  return path.resolve(ENVIRONMENT.get(ENV.OutputRoot), pathFragment, name)
}

const encode = async (user: string, id: string, encodingType: EncodingType, mashAssetObject: MashAssetObject, encodeOptions: EncodeOptions, relativeRoot?: string): Promise<StringDataOrError> => {
  const orError = await encodePromise(user, id, encodingType, mashAssetObject, encodeOptions, relativeRoot)
  if (isDefiniteError(orError)) await jobHasErrored(id, orError.error)
  
  return orError
}

const statusPromise = async (id: string): Promise<DataOrError<Encoding | Date>> => {
  const orError = await jobGetStatus(id)
  if (isDefiniteError(orError) ) return orError

  const { data } = orError
  if (isDate(data) || isEncoding(data)) return { data }

  return namedError(ERROR.Syntax, { ...data, name: JOB_ENCODING })
}

const writeEncodingPromise = async (id: string, filePath: string, type: AssetType, relativeRoot?: string) => {
  const endpoint = relativeRoot ? path.relative(relativeRoot, filePath) : filePath
  const data: Encoding = { id, type, request: { endpoint } }
  return await jobHasFinished(id, data)
}

const encodePromise = async (user: string, id: string, encodingType: EncodingType, mashAssetObject: MashAssetObject, encodeOptions: EncodeOptions, relativeRoot?: string): Promise<StringDataOrError> => {
  const pathFragment = path.join(user, id) 
  const options = outputOptions(encodingType, encodeOptions)
  const fileName = outputFileName(options, encodingType)
  const outputPath = encodeOutputPath(pathFragment, fileName)
  const expectDuration = encodingType !== IMAGE

  const writeEmptyOrError = await jobHasStarted(id)
  if (isDefiniteError(writeEmptyOrError)) return writeEmptyOrError

  const writeRawOrError = writeRawMash(pathFragment, mashAssetObject)
  if (isDefiniteError(writeRawOrError)) return namedError(ERROR.Internal, 'writeRawPromise')

  const assetEvent = new EventServerManagedAsset(mashAssetObject)
  MovieMasher.eventDispatcher.dispatch(assetEvent)
  const { asset } = assetEvent.detail
  if (!isServerMashAsset(asset)) return namedError(ERROR.Syntax, 'invalid mash asset')
  
  
  const { assetObject } = asset
  const writeMashOrError = await writeMash(pathFragment, assetObject)
  if (isDefiniteError(writeMashOrError)) return writeMashOrError
  
  const args: MashDescriberOptions = { encodingType, outputOptions: options, mash: asset }
  const renderingOutput = new MashDescriberClass(args)
  const descriptionOrError = await renderingOutput.mashDescriptionPromise()
  MovieMasher.eventDispatcher.dispatch(new EventReleaseServerManagedAssets())
  if (isDefiniteError(descriptionOrError)) return descriptionOrError
  
  const { data: renderingDescription } = descriptionOrError
  // console.log('encode CREATE combinedRenderingDescriptionPromise', {encodingId})
  const combinedOrError = await combinedRenderingDescriptionPromise(pathFragment, encodingType, renderingDescription)
  // console.log('encode FINISH combinedRenderingDescriptionPromise', {encodingId}, isDefiniteError(combinedOrError))
  if (isDefiniteError(combinedOrError)) return combinedOrError

  const { data: flatDescription } = combinedOrError
  const { outputOptions: flatOptions } = flatDescription
  const commandDescription = commandDescriptionMerged(flatDescription)
  if (!commandDescription) return namedError(ERROR.Internal, `required ${encodingType} failed`)
  const { duration } = commandDescription

  if (expectDuration) {
    if (!duration) return namedError(ERROR.ImportDuration)
  }
  // console.log('encode CREATE commandPromise', {encodingId})
  const probingOrError = await commandPromise(pathFragment, outputPath, encodingType, flatOptions, commandDescription)
  if (isDefiniteError(probingOrError)) return probingOrError

  const { duration: probeDuration } = probingOrError.data.data
  if (!isPositive(probeDuration)) return namedError(ERROR.Internal, 'probeDuration')

  const writeOrError = await writeEncodingPromise(id, outputPath, encodingType, relativeRoot)
  if (isDefiniteError(writeOrError)) return writeOrError
  
  
  return { data: outputPath }
}

const audioHandler = (event: EventServerEncode) => {
  const { detail } = event
  const { mashAssetObject, encodeOptions, encodingType, user, id, relativeRoot } = detail
  if (encodingType !== AUDIO) return
  
  detail.promise = encode(user, id, encodingType, mashAssetObject, encodeOptions, relativeRoot)
  event.stopImmediatePropagation()
}

const imageHandler = (event: EventServerEncode) => {
  const { detail } = event
  const { mashAssetObject, encodeOptions, encodingType, user, id, relativeRoot } = detail
  if (encodingType !== IMAGE) return

  detail.promise = encode(user, id, encodingType, mashAssetObject, encodeOptions, relativeRoot)
  event.stopImmediatePropagation()
}

const videoHandler = (event: EventServerEncode) => {
  const { detail } = event

  const { mashAssetObject, encodeOptions, encodingType, user, id, relativeRoot } = detail
  if (encodingType !== VIDEO) return
  
  detail.promise = encode(user, id, encodingType, mashAssetObject, encodeOptions, relativeRoot)
  event.stopImmediatePropagation()
}

const statusHandler = (event: EventServerEncodeStatus) => {
  const { detail } = event
  const { id } = detail
  detail.promise = statusPromise(id)
  event.stopImmediatePropagation()
}

export const ServerEncodeAudioListeners = () => ({
  [EventServerEncode.Type]: audioHandler,
})

export const ServerEncodeImageListeners = () => ({
  [EventServerEncode.Type]: imageHandler,
})

export const ServerEncodeVideoListeners = () => ({
  [EventServerEncode.Type]: videoHandler,
})

export const ServerEncodeStatusListeners = () => ({
  [EventServerEncodeStatus.Type]: statusHandler,
})
