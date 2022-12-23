import { RenderingOptions } from "../Api/Rendering";
import { Defined } from "../Base/Defined";
import { Mash } from "../Edited/Mash";
import { mashInstance } from "../Edited/Mash/MashFactory";
import { CommandOutputs } from "../Output/Output";
import { renderingCommandOutputs } from "../Output/OutputDefault";


export const mashAndOutputs = (options: RenderingOptions): [Mash, CommandOutputs] => {
  const { mash: mashObject, outputs: commandOutputs, definitions: definitionObjects = []} = options

  Defined.define(...definitionObjects)
  const mash = mashInstance(mashObject)
  const renderingOutputs = renderingCommandOutputs(commandOutputs)

  return [mash, renderingOutputs]
}


export const renderingDurationFiles = (options: RenderingOptions) => {
  const [mash, renderingOutputs] = mashAndOutputs(options)

  const files = renderingOutputs.flatMap(output => output.durationGraphFiles)
  return files
}


export const renderingFiles = (options: RenderingOptions) => {
  const [mash, renderingOutputs] = mashAndOutputs(options)

  const files = renderingOutputs.flatMap(output => output.durationGraphFiles)
  return files
}

export const mashCommands = (options: RenderingOptions) => {
  
  
}