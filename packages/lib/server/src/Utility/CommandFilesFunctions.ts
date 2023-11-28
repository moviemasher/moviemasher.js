import type { CommandFiles } from '@moviemasher/runtime-server'

import { assertPositive, isPositive } from '@moviemasher/lib-shared/utility/guards.js'

const commandFilesInputIndex = (commandFiles: CommandFiles, id: string, _visible: boolean) => {
  const inputCommandFiles = commandFiles.filter(commandFile => commandFile.input)
  const inputIndex = inputCommandFiles.findIndex(commandFile => commandFile.inputId === id)
  if (!isPositive(inputIndex)) console.log('commandFilesInputIndex', id, inputCommandFiles)
  assertPositive(inputIndex, 'commandFilesInputIndex')
  return inputIndex
}

export const commandFilesInput = (commandFiles: CommandFiles, id: string, visible?: boolean) => {
  const isVisible = !!visible
  const aOrV = isVisible ? 'v' : 'a'
  return [commandFilesInputIndex(commandFiles, id, isVisible), aOrV].join(':')
}
