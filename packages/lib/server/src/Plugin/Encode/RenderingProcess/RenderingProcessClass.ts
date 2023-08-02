import fs from 'fs'
import path from 'path'
import { EventAsset, MovieMasher, isServerAsset} from '@moviemasher/runtime-server'
import {
  CommandInput, CommandInputs,
  CommandFilters,
  ServerMashAsset, 
   VideoOutputOptions, OutputOptions, assertPopulatedString, outputOptions, StringDataOrError, 
   
   StringData,
   isMashAsset, 
} from '@moviemasher/lib-shared'
import type { 
  CommandDescription, CommandDescriptions, CommandOptions, RenderingDescription, 
  RenderingOutputArgs
} from '../Encode.js'
import type  { RenderingProcess, RenderingProcessArgs } from './RenderingProcess.js'
import type { CommandResult } from '../../../RunningCommand/RunningCommand.js'
import type { 
  AVType, EncodingType, Numbers, 
} from '@moviemasher/runtime-shared'
import {
  EmptyFunction, 
  assertTrue, assertSize, assertAboveZero, idGenerateString, 
NewlineChar, AVTypeBoth, AVTypeVideo, 
  
} from '@moviemasher/lib-shared'
import {
  BasenameRendering, ExtensionCommands, ExtensionLoadedInfo, TsExtension
} from '../../../Setup/Constants.js'

import { commandArgsString } from '../../../Utility/Command.js'
import { Probe } from '../../../Command/Probe/Probe.js'
import { runningCommandInstance } from '../../../RunningCommand/RunningCommandFactory.js'
import { RenderingOutputClass } from '../RenderingOutputClass.js'
import { 
 isDefiniteError, ErrorName, TypeImage, TypeVideo, errorThrow 
} from '@moviemasher/runtime-shared'

export type RenderingProcessConcatFileDuration = [string, number]

export const renderingOutputFile = (outputOptions: OutputOptions, outputType: EncodingType, basename?: string, extension?: string): string => {
  const { format, extension: outputExtension } = outputOptions

  const ext = extension || outputExtension || format
  assertPopulatedString(ext, 'extension')

  const components = [basename || outputType]
  // if (index && !basename) components.push(String(index))
  components.push(ext)
  return components.join('.')
}


export class RenderingProcessClass implements RenderingProcess {
  constructor(public args: RenderingProcessArgs) {}

