import { CommandFiles } from "../MoveMe"
import { assertPositive, isPositive } from "./Is"

export const commandFilesInputIndex = (commandFiles: CommandFiles, id: string) => {
  const inputCommandFiles = commandFiles.filter(commandFile => commandFile.input)
  const inputIndex = inputCommandFiles.findIndex(commandFile => commandFile.inputId === id)
  if (!isPositive(inputIndex)) console.log("commandFilesInputIndex", id, inputCommandFiles)
  assertPositive(inputIndex, 'commandFilesInputIndex')
  return inputIndex
}

export const commandFilesInput = (commandFiles: CommandFiles, id: string, visible?: boolean) => (
  [commandFilesInputIndex(commandFiles, id), visible ? 'v' : 'a'].join(':')
)