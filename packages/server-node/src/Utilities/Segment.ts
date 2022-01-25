import { AVType, Layer, OutputOptions, ValueObject } from "@moviemasher/moviemasher.js"
import { GraphFilter, Segment } from "@moviemasher/moviemasher.js/src/declarations"
import { CommandArgs, CommandInput } from "../Command/Command"


const segmentToCommandArgs = (segment: Segment, options: OutputOptions, destination: string): CommandArgs => {
  const { layers, duration, avType } = segment
  const inputs: CommandInput[] = []
  const complexFilter: GraphFilter[] = []
  if (!duration) throw 'duration'
  const outputOptions: ValueObject = options.options || {}
  outputOptions.t ||= duration
  const output: OutputOptions = { options: outputOptions }

  if (!avType || avType === AVType.Audio) {
    if (options.audioCodec) output.audioCodec = options.audioCodec
    if (options.audioBitrate) output.audioBitrate = options.audioBitrate
    if (options.audioChannels) output.audioChannels = options.audioChannels
    if (options.audioRate) output.audioRate= options.audioRate
  }
  if (!avType || avType === AVType.Video) {

    if (options.videoCodec) output.videoCodec = options.videoCodec
    // if (options.width && options.height) output.size = `${options.width}x${options.height}`
    if (options.videoRate) output.videoRate = options.videoRate
  }



  layers.forEach((layer: Layer) => {
    const { merger, filters, layerInputs, files } = layer
    inputs.push(...layerInputs)
    complexFilter.push(...filters)
    if (merger) complexFilter.push(merger)
  })
  const commandOptions: CommandArgs = {
    inputs, complexFilter, output, destination
  }
  return commandOptions
}

export { segmentToCommandArgs }
