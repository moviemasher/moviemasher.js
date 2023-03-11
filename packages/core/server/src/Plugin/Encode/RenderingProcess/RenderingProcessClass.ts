import fs from 'fs'
import path from 'path'

import {
  CommandInput, AVType, CommandInputs,
  CommandFilters,
  EmptyFunction, 
  assertTrue, assertSize, isDefined, 
  NumberRecord, assertAboveZero, 
  MashMedia, mashMedia, idGenerateString, RenderingCommandOutput, VideoType, SequenceType, ImageType, ErrorName, errorThrow, Size, Numbers, NewlineChar
} from "@moviemasher/moviemasher.js"

import {
  BasenameRendering, ExtensionCommands, ExtensionLoadedInfo, TsExtension
} from '../../../Setup/Constants'
import { 
  CommandDescription, CommandDescriptions, CommandOptions, RenderingDescription, 
  RenderingOutput, RenderingOutputArgs, RenderingResult 
} from '../Encode'
import { commandArgsString } from '../../../Utility/Command'
import { renderingOutputFile } from '../../../Utility/Rendering'
import { Probe } from '../../../Command/Probe/Probe'
import { RenderingProcess, RenderingProcessArgs, RunResult } from "./RenderingProcess"
import { runningCommandInstance } from '../../../RunningCommand/RunningCommandFactory'
import { CommandResult } from '../../../RunningCommand/RunningCommand'
import { renderingCommandOutput } from '../../../Defaults/OutputDefault'
import { RenderingOutputClass } from '../RenderingOutputClass'

export type RenderingProcessConcatFileDuration = [string, number]

export class RenderingProcessClass implements RenderingProcess {
  constructor(public args: RenderingProcessArgs) {
    // const { mash } = this.args
    // const { media } = mash
    // MediaCollection.define(...media)
  }

