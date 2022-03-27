import { CommandOptions } from "@moviemasher/moviemasher.js"
import { RunningCommand } from "./RunningCommand"
import { RunningCommandClass } from './RunningCommandClass'

const CommandFactoryInstances: Record<string, RunningCommand> = {}

const commandFactoryGet = (id: string): RunningCommand | undefined => CommandFactoryInstances[id]

const commandFactoryDelete = (id: string): void => {
  const existing = commandFactoryGet(id)
  if (!existing) return

  delete CommandFactoryInstances[id]
  existing.kill()
}

const commandFactoryInstance = (id: string, options: CommandOptions): RunningCommand => {
  const command = new RunningCommandClass(id, options)
  CommandFactoryInstances[id] = command
  return command
}

const RunningCommandFactory = {
  instance: commandFactoryInstance,
  get: commandFactoryGet,
  delete: commandFactoryDelete,
}

export { RunningCommandFactory }
