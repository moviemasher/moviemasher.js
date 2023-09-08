
import type { AVType, DecodeOptions, EncodeOptions, EncodingType, Numbers, OutputOptions, StringDataOrError, VideoOutputOptions } from '@moviemasher/runtime-shared'
import type { CommandDescription, CommandDescriptions, CommandOptions, RenderingDescription, RenderingOutputArgs, RenderingProcessConcatFileDuration } from './Encode.js'
import type { CommandResult } from '../RunningCommand/RunningCommand.js'
import type { CommandFilters, CommandInput, CommandInputs } from '../Types/CommandTypes.js'

import { AVTypeBoth, AVTypeVideo, EmptyFunction, JsonExtension, NewlineChar, assertAboveZero, assertPopulatedString, assertSize, assertTrue, idGenerate } from '@moviemasher/lib-shared'
import { EventServerDecode, EventServerEncode, EventServerManagedAsset, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, SourceMash, AUDIO, IMAGE, PROBE, VIDEO, error, errorCaught, errorPromise, isAssetObject, isDefiniteError, } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { EnvironmentKeyApiDirCache, EnvironmentKeyApiDirTemporary, RuntimeEnvironment } from '../Environment/Environment.js'
import { assertServerMashAsset } from '../guard/mash.js'
import { RenderingOutputClass } from './RenderingOutputClass.js'
import { runningCommandInstance } from '../RunningCommand/RunningCommandFactory.js'
import { BasenameRendering, ExtensionCommands, ExtensionLoadedInfo, TsExtension } from '../Setup/Constants.js'
import { commandArgsString } from '../Utility/Command.js'
import { fileRead } from '../Utility/File.js'
import { ProbeDuration } from '../decode/ProbeConstants.js'
import { renderingOutputFile } from './EncodeFunctions.js'
import { directoryCreatePromise, fileWritePromise, fileWriteJsonPromise } from '../Utility/File.js'