  private combinedRenderingDescriptionPromise(index: number, renderingDescription: RenderingDescription): Promise<RenderingDescription> {
    const { visibleCommandDescriptions, commandOutput, audibleCommandDescription } = renderingDescription
    const length = visibleCommandDescriptions?.length
    if (!length || length === 1) {
      // console.log(this.constructor.name, "combinedRenderingDescriptionPromise resolved", length)
      return Promise.resolve(renderingDescription)
    }

    const extension = TsExtension
    const {
      options: commandOutputOptions = {},
      audioBitrate, audioChannels, audioCodec, audioRate, outputType,
      ...rest
    } = commandOutput
    const options = { ...commandOutputOptions, an: '', qp: 0 }
    const output: RenderingCommandOutput = {
      ...rest, options, extension, outputType: VideoType
    }
    const { outputDirectory } = this.args
    const concatDirectoryName = renderingOutputFile(index, commandOutput, 'concat')

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
        return this.renderResultPromise(
          destinationPath, cmdPath, infoPath, output, description
        ).then(EmptyFunction)
      })
      return concatFileDuration
    })

    const concatFile = this.concatFile(fileDurations)
    const concatFilePath = path.join(concatDirectory, 'concat.txt')
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
        inputs: [commandInput], duration, avType: AVType.Video
      }
      if (inputs.length) {
        description.commandFilters =  [{ 
          inputs: [`${inputs.length}:v`], ffmpegFilter: 'copy', 
          options: {}, outputs: [] 
        }]  
      }
      
      const renderingDescription: RenderingDescription = {
        audibleCommandDescription, visibleCommandDescriptions: [description],
        commandOutput: { 
          ...commandOutput, width, height, 
          options: { ...commandOutputOptions, 'c:v': 'copy' } 
        }, 
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

    // else console.log(this.constructor.name, "commandDescriptionMerged no audibleCommandDescription")
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
    const avType = types.size === 1 ? [...types.values()].pop()! : AVType.Both
    const commandDescription: CommandDescription = { inputs, commandFilters, avType }
    assertTrue(durations.length === descriptions.length, 'each description has duration')
    commandDescription.duration = Math.max(...durations)
    // console.log(this.constructor.name, "commandDescriptionsMerged", inputs)
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
    const { commandOutput: outputs, args, id } = this
    const { outputDirectory, mash } = args
    // console.log(this.constructor.name, "directoryPromise", outputDirectory)
    const argsJson = JSON.stringify({ id, outputs, mash }, null, 2)
    return this.createDirectoryPromise(outputDirectory).then(() => {
      const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
      return this.createFilePromise(jsonPath, argsJson)
    })
  }

  private fileName(index: number, commandOutput: RenderingCommandOutput, renderingOutput: RenderingOutput): string {
    const { outputType, videoRate } = commandOutput
    return renderingOutputFile(index, commandOutput)
  }

  private _id?: string
  get id(): string {
    if (this._id) return this._id

    return this._id = this.args.id || idGenerateString()
  }

  private _mashMedia?: MashMedia
  private get mashMedia(): MashMedia {
    if (this._mashMedia) return this._mashMedia

    const { args } = this
    const { mash, output } = args
    const { width = 0, height = 0 } = output
    const size: Size = { width, height }
    return this._mashMedia = mashMedia(mash, size)
  }

  private outputInstance(commandOutput: RenderingCommandOutput): RenderingOutput {
    const { cacheDirectory } = this.args
    const { mashMedia: mash } = this
    const args: RenderingOutputArgs = { commandOutput, cacheDirectory, mash }
    return new RenderingOutputClass(args)
  }

  private _commandOutput?: RenderingCommandOutput
  private get commandOutput(): RenderingCommandOutput {
    return this._commandOutput ||= renderingCommandOutput(this.args.output)
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

  private renderResultPromise(destination: string, cmdPath: string, infoPath: string, commandOutput: RenderingCommandOutput, commandDescription: CommandDescription): Promise<RenderingResult> {
    const { outputType } = commandOutput
    const { duration, inputs } = commandDescription

    // console.log(this.constructor.name, "renderResultPromise", inputs)
    const commandOptions: CommandOptions = {
      output: commandOutput, ...commandDescription
    }

    const options = commandOutput.options!
    switch (outputType) {
      case ImageType: {
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
    const runCommandPromise = writeCommandPromise.then(() => {
      return command.runPromise(destination)
    })
    
    return runCommandPromise.then((commandResult: CommandResult) => {
      const renderingResult: RenderingResult = {
        ...commandResult, destination, outputType
      }
      const { error } = commandResult
      if (error) {
        // console.warn(this.constructor.name, "renderResultPromise runPromise", destination, error)
        return fs.promises.writeFile(infoPath, JSON.stringify(renderingResult)).then(() => renderingResult)
      }
      const { temporaryDirectory } = this.args
      return Probe.promise(temporaryDirectory, destination, infoPath).then(() => renderingResult)
    })
  }

  private rendered(destinationPath: string, duration = 0, tolerance = 0.1): boolean {
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
    const countsByType: NumberRecord = {}
    const runData = {
      runResult: { results }, countsByType
    }
    
    let promise = this.directoryPromise().then(() => runData)
    
    const { commandOutput: output } = this
    const { outputDirectory } = this.args
    

    // commandOutputs.forEach(output => {
      const { outputType } = output
      
      const instanceOptions: RenderingCommandOutput = {
        options: {}, ...output
      }
      // options!.report ||= path.join(outputDirectory, `report`)
      const expectDuration = outputType !== ImageType
      const renderingOutput = this.outputInstance(instanceOptions)
      
      promise = promise.then(data => {
        const { countsByType } = data
        if (!isDefined(countsByType[outputType])) countsByType[outputType] = -1
        countsByType[outputType]++ 
        const index = countsByType[outputType]

        // console.log(this.constructor.name, "runPromise directoryPromise done")

        const outputPromise = renderingOutput.renderingDescriptionPromise(results)
        const flatPromise = outputPromise.then(renderingDescription => {
          // console.log(this.constructor.name, "runPromise renderingDescriptionPromise done")
          return this.combinedRenderingDescriptionPromise(index, renderingDescription)
        })
        return flatPromise.then(flatDescription => {
          const { commandOutput } = flatDescription
          const infoFilename = renderingOutputFile(index, commandOutput, ExtensionLoadedInfo)
          const infoPath = path.join(outputDirectory, infoFilename)
          const commandDescription = this.commandDescriptionMerged(flatDescription)
       
          if (!commandDescription) {
            throw `required ${outputType} failed`
            
            results.push({ outputType })
            const info = { warning: `found no ${outputType}`}
            return fs.promises.writeFile(infoPath, JSON.stringify(info))
          } 
          
          if (expectDuration) {
            const { duration, inputs } = commandDescription
            // console.log(this.constructor.name, "command", inputs)

            if (!duration) return errorThrow(ErrorName.ImportDuration) 
            
          }

          const cmdFilename = renderingOutputFile(index, commandOutput, ExtensionCommands)
          const destinationFileName = this.fileName(index, commandOutput, renderingOutput)
          const cmdPath = path.join(outputDirectory, cmdFilename)
          const destination = path.join(outputDirectory, destinationFileName)
          // console.log(this.constructor.name, "runPromise flatPromise done", destination)

          const renderPromise = this.renderResultPromise(
            destination, cmdPath, infoPath, commandOutput, commandDescription
          )
          return renderPromise.then(renderingResult => { results.push(renderingResult) })
        }).then(() => data)
      })
    // })
    return promise.then(({ runResult }) => runResult)
  }
}
