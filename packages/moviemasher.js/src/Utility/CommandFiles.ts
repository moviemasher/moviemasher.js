import { CommandFiles } from "../MoveMe"
import { assertPositive, isPositive } from "./Is"

export const commandFilesInputIndex = (commandFiles: CommandFiles, id: string, visible: boolean) => {
  
  const inputCommandFiles = commandFiles.filter(commandFile => commandFile.input)
  const inputIndex = inputCommandFiles.findIndex(commandFile => commandFile.inputId === id)
  if (!isPositive(inputIndex)) console.log("commandFilesInputIndex", id, inputCommandFiles)
  assertPositive(inputIndex, 'commandFilesInputIndex')
  return inputIndex
}

export const commandFilesInput = (commandFiles: CommandFiles, id: string, visible?: boolean) => {
  const isVisible = !!visible
  const aOrV = isVisible ? 'v' : 'a'
  return [commandFilesInputIndex(commandFiles, id, isVisible), aOrV].join(':')
}