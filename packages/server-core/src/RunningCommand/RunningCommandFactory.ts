
import { CommandOptions } from "../Encode/Encode"
import { RunningCommand } from "./RunningCommand"
import { RunningCommandClass } from './RunningCommandClass'

const CommandFactoryInstances: Record<string, RunningCommand> = {}

export const runningCommandGet = (id: string): RunningCommand | undefined => {
  return CommandFactoryInstances[id]
}

export const runningCommandDelete = (id: string): void => {
  const existing = runningCommandGet(id)
  if (!existing) return

  delete CommandFactoryInstances[id]
  existing.kill()
}

export const runningCommandInstance = (id: string, options: CommandOptions): RunningCommand => {
  const command = new RunningCommandClass(id, options)
  CommandFactoryInstances[id] = command
  return command
}