const renderResultPromise = (encodingId: string, destination: string, cmdPath: string, infoPath: string, outputOptions: OutputOptions, encodingType: EncodingType, commandDescription: CommandDescription): Promise<StringDataOrError> => {
  const { duration } = commandDescription

  const commandOptions: CommandOptions = {
    output: outputOptions, ...commandDescription
  }
  const options = outputOptions.options!
  switch (encodingType) {
    case IMAGE: {
      options['frames:v'] = 1
      break
    }
    default: {
      if (duration) options.t = duration
    }
  }
  const command = runningCommandInstance(encodingId, commandOptions)
  const commandsText = commandArgsString(command.command._getArguments(), destination)
  const writeCommandPromise = fs.promises.writeFile(cmdPath, commandsText)
  const runCommandPromise = writeCommandPromise.then(() => (
    command.runPromise(destination)//.then(() => stringData)
  ))
  const decodePromise = runCommandPromise.then((commandResult: CommandResult) => {
    if (isDefiniteError(commandResult)) {
      const renderingResult = {
        ...commandResult, destination, outputType: encodingType
      }
      return fs.promises.writeFile(infoPath, JSON.stringify(renderingResult)).then(() => commandResult)
    }
    const decodingId = idGenerate('decoding')
    const decodeOptions: DecodeOptions = { types: [ProbeDuration] }
    const event = new EventServerDecode(PROBE, destination, `${destination}.${JsonExtension}`, decodeOptions, decodingId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return error(ERROR.Internal, 'no probe promise')

    return promise
  })
  return decodePromise.then((something) => {
    if (isDefiniteError(something)) return something

    return { data: encodingId }
  })
}

const concatString = (fileDurations: RenderingProcessConcatFileDuration[]): string => {
  const lines = ['ffconcat version 1.0']
  lines.push(...fileDurations.flatMap(fileDuration => {
    const [file, duration] = fileDuration
    return [`file '${file}'`, `duration ${duration}`]
  }))
  return lines.join(NewlineChar)
}

const combinedRenderingDescriptionPromise = (encodingId: string, outputDirectory: string, encodingType: EncodingType, renderingDescription: RenderingDescription): Promise<RenderingDescription> => {
  const { visibleCommandDescriptions, audibleCommandDescription, outputOptions } = renderingDescription
  const length = visibleCommandDescriptions?.length
  if (!length || length === 1) return Promise.resolve(renderingDescription)
  
  const extension = TsExtension
  const { 
    options: outputOptionsOptions = {},
    audioBitrate, audioChannels, audioCodec, audioRate, 
    ...rest 
  } = outputOptions as VideoOutputOptions
  
  const options = { ...outputOptionsOptions, an: '' }
  assertPopulatedString(outputDirectory, 'outputDirectory')
  
  const concatDirectoryName = renderingOutputFile(outputOptions, encodingType, 'concat')

  const concatDirectory = path.join(outputDirectory, concatDirectoryName)
  
  let promise: Promise<void> = directoryCreatePromise(concatDirectory)
  const fileDurations = visibleCommandDescriptions.map((description, index) => {
    const baseName = `concat-${index}`
    const fileName = `${baseName}.${extension}`
    const destinationPath = path.join(concatDirectory, fileName)
    const cmdPath = path.join(concatDirectory, `${baseName}.${ExtensionCommands}`)
    const infoPath = path.join(concatDirectory, `${baseName}.${ExtensionLoadedInfo}`)
    const { duration } = description
    assertAboveZero(duration, 'duration')

    const concatFileDuration: RenderingProcessConcatFileDuration = [fileName, duration]
    promise = promise.then(() => {
      const concatOutputOptions: OutputOptions = {
         ...rest, options, extension 
      }
      return renderResultPromise(
        encodingId, destinationPath, cmdPath, infoPath, concatOutputOptions, VIDEO, description
      ).then(EmptyFunction)
    })
    return concatFileDuration
  })

  const concatFile = concatString(fileDurations)
  const concatFilePath = path.join(concatDirectory, 'concat.txt')
  promise = promise.then(() => {
    return fileWritePromise(concatFilePath, concatFile)
  })

  return promise.then(() => {
    assertSize(outputOptions)
    const { width, height } = outputOptions

    const commandInput: CommandInput = { source: concatFilePath }
    const durations = fileDurations.map(([_, duration]) => duration)
    const duration = durations.reduce((total, duration) => total + duration, 0)

    const inputs = audibleCommandDescription?.inputs || []

    const description: CommandDescription = { 
      inputs: [commandInput], duration, avType: AVTypeVideo
    }
    if (inputs.length) {
      description.commandFilters =  [{ 
        inputs: [`${inputs.length}:v`], ffmpegFilter: 'copy', 
        options: {}, outputs: [] 
      }]  
    }

    const renderingOutputOptions: VideoOutputOptions = {
      ...outputOptions, 
      videoCodec: 'copy',
      options: outputOptionsOptions,
      width, height,
    }

    const renderingDescription: RenderingDescription = {
      encodingType,
      audibleCommandDescription, 
      visibleCommandDescriptions: [description],
      outputOptions: renderingOutputOptions, 
    }
    return renderingDescription
  })
}

const commandDescriptionsMerged = (descriptions: CommandDescriptions): CommandDescription => {
  const inputs: CommandInputs = []
  const commandFilters: CommandFilters = []
  const durations: Numbers = []
  const types = new Set<AVType>()

  descriptions.forEach(description => {
    const { duration, inputs: descriptionInputs, commandFilters: filters, avType } = description
    types.add(avType)
    if (descriptionInputs) inputs.push(...descriptionInputs)
    if (filters) commandFilters.push(...filters)
    if (duration) durations.push(duration)
  })
  const avType = types.size === 1 ? [...types.values()].pop()! : AVTypeBoth
  const commandDescription: CommandDescription = { inputs, commandFilters, avType }
  assertTrue(durations.length === descriptions.length, 'each description has duration')
  commandDescription.duration = Math.max(...durations)
  return commandDescription
}

const commandDescriptionMerged = (flatDescription: RenderingDescription): CommandDescription | undefined => {
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

const encode = (encodingId: string, outputPath: string, encodingType: EncodingType, inputPath: string, options: EncodeOptions): Promise<StringDataOrError> => {
  try {
    const mashObject = JSON.parse(fileRead(inputPath))
    if (!isAssetObject(mashObject, encodingType, SourceMash)) {
      return errorPromise(ERROR.Internal, `invalid ${encodingType} mash`)
    }

    const outputDirectory = path.resolve(RuntimeEnvironment.get(EnvironmentKeyApiDirTemporary), encodingId)
    const cacheDirectory = path.resolve(RuntimeEnvironment.get(EnvironmentKeyApiDirCache))

    const expectDuration = encodingType !== IMAGE
    
    const assetEvent = new EventServerManagedAsset(mashObject)
    MovieMasher.eventDispatcher.dispatch(assetEvent)
    const { asset } = assetEvent.detail
    assertServerMashAsset(asset)
    
    const data = { id: encodingId, outputs: options, mash: mashObject }
    const dataPath = path.join(outputDirectory, `${BasenameRendering}.json`)
    const directoryPromise = fileWriteJsonPromise(dataPath, data)
    const renderingOutputPromise = directoryPromise.then(() => {
      const args: RenderingOutputArgs = { 
        encodingType, outputOptions: options, cacheDirectory, mash: asset 
      }
      return new RenderingOutputClass(args)
    })
    
    const descriptionPromise = renderingOutputPromise.then(renderingOutput => (
      renderingOutput.renderingDescriptionPromise()
    ))
    const flatPromise = descriptionPromise.then(renderingDescription => (
      combinedRenderingDescriptionPromise(encodingId, outputDirectory, encodingType, renderingDescription)
    ))
    return flatPromise.then(flatDescription => {
      const { outputOptions } = flatDescription
      const infoFilename = renderingOutputFile(outputOptions, encodingType, ExtensionLoadedInfo)
      const infoPath = path.join(outputDirectory, infoFilename)
      const commandDescription = commandDescriptionMerged(flatDescription)
      if (!commandDescription) return error(ERROR.Internal, `required ${encodingType} failed`) 
    
      if (expectDuration) {
        const { duration } = commandDescription
        if (!duration) return error(ERROR.ImportDuration) 
      }
      const cmdFilename = renderingOutputFile(outputOptions, encodingType, ExtensionCommands)
      // const destinationFileName = renderingOutputFile(outputOptions, encodingType)
      const cmdPath = path.join(outputDirectory, cmdFilename)
      // const destination = path.join(outputDirectory, destinationFileName)
      // console.log(renderingProcess.constructor.name, 'runPromise flatPromise done', destination)

      return renderResultPromise(
        encodingId, outputPath, cmdPath, infoPath, outputOptions, encodingType, commandDescription
      )
    })  
  }
  catch(error) { return Promise.resolve(errorCaught(error)) }
}

const audioHandler = (event: EventServerEncode) => {
  const { detail } = event
  const { inputPath, encodeOptions, encodingType, encodingId, outputPath } = detail
  if (encodingType !== AUDIO) return
  
  detail.promise = encode(encodingId, outputPath, encodingType, inputPath, encodeOptions)
}


const videoHandler = (event: EventServerEncode) => {
  const { detail } = event
  const { inputPath, encodeOptions, encodingType, encodingId, outputPath } = detail
  if (encodingType !== VIDEO) return
  
  detail.promise = encode(encodingId, outputPath, encodingType, inputPath, encodeOptions)
}

const imageHandler = (event: EventServerEncode) => {
  const { detail } = event
  const { inputPath, encodeOptions, encodingType, encodingId, outputPath } = detail
  if (encodingType !== IMAGE) return

  detail.promise = encode(encodingId, outputPath, encodingType, inputPath, encodeOptions)
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