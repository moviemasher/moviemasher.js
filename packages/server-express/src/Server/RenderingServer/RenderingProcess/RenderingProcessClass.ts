import fs from 'fs'
import path from 'path'

import {
  idGenerate, Mash, mashInstance, OutputFactory,
  RenderingOutput, RenderingOutputArgs, Errors, CommandFilters,
  RenderingCommandOutput, RenderingResult, CommandOutputs, OutputType,
  EmptyMethod, CommandDescription, CommandDescriptions, CommandOptions, CommandInput, RenderingDescription, AVType, CommandInputs,
  Defined,
  assertTrue,
  ExtTs, assertSize, ExtText, isDefined, isDefinition, isObject, isPopulatedString, isPreloadableDefinition, NumberObject, GraphFile
} from "@moviemasher/moviemasher.js"
import {
  BasenameRendering, ExtensionCommands, ExtensionLoadedInfo
} from '../../../Setup/Constants'
import { runningCommandInstance } from "../../../RunningCommand/RunningCommandFactory"
import { RenderingProcess, RenderingProcessArgs, RunResult } from "./RenderingProcess"
import { NodeLoader } from '../../../Utilities/NodeLoader'
import { CommandResult } from '../../../RunningCommand/RunningCommand'
import { probingInfoPromise } from '../../../Command/Probing'
import { renderingCommandOutputs, renderingOutputFile } from '../../../Utilities/Rendering'
import { commandArgsString } from '../../../Utilities/Command'

export type RenderingProcessConcatFileDuration = [string, number]

export class RenderingProcessClass implements RenderingProcess {
  constructor(public args: RenderingProcessArgs) {
    Defined.define(...this.args.definitions)
  }

  private combinedRenderingDescriptionPromise(index: number, renderingDescription: RenderingDescription): Promise<RenderingDescription> {
    const { visibleCommandDescriptions, commandOutput, audibleCommandDescription } = renderingDescription
    const length = visibleCommandDescriptions?.length
    if (!length || length === 1) {
      // console.log(this.constructor.name, "combinedRenderingDescriptionPromise resolved", length)
      return Promise.resolve(renderingDescription)
    }

    const extension = ExtTs
    const {
      options: commandOutputOptions = {},
      audioBitrate, audioChannels, audioCodec, audioRate, outputType,
      ...rest
    } = commandOutput
    const options = { ...commandOutputOptions, an: '', qp: 0 }
    const output: RenderingCommandOutput = {
      ...rest, options, extension, outputType: OutputType.Video
    }
    const { outputDirectory } = this.args
    const temporaryDirectoryName = renderingOutputFile(index, commandOutput, 'concat')

    const temporaryDirectory = path.join(outputDirectory, temporaryDirectoryName)
    let promise: Promise<void> = this.createDirectoryPromise(temporaryDirectory)
    const fileDurations = visibleCommandDescriptions.map((description, index) => {
      const baseName = `concat-${index}`
      const fileName = `${baseName}.${extension}`
      const destinationPath = path.join(temporaryDirectory, fileName)
      const cmdPath = path.join(temporaryDirectory, `${baseName}.${ExtensionCommands}`)
      const infoPath = path.join(temporaryDirectory, `${baseName}.${ExtensionLoadedInfo}`)
      const { duration } = description
      if (!duration) throw Errors.invalid.duration

      const concatFileDuration: RenderingProcessConcatFileDuration = [fileName, duration]
   
      promise = promise.then(() => {
        // console.log(this.constructor.name, "combinedRenderingDescriptionPromise finished, calling renderResultPromise")

        return this.renderResultPromise(destinationPath, cmdPath, infoPath, output, description).then(EmptyMethod)
      })
    
      
      return concatFileDuration
    })

    const concatFile = this.concatFile(fileDurations)
    const concatFilePath = path.join(temporaryDirectory, 'concat.txt')
    promise = promise.then(() => {
      // console.log(this.constructor.name, "combinedRenderingDescriptionPromise finished concat generation", concatFilePath)
      return this.createFilePromise(concatFilePath, concatFile)
    })

    return promise.then(() => {
      assertSize(output)
      const { width, height } = output
      const commandInput: CommandInput = { source: concatFilePath }//, options: { video_size: `${width}x${height}` }
      const durations = fileDurations.map(([_, duration]) => duration)
      const duration = durations.reduce((total, duration) => total + duration, 0)

      const inputs = audibleCommandDescription?.inputs || []

      const description: CommandDescription = { 
        inputs: [commandInput], duration, avType: AVType.Video,
        commandFilters: [{ inputs: [`${inputs.length}:v`], ffmpegFilter: 'scale', options: { width, height }, outputs: [] }]
      }
      const renderingDescription: RenderingDescription = {
        commandOutput: { ...commandOutput, width, height, options: { ...commandOutputOptions, 'c:v': 'copy' } }, audibleCommandDescription,
        visibleCommandDescriptions: [description],
      }
      return renderingDescription
    })
  }

