import { CommandFiles } from "../MoveMe"
import { assertPositive } from "./Is"

export const commandFilesInputIndex = (commandFiles: CommandFiles, id: string) => {
  const inputCommandFiles = commandFiles.filter(commandFile => commandFile.input)
  const inputIndex = inputCommandFiles.findIndex(commandFile => commandFile.inputId === id)
  assertPositive(inputIndex)
  return inputIndex
}

export const commandFilesInput = (commandFiles: CommandFiles, id: string, visible?: boolean) => (
  String(commandFilesInputIndex(commandFiles, id))
)