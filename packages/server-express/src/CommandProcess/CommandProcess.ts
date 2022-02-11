import EventEmitter from "events"

interface CommandProcess extends EventEmitter {
  run: () => void
  kill: (signal: string) => void
  _getArguments: () => string[]
}

export { CommandProcess }