  commandDescriptionMerged(flatDescription: RenderingDescription): CommandDescription | undefined{
    const { visibleCommandDescriptions, audibleCommandDescription } = flatDescription
    const descriptions: CommandDescriptions = []
    if (audibleCommandDescription) descriptions.push(audibleCommandDescription)
    const length = visibleCommandDescriptions?.length
    if (length) {
      assertTrue(length === 1, 'flat') 

      const [visibleCommandDescription] = visibleCommandDescriptions
      descriptions.push(visibleCommandDescription)
    }
    // else console.log(this.constructor.name, "commandDescriptionMerged no audibleCommandDescription")
    if (!descriptions.length) return

    const [description] = descriptions
    const merged = descriptions.length > 1 ? this.commandDescriptionsMerged(descriptions) : description
    return merged
  }

  commandDescriptionsMerged(descriptions: CommandDescriptions): CommandDescription {
    const inputs: CommandInputs = []
    const commandFilters: CommandFilters = []
    const durations: number[] = []
    const types = new Set<AVType>()

    descriptions.forEach(description => {
      const { duration, inputs: descriptionInputs, commandFilters: filters, avType } = description
      types.add(avType)
      if (descriptionInputs) inputs.push(...descriptionInputs)
      if (filters) commandFilters.push(...filters)
      if (duration) durations.push(duration)
    })
    const avType = types.size === 1 ? [...types.values()].pop()! : AVType.Both
    const commandDescription: CommandDescription = { inputs, commandFilters, avType }
    assertTrue(durations.length === descriptions.length, 'each description has duration')
    commandDescription.duration = Math.max(...durations)
    // console.log(this.constructor.name, "commandDescriptionsMerged", commandDescription)
    return commandDescription
  }

  concatFile(fileDurations: RenderingProcessConcatFileDuration[]): string {
    const lines = ['ffconcat version 1.0']
    lines.push(...fileDurations.flatMap(fileDuration => {
      const [file, duration] = fileDuration
      return [`file '${file}'`, `duration ${duration}`]
    }))
    return lines.join("\n")
  }

  private createDirectoryPromise(directoryPath: string): Promise<void> {
    return fs.promises.mkdir(directoryPath, { recursive: true }).then(EmptyMethod)
  }

  private createFilePromise(filePath: string, content: string): Promise<void> {
    return fs.promises.writeFile(filePath, content).then(EmptyMethod)
  }

  private directoryPromise(): Promise<void> {
    const { outputsPopulated: outputs, args, id } = this
    const { outputDirectory, mash, definitions, upload } = args
    // console.log(this.constructor.name, "directoryPromise", outputDirectory)
    const argsJson = JSON.stringify({ id, outputs, mash, definitions, upload }, null, 2)
    return this.createDirectoryPromise(outputDirectory).then(() => {
      const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
      return this.createFilePromise(jsonPath, argsJson)
    })
  }

