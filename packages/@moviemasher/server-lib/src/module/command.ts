

import { ERROR, arrayFromOneOrMore, errorCaught, createErrored,  errorPromise, namedError } from '@moviemasher/shared-lib/runtime.js'
import type { AsyncFunction, DataOrError, Strings, Typed } from '@moviemasher/shared-lib/types.js'


import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

export type ShellType = 'shell' | 'ffmpeg'

export interface ShellArgs extends Typed {
  type: ShellType
  command: string
  args: string | Strings
}

export interface ShellFunction extends AsyncFunction<DataOrError<string>, ShellArgs, object> {}

export const serverCommandFunction: ShellFunction = args => {
  if (!args) return errorPromise(ERROR.Syntax, args)

  const { command: cmd, type, args: stringOrArray } = args
  const switches = arrayFromOneOrMore(stringOrArray)
  return execPromise([cmd, ...switches].join(' ')).then(({ stdout, stderr }) => {
    if (type === 'ffmpeg') return { data: stderr }

    if (stderr) return createErrored({ name: ERROR.Internal, message: stderr, cause: cmd}) 
    //{ error: errorMessageObject(stderr, ERROR.Internal, cmd) }
    
    return { data: stdout }
  }).catch(errorCaught)
}
