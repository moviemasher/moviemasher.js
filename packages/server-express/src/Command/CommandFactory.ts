import { Endpoint } from "@moviemasher/moviemasher.js"
import { Command, CommandOptions } from "./Command"
import { CommandClass } from './CommandClass'

const CommandFactoryInstances: Record<string, Command> = {}

const commandFactoryGet = (id: string): Command | undefined => CommandFactoryInstances[id]

const commandFactoryDelete = (id: string): void => {
  const existing = commandFactoryGet(id)
  if (!existing) return

  delete CommandFactoryInstances[id]
  existing.kill()
}


const commandFactoryInstance = (id: string, options?: CommandOptions): Command => {
  const command = new CommandClass(id, options)
  CommandFactoryInstances[id] = command
  return command
}


const CommandFactory = {
  instance: commandFactoryInstance,
  get: commandFactoryGet,
  delete: commandFactoryDelete,
}

export { CommandFactory }