  private fileName(index: number, commandOutput: RenderingCommandOutput, renderingOutput: RenderingOutput): string {
    const { outputType, videoRate } = commandOutput
    if (outputType !== OutputType.ImageSequence) return renderingOutputFile(index, commandOutput)
    if (!videoRate) throw Errors.internal + 'videoRate'

    const { format, extension, basename } = commandOutput
    const base = basename || ''
    const ext = extension || format
    const { duration } = renderingOutput
    const framesMax = Math.floor(videoRate * duration) - 2
    const begin = 1
    const lastFrame = begin + (framesMax - begin)
    const padding = String(lastFrame).length
    return `${base}%0${padding}d.${ext}`
  }

  private _id?: string
  get id(): string {
    if (this._id) return this._id

    return this._id = this.args.id || idGenerate()
  }

  private _mashInstance?: Mash
  get mashInstance(): Mash {
    if (this._mashInstance) return this._mashInstance

    const { args, preloader } = this
    const { mash } = args

    const mashOptions = { ...mash, preloader }
    return this._mashInstance = mashInstance(mashOptions)
  }

  private outputInstance(commandOutput: RenderingCommandOutput): RenderingOutput {
    const { outputType } = commandOutput
    const { cacheDirectory } = this.args
    // console.log(this.constructor.name, "outputInstance", cacheDirectory)

    const { mashInstance } = this
    const args: RenderingOutputArgs = {
      commandOutput, cacheDirectory, mash: mashInstance
    }
    return OutputFactory[outputType](args)
  }

  private _outputsPopulated?: CommandOutputs
  private get outputsPopulated(): CommandOutputs {
    return this._outputsPopulated ||= renderingCommandOutputs(this.args.outputs)
  }

  private _preloader?: NodeLoader
  get preloader() { return this._preloader ||= this.preloaderInitialize }
  get preloaderInitialize() { 
    const { args } = this
    const {
      cacheDirectory, validDirectories, defaultDirectory, filePrefix
    } = args
    return new NodeLoader(cacheDirectory, filePrefix, defaultDirectory, validDirectories)
  }

  private renderResultPromise(destination: string, cmdPath: string, infoPath: string, commandOutput: RenderingCommandOutput, commandDescription: CommandDescription): Promise<RenderingResult> {
    const { outputType, avType } = commandOutput
    const { duration } = commandDescription

    const commandOptions: CommandOptions = {
      output: commandOutput, ...commandDescription
    }

    const options = commandOutput.options!
    switch (outputType) {
      case OutputType.Image:
      case OutputType.Waveform: {
        options['frames:v'] = 1
        break
      }
      default: {
        if (duration) options.t = duration
      }
    }
    if (avType === AVType.Audio) {
      delete commandOutput.videoCodec
      delete commandOutput.videoRate
    } else if (avType === AVType.Video) {
      delete commandOutput.audioCodec
      delete commandOutput.audioBitrate
      delete commandOutput.audioChannels
      delete commandOutput.audioRate
    }

    const command = runningCommandInstance(this.id, commandOptions)
    const commandsText = commandArgsString(command.command._getArguments(), destination)
    const writeCommandPromise = fs.promises.writeFile(cmdPath, commandsText)
    const runCommandPromise = writeCommandPromise.then(() => {
      return command.runPromise(destination)
    })
    
    return runCommandPromise.then((commandResult: CommandResult) => {
      const renderingResult: RenderingResult = {
        ...commandResult, destination, outputType
      }
      const { error } = commandResult
      if (error) {
        console.warn(this.constructor.name, "renderResultPromise runPromise", destination, error)
        return fs.promises.writeFile(infoPath, JSON.stringify(renderingResult)).then(() => renderingResult)
      }
      return probingInfoPromise(destination, infoPath).then(() => renderingResult)
    })
  }