  private combinedRenderingDescriptionPromise(renderingDescription: RenderingDescription): Promise<RenderingDescription> {
    const { visibleCommandDescriptions, audibleCommandDescription, outputOptions } = renderingDescription
    const length = visibleCommandDescriptions?.length
    if (!length || length === 1) {
      console.log(this.constructor.name, "combinedRenderingDescriptionPromise", outputOptions)
      return Promise.resolve(renderingDescription)
    }

    const extension = TsExtension
    const { 
      options: outputOptionsOptions = {},
      audioBitrate, audioChannels, audioCodec, audioRate, 
      ...rest 
    } = outputOptions as VideoOutputOptions
    
    const options = { ...outputOptionsOptions, an: '' }//, qp: 0
    const { outputDirectory } = this.args
    assertPopulatedString(outputDirectory, 'outputDirectory')
    
    const concatDirectoryName = renderingOutputFile(outputOptions, this.encodingType, this.args.basename, 'concat')

    const concatDirectory = path.join(outputDirectory, concatDirectoryName)
    
    let promise: Promise<void> = this.createDirectoryPromise(concatDirectory)
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
        return this.renderResultPromise(
          destinationPath, cmdPath, infoPath, concatOutputOptions, TypeVideo, description
        ).then(EmptyFunction)
      })
      return concatFileDuration
    })

    const concatFile = this.concatFile(fileDurations)
    const concatFilePath = path.join(concatDirectory, 'concat.txt')
    promise = promise.then(() => {
      return this.createFilePromise(concatFilePath, concatFile)
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
        encodingType: this.encodingType,
        audibleCommandDescription, 
        visibleCommandDescriptions: [description],
        outputOptions: renderingOutputOptions, 
      }
      return renderingDescription
    })
  }

  private commandDescriptionMerged(flatDescription: RenderingDescription): CommandDescription | undefined{
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

    // else console.log(this.constructor.name, 'commandDescriptionMerged no audibleCommandDescription')
    if (!descriptions.length) return

    const [description] = descriptions
    const merged = descriptions.length > 1 ? this.commandDescriptionsMerged(descriptions) : description
    return merged
  }

  private commandDescriptionsMerged(descriptions: CommandDescriptions): CommandDescription {
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
    // console.log(this.constructor.name, 'commandDescriptionsMerged', inputs)
    return commandDescription
  }

  private concatFile(fileDurations: RenderingProcessConcatFileDuration[]): string {
    const lines = ['ffconcat version 1.0']
    lines.push(...fileDurations.flatMap(fileDuration => {
      const [file, duration] = fileDuration
      return [`file '${file}'`, `duration ${duration}`]
    }))
    return lines.join(NewlineChar)
  }

  private createDirectoryPromise(directoryPath: string): Promise<void> {
    return fs.promises.mkdir(directoryPath, { recursive: true }).then(EmptyFunction)
  }

  private createFilePromise(filePath: string, content: string): Promise<void> {
    return fs.promises.writeFile(filePath, content).then(EmptyFunction)
  }

  private directoryPromise(): Promise<void> {
    const { outputOptions: outputs, args, id } = this
    const { outputDirectory, mash } = args
    assertPopulatedString(outputDirectory, 'outputDirectory')

    // console.log(this.constructor.name, 'directoryPromise', outputDirectory)
    const argsJson = JSON.stringify({ id, outputs, mash }, null, 2)
    return this.createDirectoryPromise(outputDirectory).then(() => {
      const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
      return this.createFilePromise(jsonPath, argsJson)
    })
  }

  private get encodingType(): EncodingType { return this.args.encodingType }
  

  private _id?: string
  get id(): string {
    if (this._id) return this._id

    return this._id = this.args.id || idGenerateString()
  }

  private _mashAsset?: ServerMashAsset
  
  private get mashAsset(): ServerMashAsset {
    if (this._mashAsset) return this._mashAsset

    const { mash } = this.args
    // const size = sizeAboveZero(outputOptions) ? outputOptions : SIZE_ZERO
    const event = new EventAsset(mash)
    MovieMasher.eventDispatcher.dispatch(event)

    const { asset } = event.detail
    if (isMashAsset(asset) && isServerAsset(asset)) {
      return this._mashAsset = asset as ServerMashAsset
    }
    throw new Error(`mashAsset ${mash} not found`)
  }


  private _outputOptions?: OutputOptions

  private get outputOptions() { return this._outputOptions ||= outputOptions(this.encodingType, this.args.outputOptions)  }


  private renderResultPromise(destination: string, cmdPath: string, infoPath: string, outputOptions: OutputOptions, encodingType: EncodingType, commandDescription: CommandDescription): Promise<StringDataOrError> {
    // const { encodingType } = this
    const { duration } = commandDescription

    const commandOptions: CommandOptions = {
      output: outputOptions, ...commandDescription
    }
    const options = outputOptions.options!
    switch (encodingType) {
      case TypeImage: {
        options['frames:v'] = 1
        break
      }
      default: {
        if (duration) options.t = duration
      }
    }
    const command = runningCommandInstance(this.id, commandOptions)
    const commandsText = commandArgsString(command.command._getArguments(), destination)
    const writeCommandPromise = fs.promises.writeFile(cmdPath, commandsText)
    const runCommandPromise = writeCommandPromise.then(() => (
      command.runPromise(destination)//.then(() => stringData)
    ))
    
    return runCommandPromise.then((commandResult: CommandResult) => {

      if (isDefiniteError(commandResult)) {
        const renderingResult = {
          ...commandResult, destination, outputType: this.encodingType
        }
        // console.warn(this.constructor.name, 'renderResultPromise runPromise', destination, error)
        return fs.promises.writeFile(infoPath, JSON.stringify(renderingResult)).then(() => commandResult)
      }
      const { temporaryDirectory } = this.args
      const stringData: StringData = { data: destination }
      return Probe.promise(temporaryDirectory, destination, infoPath).then(() => stringData)
    })
  }

  runPromise(): Promise<StringDataOrError> {
    const { encodingType, args } = this
    const { outputDirectory, basename } = args
    const expectDuration = encodingType !== TypeImage
    const directoryPromise = this.directoryPromise()
    const renderingOutputPromise = directoryPromise.then(() => {
      const { cacheDirectory } = this.args
      const { outputOptions, encodingType, mashAsset: mash } = this
      const args: RenderingOutputArgs = { 
        encodingType, outputOptions, cacheDirectory, mash 
      }
      return new RenderingOutputClass(args)
    })
    const descriptionPromise = renderingOutputPromise.then(renderingOutput => (
      renderingOutput.renderingDescriptionPromise()
    ))
    const flatPromise = descriptionPromise.then(renderingDescription => (
      this.combinedRenderingDescriptionPromise(renderingDescription)
    ))
    return flatPromise.then(flatDescription => {
      const { outputOptions } = flatDescription
      const infoFilename = renderingOutputFile(outputOptions, encodingType, basename, ExtensionLoadedInfo)
      const infoPath = path.join(outputDirectory, infoFilename)
      const commandDescription = this.commandDescriptionMerged(flatDescription)
      if (!commandDescription) return errorThrow(`required ${encodingType} failed`) 
    
      if (expectDuration) {
        const { duration } = commandDescription
        if (!duration) return errorThrow(ErrorName.ImportDuration) 
      }
      const cmdFilename = renderingOutputFile(outputOptions, encodingType, basename, ExtensionCommands)
      const destinationFileName = renderingOutputFile(outputOptions, encodingType, basename)
      const cmdPath = path.join(outputDirectory, cmdFilename)
      const destination = path.join(outputDirectory, destinationFileName)
      // console.log(this.constructor.name, 'runPromise flatPromise done', destination)

      return this.renderResultPromise(
        destination, cmdPath, infoPath, outputOptions, encodingType, commandDescription
      )
    })
  }
}

  // private _preloader?: NodeLoader
  // private get preloader() { return this._preloader ||= this.preloaderInitialize }
  // private get preloaderInitialize() { 
  //   const { args } = this
  //   const {
  //     cacheDirectory, validDirectories, defaultDirectory, filePrefix, 
  //     temporaryDirectory
  //   } = args
  //   return new NodeLoader(temporaryDirectory, cacheDirectory, filePrefix, defaultDirectory, validDirectories)
  // }
  // private rendered(destinationPath: string, duration = 0, tolerance = 0.1): boolean {
  //   if (!fs.existsSync(destinationPath)) return false

  //   if (!duration) return true

  //   const dirName = path.dirname(destinationPath)
  //   const extName = path.extname(destinationPath)
  //   const baseName = path.basename(destinationPath, extName)
  //   const infoPath = path.join(dirName, `${baseName}.${ExtensionLoadedInfo}`)
  //   if (!fs.existsSync(infoPath)) return false

  //   const buffer = fs.readFileSync(infoPath)
  //   if (!isDefined(buffer)) return false
    
  //   const info = JSON.parse(buffer.toString())
  //   const infoTolerant = Math.round(info.duration / tolerance)
  //   const tolerant = Math.round(duration / tolerance)

  //   const durationsEqual = infoTolerant === tolerant
  //   if (!durationsEqual) console.log(this.constructor.name, 'rendered', infoTolerant, durationsEqual ? '===' : '!==', tolerant)
  //   return durationsEqual
  // }
