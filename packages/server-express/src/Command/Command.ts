import EventEmitter from "events"

interface Command extends EventEmitter {
  run: () => void
  save: (output: string) => Command
  kill: (signal: string) => void
  _getArguments: () => string[]
}

export { Command }
