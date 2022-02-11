import fs from 'fs'
import path from 'path'

import {
  Definition, Factory, fetchCallback,
  idGenerate, Mash, MashFactory, outputDefaultFromOptions,
  OutputFactory,
  GraphType,
  EmptyMethod,
  OutputConstructorArgs,
  DefinitionObject,
  Errors
} from "@moviemasher/moviemasher.js"
import { CommandFactory } from "../../../Command/CommandFactory"
import { filterGraphToCommandArgs } from "../../../Utilities/FilterGraph"
import { Job, JobArgs } from "./Job"
import { NodePreloader } from '../../../Utilities/NodePreloader'

class JobClass implements Job {
  constructor(args: JobArgs) {
    this.args = args
  }

  args: JobArgs

  directoryPromise(): Promise<void> {
    const { idDirectory } = this
    console.log(this.constructor.name, "directoryPromise", idDirectory)
    return fs.promises.mkdir(idDirectory, { recursive: true }).then(() => {
      const mashPath = path.join(idDirectory, 'mash.json')
      const mashJson = JSON.stringify(this.args.mash)
      return fs.promises.writeFile(mashPath, mashJson).then(() => {
        const definitionsPath = path.join(idDirectory, 'definitions.json')
        const definitionsJson = JSON.stringify(this.args.definitions)
        return fs.promises.writeFile(definitionsPath, definitionsJson)
      })
    })
  }


  private _definitionInstances?: Definition[]
  get definitionInstances(): Definition[] {
    if (this._definitionInstances) return this._definitionInstances

    return this._definitionInstances = this.args.definitions.map(definition =>
      Factory.definitionFromObject(definition)
    )
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

    const { definitions, fileDirectory } = this.args
    definitions.forEach((definition: DefinitionObject) => {
      const { type, source } = definition
      if (!source || source.includes('://')) return
      if (!type) throw Errors.invalid.type


      const resolved = path.resolve(fileDirectory, source)
      const url = resolved // `file:/${resolved}`
      console.log(this.constructor.name, "mashInstance resolved", definition.source, 'to', url)
      definition.source = url
    })

    const mash = MashFactory.instance(this.args.mash, definitions)

    return this._mashInstance = mash
  }

  renderPromise(): Promise<void> {
    let promise = this.directoryPromise()
    promise = promise.then(() => {
      const { outputs, cacheDirectory, fileDirectory } = this.args
      const { mashInstance } = this
      const preloader = new NodePreloader(cacheDirectory, fileDirectory)
      mashInstance.preloader = preloader

      outputs.forEach(outputObject => {
        const outputArgs = outputDefaultFromOptions(outputObject)
        console.log(this.constructor.name, "renderPromise outputArgs", outputArgs)
        const { type } = outputArgs
        const constructorArgs: OutputConstructorArgs = {
          output: outputObject, cacheDirectory,
          mash: mashInstance, preloader,
        }
        const output = OutputFactory[type](constructorArgs)

        output.filterGraphsPromise().then(filterGraphs => {
          console.log(this.constructor.name, "renderPromise filterGraphs", filterGraphs)
          if (filterGraphs.length > 1) {
            filterGraphs.forEach(filterGraph => {
              console.log("filterGraph", filterGraph)

            })
          } else {
            const [filterGraph] = filterGraphs
            const { format, type } = output
            const destination = `${this.idDirectory}/${type}.${format}`
            const commandArgs = filterGraphToCommandArgs(filterGraph, output, destination, GraphType.Mash)

            console.log("commandArgs", commandArgs)

            const render = CommandFactory.instance(this.id, commandArgs)
            render.addListener('error', error => {
              console.error(error, commandArgs)
              throw String(error)
            })
            render.runPromise().then(error => {
              if (error) throw error
              console.log("rendered!")
            })
          }
        })
      })

    })

    const { callback } = this.args
    if (callback) promise = promise.then(() => fetchCallback(callback))
    return promise.then(EmptyMethod)
  }
}

export { JobClass }
