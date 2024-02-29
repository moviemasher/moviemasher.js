import type { StringDataOrError, Strings, } from '@moviemasher/shared-lib/types.js'
import type { Command } from '../type/Command.js'
import type { CommandInputRecord, CommandOptions } from '../types.js'
import type { CommandFilters, CommandInput, CommandInputs } from '../types.js'
import type { RunningCommand } from './RunningCommand.js'

import { COLON, ERROR, errorThrow, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import path from 'path'
import { commandError, commandString } from '../utility/command.js'
import { directoryCreatePromise } from '../module/file-write.js'
import { commandInstance } from './CommandFactory.js'
import { isPositive } from '@moviemasher/shared-lib/utility/guard.js'

export class RunningCommandClass implements RunningCommand {
  constructor(public id: string, public commandOptions: CommandOptions) {
    if (!(this.inputs.length || this.filters.length)) {
      return errorThrow(ERROR.Internal) 
    }
  }
  get avType(): string { return this.commandOptions.avType }

  private _command?: Command
  get command(): Command {
    return this._command ||= commandInstance(this.options)
  }

  get commandArguments(): Strings { return this.command._getArguments() }

  private get filters(): CommandFilters { return this.options.commandFilters || [] }

  commandString(destination: string): string {
    return commandString(this.commandArguments, destination, true)
  }

  private get inputEntries(): [string, CommandInput][] { return Object.entries(this.inputRecord) }

  private get inputIds(): Strings { return this.inputEntries.map(([id]) => id) }

  private _inputRecord?: CommandInputRecord 

  private get inputRecord(): CommandInputRecord { 
    return this._inputRecord ||= this.commandOptions.inputsById || {} 
  }

  private get inputs(): CommandInputs { return this.inputEntries.map(([_, input]) => input) }

  kill() { this._command?.kill('SIGKILL') }

  private _options?: CommandOptions
  get options(): CommandOptions { return this._options ||= this.optionsInitialize }
  private get optionsInitialize(): CommandOptions {
    // filters with file inputs will reference by id - we change to index...
    
    // regex that captures content between square brackets
    const bracketRegex = /\[(.*?)\]/
    
    // regex that captures content before a colon and either v or a
    const idRegex = /^(.*?):([va])$/

    const removeBrackets = (value: string): string => {
      const [, id] = value.match(bracketRegex) || []
      return id || value
    }

    const idAndType = (value: string): Strings => {
      const [, id, type] = removeBrackets(value).match(idRegex) || []
      return [id, type]
    }

    const isId = (value: string): boolean => {
      const [id, type] = idAndType(value)
      const is = !!(id && type)
      // if (is) console.log(this.constructor.name, 'isId', { value, id, type })
      return is
    }
    

    const { commandOptions, inputs } = this

    const { commandFilters = [], output } = commandOptions
    const { options = {} } = output
    // find all referenced input ids 
    const all = [
      ...commandFilters.flatMap(({ inputs = [] }) => inputs),
      ...inputs.flatMap(({ outputOptions = {} }) => Object.keys(outputOptions)),
      ...Object.keys(options)
    ]

    const usedInputIds = all.filter(isId).map(input => idAndType(input)[0])
 
    const { inputIds: initialInputIds } = this

    // remove unused inputs from our input record
    const unusedInputIds = initialInputIds.filter(id => !usedInputIds.includes(id))
    // console.log(this.constructor.name, 'optionsInitialize', { initialInputIds, usedInputIds, unusedInputIds, all })
  
    if (unusedInputIds.length) {
      // console.log(this.constructor.name, 'optionsInitialize', { unusedInputIds })
      const { _inputRecord = {} } = this
      unusedInputIds.forEach(id => delete _inputRecord[id])
    }

    // get input ids again so we can reference by index
    const { inputIds } = this
    commandFilters.forEach(commandFilter => {
      const { inputs } = commandFilter
      if (!inputs?.length) return

      commandFilter.inputs = inputs.map(input => {
        const [inputId, aOrV] = idAndType(input)
        if (inputId) {
          const index = inputIds.indexOf(inputId)
          if (isPositive(index)) return [index, aOrV].join(COLON)
          else {
            // console.log(this.constructor.name, 'optionsInitialize UNFOUND', { input, inputId })
          }
        }
        return input
      })
    })
    this.inputs.forEach(input => {
      const { outputOptions = {} } = input
      Object.keys(outputOptions).forEach(key => {
        const [inputId] = idAndType(key)
        if (!inputId) return
        
        const index = inputIds.indexOf(inputId)
        if (isPositive(index)) {
          outputOptions[key.replace(inputId, String(index))] = outputOptions[key]
          delete outputOptions[key]
        } else {
          // console.log(this.constructor.name, 'optionsInitialize UNFOUND', { key, inputId })
        }
      })
    })
    Object.keys(options).forEach(key => {
      const [inputId] = idAndType(key)
      if (!inputId) return
      
      const index = inputIds.indexOf(inputId)
      if (isPositive(index)) {
        options[key.replace(inputId, String(index))] = options[key]
        delete options[key]
      } else {
        // console.log(this.constructor.name, 'optionsInitialize UNFOUND', { key, inputId })

      }

    })
    // console.log(this.constructor.name, 'optionsInitialize', commandOptions)
    return commandOptions
  }

  get output() { return this.commandOptions.commandFilters || [] }

  async runPromise(destination: string): Promise<StringDataOrError> {
    assertPopulatedString(destination)
  
    const orError = await directoryCreatePromise(path.dirname(destination))
    if (isDefiniteError(orError)) return orError

    const promise = new Promise<StringDataOrError>(resolve => {
      const { command } = this
      command.on('error', (error, stdout, stderr) => {
        // console.error(this.constructor.name, 'runPromise ON ERROR', {error, stdout, stderr})
        resolve({ error: commandError(this.commandArguments, destination, error, stderr, stdout)})
      })
      command.on('end', () => { resolve({ data: destination }) })
      try {
        command.save(destination)
      }
      catch (error) {
        // console.error(this.constructor.name, 'runPromise CAUGHT', error)
        resolve({ error: commandError(this.commandArguments, destination, error) })
      }
    })
    return await promise
  }
}
