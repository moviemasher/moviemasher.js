import { Segment } from "@moviemasher/moviemasher.js/src/declarations"
import { CommandOptions } from "../Command/Command"


const segmentToCommandOptions = (segment: Segment): CommandOptions => {
  const commandOptions: CommandOptions = { inputs: [], complexFilter: [] }
  const { layers } = segment
  layers.forEach((layer, track) => {
    const { merger, filters, inputs } = layer
    if (inputs) commandOptions.inputs!.push(...inputs)
    commandOptions.complexFilter!.push(...filters)
    if (merger) commandOptions.complexFilter!.push(merger)
  })
  return commandOptions
}

export { segmentToCommandOptions }
