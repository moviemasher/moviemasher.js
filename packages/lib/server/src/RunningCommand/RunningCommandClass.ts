import type { Command } from './Command/Command.js'
import type { CommandOptions } from '../encode/MashDescriberTypes.js'
import type { CommandDestination, RunningCommand } from './RunningCommand.js'

import { AVTypeAudio, AVTypeBoth, AVTypeVideo, assertPopulatedString, isPositive } from '@moviemasher/lib-shared'
import { ERROR, StringDataOrError, Strings, errorThrow, isDefiniteError } from '@moviemasher/runtime-shared'
import path from 'path'
import { commandInstance } from './Command/CommandFactory.js'
import { commandString, commandError } from '../Utility/Command.js'
import { directoryCreatePromise } from '../Utility/File.js'
import { CommandInputs } from '@moviemasher/runtime-server'

export class RunningCommandClass implements RunningCommand {
  constructor(public id: string, public commandOptions: CommandOptions) {
    if (!(this.inputs.length || this.filters.length)) {
      console.trace(this.constructor.name, 'with no inputs or commandFilters')
      return errorThrow(ERROR.Internal) 
    }
  }
  get avType(): string { return this.commandOptions.avType }

  get commandArguments(): Strings { return this.command._getArguments() }

  private _command?: Command
  
  get command(): Command {
    return this._command ||= commandInstance(this.commandOptions)
  }

  get options(): CommandOptions { return this.commandOptions }

  private get filters() { return this.commandOptions.commandFilters || [] }

  private get inputs(): CommandInputs { return this.commandOptions.inputs || [] }

  commandString(destination: string): string {
    return commandString(this.commandArguments, destination)
  }

  get graphString(): string {
    const { commandArguments, avType } = this

    const index = commandArguments.findIndex(arg => arg === '-filter_complex')
    if (!(isPositive(index) && index < commandArguments.length - 2)) return ''

    const filterComplex = commandArguments[index + 1]

    
    // capture all the audio and video inputs 
    const regex = /\[([0-9]*:[av])\]/g
    const matches = filterComplex.matchAll(regex)
    const nullsrcs = Array.from(matches).map(match => {
      const [_, captured] = match
      const strings: Strings = ['nullsrc=duration=10']
      if (captured.endsWith('v')) strings.push(':size=4592x3056')//1920x1080
      else strings.unshift('a')
      strings.push(`[${captured}]`)
      return strings.join('')
    })
    if (avType === AVTypeBoth) {
      const complex = filterComplex.replace(';aevalsrc', '[video-out];aevalsrc')
      nullsrcs.push(`${complex}[audio-out]`)
      nullsrcs.push('[audio-out]anullsink')
    if (avType !== AVTypeAudio) nullsrcs.push('[video-out]nullsink')
    } else {
      nullsrcs.push(filterComplex)
      if (avType !== AVTypeVideo) nullsrcs.push('anullsink')
    if (avType !== AVTypeAudio) nullsrcs.push('nullsink')
    }
    return nullsrcs.join(',')
  }

  kill() { this._command?.kill('SIGKILL') }

  get output() { return this.commandOptions.commandFilters || [] }

  async runPromise(destination: CommandDestination): Promise<StringDataOrError> {
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
