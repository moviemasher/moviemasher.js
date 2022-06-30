import fs from 'fs'
import path from 'path'

import {
  idGenerate, Mash, mashInstance, OutputFactory,
  RenderingOutput, RenderingOutputArgs, Errors, CommandFilters,
  RenderingCommandOutput, RenderingResult, CommandOutputs, OutputType,
  EmptyMethod, CommandDescription, CommandDescriptions, CommandOptions, Extension,
  CommandInput, RenderingDescription, AVType, CommandInputs,
  Defined,
  assertTrue,
} from "@moviemasher/moviemasher.js"
import {
  BasenameRendering, ExtensionCommands, ExtensionLoadedInfo
} from '../../../Setup/Constants'
import { RunningCommandFactory } from "../../../RunningCommand/RunningCommandFactory"
import { RenderingProcess, RenderingProcessArgs, RunResult } from "./RenderingProcess"
import { NodeLoader } from '../../../Utilities/NodeLoader'
import { CommandResult } from '../../../RunningCommand/RunningCommand'
import { probingInfoPromise } from '../../../Command/Probing'
import { renderingCommandOutputs, renderingOutputFile } from '../../../Utilities/Rendering'

export type RenderingProcessConcatFileDuration = [string, number]

export class RenderingProcessClass implements RenderingProcess {
  constructor(public args: RenderingProcessArgs) {
    Defined.define(...this.args.definitions)
  }

  concatFile(fileDurations: RenderingProcessConcatFileDuration[]): string {
    const lines = ['ffconcat version 1.0']
    lines.push(...fileDurations.flatMap(fileDuration => {
      const [file, duration] = fileDuration
      return [`file '${file}'`, `duration ${duration}`]
    }))
    return lines.join("\n")
  }

  commandDescriptionMerged(flatDescription: RenderingDescription): CommandDescription {
    const { visibleCommandDescriptions, audibleCommandDescription } = flatDescription
    const descriptions: CommandDescriptions = []
    const length = visibleCommandDescriptions?.length
    if (length) {
      if (length !== 1) throw Errors.internal + 'not flat'

      const [visibleCommandDescription] = visibleCommandDescriptions
      descriptions.push(visibleCommandDescription)
    }
    if (audibleCommandDescription) descriptions.push(audibleCommandDescription)
    if (!descriptions.length) throw Errors.internal + 'descriptions'

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
    assertTrue(durations.length !== descriptions.length, 'each description has duration')
    commandDescription.duration = Math.max(...durations)
    return commandDescription
  }

  private createDirectoryPromise(directoryPath: string): Promise<void> {
    return fs.promises.mkdir(directoryPath, { recursive: true }).then(EmptyMethod)
  }

  private createFilePromise(filePath: string, content: string): Promise<void> {
    return fs.promises.writeFile(filePath, content).then(EmptyMethod)
  }

  private directoryPromise(): Promise<void> {
    const { outputsPopulated: outputs, args } = this
    const { id } = this
    const { outputDirectory, mash, definitions } = args
    // console.log(this.constructor.name, "directoryPromise", outputDirectory)
    const argsJson = JSON.stringify({ id, outputs, mash, definitions }, null, 2)
    return this.createDirectoryPromise(outputDirectory).then(() => {
      const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
      return this.createFilePromise(jsonPath, argsJson)
    })
  }

