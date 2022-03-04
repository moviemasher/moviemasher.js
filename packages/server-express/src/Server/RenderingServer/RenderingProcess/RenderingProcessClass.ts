import fs from 'fs'
import path from 'path'

import {
  fetchCallback,
  idGenerate, Mash, MashFactory, OutputFactory,
  RenderingOutputArgs,
  Errors,
  RenderingOutput,
  outputDefaultPopulate,
  RenderingCommandOutput, RenderingResult, OutputType, CommandOutput, OutputFormat, outputDefaultVideo,

} from "@moviemasher/moviemasher.js"
import { RunningCommandFactory } from "../../../RunningCommand/RunningCommandFactory"
import { RenderingProcess, RenderingProcessArgs, RunResult } from "./RenderingProcess"
import { NodePreloader } from '../../../Utilities/NodePreloader'
import { CommandResult } from '../../../RunningCommand/RunningCommand'

const outputDefaultOverDefaults = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultVideo(overrides)
    return {
      ...commandOutput,
      ...object,
    }
}

const outputDefaultAudioConcat = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const baseOptions: CommandOutput = { ...object, format: OutputFormat.AudioConcat }
  return outputDefaultOverDefaults(baseOptions)
}

const outputDefaultVideoConcat = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const baseOptions: CommandOutput = { ...object, format: OutputFormat.VideoConcat }
  return outputDefaultOverDefaults(baseOptions)
}


class RenderingProcessClass implements RenderingProcess {
  constructor(args: RenderingProcessArgs) {
    this.args = args
  }

  args: RenderingProcessArgs

  directoryPromise(): Promise<void> {
    const { idDirectory } = this
    // console.log(this.constructor.name, "directoryPromise", idDirectory)
    const definitionsJson = JSON.stringify(this.args.definitions)
    const mashJson = JSON.stringify(this.args.mash)
    return fs.promises.mkdir(idDirectory, { recursive: true }).then(() => {
      const mashPath = path.join(idDirectory, 'mash.json')
      return fs.promises.writeFile(mashPath, mashJson).then(() => {
        const definitionsPath = path.join(idDirectory, 'definitions.json')
        return fs.promises.writeFile(definitionsPath, definitionsJson)
      })
    })
  }

  private _id?: string
  get id(): string {
    if (this._id) return this._id

    return this._id = this.args.id || idGenerate()
  }

  get idDirectory(): string {
    const { renderingDirectory } = this.args
    return path.join(renderingDirectory, this.id)
  }

  private _mashInstance?: Mash
  get mashInstance(): Mash {
    if (this._mashInstance) return this._mashInstance

    const { definitions, mash } = this.args
    return this._mashInstance = MashFactory.instance(mash, definitions)
  }

  outputInstance(commandOutput: RenderingCommandOutput): RenderingOutput {
    const { outputType } = commandOutput
    const { cacheDirectory, fileDirectory } = this.args
    const preloader = new NodePreloader(cacheDirectory, fileDirectory)
    const { mashInstance } = this
    mashInstance.preloader = preloader
    const args: RenderingOutputArgs = {
      commandOutput, cacheDirectory, mash: mashInstance,
    }
    return OutputFactory[outputType](args)
  }


  outputTypeDestination(renderingOutput: RenderingOutput, commandOutput: RenderingCommandOutput): string {
    const { outputType  } = renderingOutput
    const { format, extension } = commandOutput
    switch (outputType) {
      case OutputType.VideoSequence:
        const fps = Number(commandOutput.videoRate)
        const {duration} = renderingOutput
        const framesMax = Math.floor(fps * duration) - 2
        const begin = 1

        const lastFrame = begin + (framesMax - begin)
        const padding = String(lastFrame).length
        return `${this.idDirectory}/%0${padding}d.${extension || format}`

      default: return `${this.idDirectory}/${outputType}.${extension || format}`
    }
  }

  runPromise(): Promise<RunResult> {
    const results: RenderingResult[] = []
    const runResult: RunResult = { results }

    let promise = this.directoryPromise()
    const { outputs } = this.args
    outputs.forEach(renderingCommandOutput => {
      const commandOutput = outputDefaultPopulate(renderingCommandOutput)
      // console.log(this.constructor.name, "runPromise", renderingCommandOutput, commandOutput)
      const { outputType } = commandOutput
      const output = this.outputInstance(commandOutput)
      const outputPromise = output.commandArgsPromise(results).then(commandArgs => {
        // console.log(this.constructor.name, "runPromise filterGraphs", filterGraphs)
        if (commandArgs.length > 1) {
          commandArgs.forEach(commandArg => {
            console.log(this.constructor.name, "runPromise MULTIPLE commandArg", commandArg)
            throw Errors.unimplemented + 'multiple commands...'
          })
        } else {
          const [commandArg] = commandArgs
          // console.log(this.constructor.name, "runPromise commandArg", commandArg)
          // return Promise.resolve()

          // const { format, extension } = commandOutput
          // `${this.idDirectory}/${outputType}.${extension || format}`
          const destination = this.outputTypeDestination(output, commandOutput)

          const command = RunningCommandFactory.instance(this.id, commandArg)

          command.addListener('error', error => {
            // console.log(error, commandArg, command.command._getArguments(), destination)
            throw String(error)
          })

          return command.runPromise(destination).then((result: CommandResult) => {
            const { error } = result
            // console.log(this.constructor.name, "runPromise runPromise then", result)
            if (error) throw error

            const renderingResult: RenderingResult = {
              ...result, destination, outputType
            }
            results.push(renderingResult)
            // return renderingResult
          })
        }
      })
      promise = promise.then(() => outputPromise)
    })

    const { callback } = this.args
    if (callback) promise = promise.then(() => fetchCallback(callback))
    return promise.then(() => runResult)
  }
}

export { RenderingProcessClass }
