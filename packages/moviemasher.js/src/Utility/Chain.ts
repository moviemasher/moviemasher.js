import { assert } from "console";
import { NumberObject } from "../declarations";
import { Chain, GraphState } from "../MoveMe";
import { assertArray, assertPopulatedArray } from "./Is";

export const chainAppend = (toChain: Chain, fromChain: Chain): void => {
  const { commandFilters, commandFiles } = toChain
  commandFiles.push(...fromChain.commandFiles)
  commandFilters.push(...fromChain.commandFilters)
}

export const chainPrepend = (toChain: Chain, fromChain: Chain): void => {
  const { commandFilters, commandFiles } = toChain
  commandFiles.unshift(...fromChain.commandFiles)
  commandFilters.unshift(...fromChain.commandFilters)
}

export const chainFinalize = (chain: Chain, graphState: GraphState) => {
  console.log("chainFinalize", graphState)
  const { visible, inputCount, previousOutput, outputRequired } = graphState
  const { commandFilters, commandFiles } = chain
  const counts: NumberObject = {}
  let previous = [previousOutput]
  let fileCount = inputCount
  const inputFiles = commandFiles.filter(commandFile => commandFile.input)
  const entries = inputFiles.map((inputFile, index) => {
    const input = [fileCount, visible ? 'v': 'a'].join(':')
    fileCount++
    return [inputFile.inputId, input] 
  })
  const inputsById = Object.fromEntries(entries)
  const { length } = commandFilters
  commandFilters.forEach((commandFilter, index) => {
    const { inputs, outputs, ffmpegFilter } = commandFilter
    if (!outputs?.length && (index < length - 1 || outputRequired)) {
     
      counts[ffmpegFilter] ||= 0
      const output = [ffmpegFilter.toUpperCase(), counts[ffmpegFilter]].join('-')
      counts[ffmpegFilter]++
      console.log('SETTING OUTPUTS', output)
      commandFilter.outputs = [output]
    } 
    if (inputs) {
      commandFilter.inputs = inputs.length ? inputs.map(input => inputsById[input] || input) : previous
    }
    previous = commandFilter.outputs!
  })
}