  private fileName(commandOutput: RenderingCommandOutput, renderingOutput: RenderingOutput): string {
    const { outputType, videoRate } = commandOutput
    if (outputType !== OutputType.ImageSequence) return renderingOutputFile(commandOutput)
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

    const { args } = this
    const {
      mash, cacheDirectory, validDirectories, defaultDirectory, filePrefix
    } = args

    const mashOptions = {
      ...mash,
      preloader: new NodeLoader(cacheDirectory, filePrefix, defaultDirectory, validDirectories)
    }
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

  renderResultPromise(destinationPath: string, cmdPath: string, infoPath: string, commandOutput: RenderingCommandOutput, commandDescription: CommandDescription): Promise<RenderingResult> {
    const { outputType, avType } = commandOutput
    const { duration, inputs } = commandDescription

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

    const command = RunningCommandFactory.instance(this.id, commandOptions)
    const commands = ['ffmpeg', ...command.command._getArguments(), destinationPath]
    const commandsText = commands.join(' ')
    return fs.promises.writeFile(cmdPath, commandsText).then(() => {
      return command.runPromise(destinationPath).then((commandResult: CommandResult) => {
        // console.log(this.constructor.name, "renderResultPromise runPromise", destinationPath, commandResult)
        const renderingResult: RenderingResult = {
          ...commandResult, destination: destinationPath, outputType
        }
        const { error } = commandResult
        if (error) {
          return fs.promises.writeFile(infoPath, JSON.stringify(renderingResult)).then(() => renderingResult)
        }
        return probingInfoPromise(destinationPath, infoPath).then(() => renderingResult)
      })
    })
  }

  private renderingDescriptionPromise(renderingDescription: RenderingDescription): Promise<RenderingDescription> {
    const { visibleCommandDescriptions, commandOutput, audibleCommandDescription } = renderingDescription
    const length = visibleCommandDescriptions?.length
    if (!length || length === 1) {
      // console.log(this.constructor.name, "renderingDescriptionPromise resolved", length)
      return Promise.resolve(renderingDescription)
    }

    const extension = Extension.Mpg
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
    const temporaryDirectoryName = renderingOutputFile(commandOutput, 'concat')

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

      promise = promise.then(() => {
        const renderPromise = this.renderResultPromise(destinationPath, cmdPath, infoPath, output, description).then(EmptyMethod)
        return renderPromise
      })
      const concatFileDuration: RenderingProcessConcatFileDuration = [fileName, duration]
      return concatFileDuration
    })

    const concatFile = this.concatFile(fileDurations)
    const concatFilePath = path.join(temporaryDirectory, 'concat.txt')
    promise = promise.then(() => this.createFilePromise(concatFilePath, concatFile))

    return promise.then(() => {
      const commandInput: CommandInput = { source: concatFilePath }
      const durations = fileDurations.map(([_, duration]) => duration)
      const duration = durations.reduce((total, duration) => total + duration, 0)
      const description: CommandDescription = { inputs: [commandInput], duration, avType: AVType.Video }
      const renderingDescription: RenderingDescription = {
        commandOutput, audibleCommandDescription,
        visibleCommandDescriptions: [description],
      }
      return renderingDescription
    })
  }

  runPromise(): Promise<RunResult> {
    const results: RenderingResult[] = []
    const runResult: RunResult = { results }

    let promise = this.directoryPromise()
    const { outputsPopulated } = this
    outputsPopulated.forEach(output => {
      const { outputType } = output
      const expectDuration = outputType !== OutputType.Image
      // console.log(this.constructor.name, "runPromise", renderingCommandOutput, commandOutput)
      const renderingOutput = this.outputInstance(output)
      // console.log("commandOutput", commandOutput)

      promise = promise.then(() => {
        const outputPromise = renderingOutput.renderingDescriptionPromise(results)
        const flatPromise = outputPromise.then(renderingDescription => {
          return this.renderingDescriptionPromise(renderingDescription)
        })
        return flatPromise.then(flatDescription => {
          const commandDescription = this.commandDescriptionMerged(flatDescription)

          if (expectDuration) {
            const { duration } = commandDescription
            if (!duration) throw Errors.invalid.duration
          }

          const { outputDirectory } = this.args
          const destinationFileName = this.fileName(output, renderingOutput)
          const destPath = `${outputDirectory}/${destinationFileName}`
          const cmdFilename = renderingOutputFile(output, ExtensionCommands)
          const cmdPath = path.join(outputDirectory, cmdFilename)
          const infoFilename = renderingOutputFile(output, ExtensionLoadedInfo)
          const infoPath = path.join(outputDirectory, infoFilename)
          // console.log(this.constructor.name, "runPromise", infoPath)
          const renderPromise = this.renderResultPromise(
            destPath, cmdPath, infoPath, output, commandDescription
          )
          return renderPromise.then(renderingResult => { results.push(renderingResult) })
        })
      })
    })
    return promise.then(() => runResult)
  }
}