  rendered(destinationPath: string, duration = 0, tolerance = 0.1): boolean {
    if (!fs.existsSync(destinationPath)) return false

    if (!duration) return true

    const dirName = path.dirname(destinationPath)
    const extName = path.extname(destinationPath)
    const baseName = path.basename(destinationPath, extName)
    const infoPath = path.join(dirName, `${baseName}.${ExtensionLoadedInfo}`)
    if (!fs.existsSync(infoPath)) return false

    const buffer = fs.readFileSync(infoPath)
    if (!isDefined(buffer)) return false
    
    const info = JSON.parse(buffer.toString())
    const infoTolerant = Math.round(info.duration / tolerance)
    const tolerant = Math.round(duration / tolerance)

    const durationsEqual = infoTolerant === tolerant
    if (!durationsEqual) console.log(this.constructor.name, "rendered", infoTolerant, durationsEqual ? "===" : "!==", tolerant)
    return durationsEqual
  }

  runPromise(): Promise<RunResult> {
    
    const results: RenderingResult[] = []
    const countsByType: NumberObject = {}
    const runData = {
      runResult: { results }, countsByType
    }
    
    let promise = this.directoryPromise().then(() => runData)
    
    const { outputsPopulated } = this
    const { outputDirectory, upload, definitions } = this.args
    

    outputsPopulated.forEach(output => {
      const {optional, outputType} = output
      
      const instanceOptions: RenderingCommandOutput = {
        options: {}, ...output
      }
      // options!.report ||= path.join(outputDirectory, `report`)
      const expectDuration = outputType !== OutputType.Image
      const renderingOutput = this.outputInstance(instanceOptions)
      
      promise = promise.then(data => {
        data.countsByType[outputType] ||= -1
        data.countsByType[outputType]++ 
        const index = data.countsByType[outputType]

        // console.log(this.constructor.name, "runPromise directoryPromise done")

        const outputPromise = renderingOutput.renderingDescriptionPromise(results)
        const flatPromise = outputPromise.then(renderingDescription => {
          // console.log(this.constructor.name, "runPromise renderingDescriptionPromise done")
          return this.combinedRenderingDescriptionPromise(index, renderingDescription)
        })
        return flatPromise.then(flatDescription => {
          const infoFilename = renderingOutputFile(index, output, ExtensionLoadedInfo)
          const infoPath = path.join(outputDirectory, infoFilename)
          const commandDescription = this.commandDescriptionMerged(flatDescription)
       
          if (!commandDescription) {
            if (!optional) throw `required ${outputType} failed`
            
            results.push({ outputType })
            const info = { warning: `found no ${outputType}`}
            return fs.promises.writeFile(infoPath, JSON.stringify(info))
          } 
          
          if (expectDuration) {
            const { duration } = commandDescription
            if (!duration) throw Errors.invalid.duration
          }

          const cmdFilename = renderingOutputFile(index, output, ExtensionCommands)
          const cmdPath = path.join(outputDirectory, cmdFilename)
          
          const destinationFileName = this.fileName(index, output, renderingOutput)
          const destination = `${outputDirectory}/${destinationFileName}`
          // console.log(this.constructor.name, "runPromise flatPromise done", destination)

          const renderPromise = this.renderResultPromise(
            destination, cmdPath, infoPath, output, commandDescription
          )
          return renderPromise.then(renderingResult => { results.push(renderingResult) })
        }).then(() => data)
      })
    })
    return promise.then(({ runResult }) => {
      if (upload) {
        const [clip] = this.mashInstance.tracks[0].clips
        const { contentId } = clip
        
        const definition = Defined.fromId(contentId)
        if (isPreloadableDefinition(definition)) {
          const { source: file, loadType: type } = definition
          const { preloader, args } = this
          const { outputDirectory } = args
          const graphFile: GraphFile = {
            input: true, definition, type, file
          }
          const url = preloader.key(graphFile)
          const infoPath = preloader.infoPath(url)
          // console.log("url", url, "infoPath", infoPath)
          return fs.promises.copyFile(infoPath, path.join(outputDirectory, `upload.${ExtensionLoadedInfo}`)).then(() => {
            return runResult
          })
        }
      }
      return runResult
    })
  }
}
