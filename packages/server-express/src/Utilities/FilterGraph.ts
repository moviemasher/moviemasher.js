import {
  GraphFilter, FilterGraph, AVType, FilterChain, OutputOptions, GraphType, ValueObject
} from "@moviemasher/moviemasher.js"

import { CommandArgs, CommandInput } from "../Command/Command"

const filterGraphToCommandArgs = (filterGraph: FilterGraph, options: OutputOptions, destination: string, graphType = GraphType.Cast): CommandArgs => {
  const { filterChains, duration, avType } = filterGraph
  const inputs: CommandInput[] = []
  const complexFilter: GraphFilter[] = []
  if (!duration) throw 'duration'

  const outputOptions: ValueObject = options.options || {}
  if (graphType !== GraphType.Cast) outputOptions.t ||= duration
  const output: OutputOptions = { format: options.format, options: outputOptions }
  if (!avType || avType === AVType.Audio) {
    if (options.audioCodec) output.audioCodec = options.audioCodec
    if (options.audioBitrate) output.audioBitrate = options.audioBitrate
    if (options.audioChannels) output.audioChannels = options.audioChannels
    if (options.audioRate) output.audioRate= options.audioRate
  }
  if (!avType || avType === AVType.Video) {
    if (options.videoCodec) output.videoCodec = options.videoCodec
    if (options.videoRate) output.videoRate = options.videoRate
  }

  filterChains.forEach((filterChain: FilterChain) => {
    const { merger, filters, inputs, files } = filterChain
    files.forEach(graphFile => {
      const { type, file } = graphFile

    })
    inputs.push(...inputs)
    complexFilter.push(...filters)
    if (merger) complexFilter.push(merger)
  })
  const commandOptions: CommandArgs = {
    inputs, complexFilter, output, destination
  }
  return commandOptions
}

export { filterGraphToCommandArgs }
