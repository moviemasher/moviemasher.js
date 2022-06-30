import { ChromaKeyFilter } from "./Definitions/ChromaKeyFilter"
import { ColorFilter } from "./Definitions/ColorFilter"
import { ColorChannelMixerFilter } from "./Definitions/ColorChannelMixerFilter"
import { ConvolutionFilter } from "./Definitions/ConvolutionFilter"
import { CropFilter } from "./Definitions/CropFilter"
import { OverlayFilter } from "./Definitions/OverlayFilter"
import { ScaleFilter } from "./Definitions/ScaleFilter"
import { Errors } from "../Setup/Errors"
import { FilterDefinition, Filter, FilterDefinitionObject } from "./Filter"
import { Factories } from "../Definitions/Factories"
import { assertPopulatedString } from "../Utility/Is"
import { DefinitionType } from "../Setup/Enums"
import { FilterDefinitionClass } from "./FilterDefinitionClass"
import { BlendFilter } from "./Definitions/BlendFilter"
import { OpacityFilter } from "./Definitions/OpacityFilter"
import { SetsarFilter } from "./Definitions/SetsarFilter"
import { FpsFilter } from "./Definitions/FpsFilter"
import { IdPrefix } from "../Setup/Constants"
import { AlphaColorFilter } from "./Definitions/AlphaColorFilter"
import { SetptsFilter } from "./Definitions/SetptsFilter"
import { AlphamergeFilter } from "./Definitions/AlphamergeFilter"
import { TrimFilter } from "./Definitions/TrimFilter"
import { TextFilter } from "./Definitions/TextFilter"

export const FilterIdPrefix = `${IdPrefix}filter.`

export const filterDefaults = [
  new AlphaColorFilter({ id: `${FilterIdPrefix}alphacolor` }),
  new AlphamergeFilter({ id: `${FilterIdPrefix}alphamerge` }),
  new BlendFilter({ id: `${FilterIdPrefix}blend` }),
  new ChromaKeyFilter({ id: `${FilterIdPrefix}chromakey` }),
  new ColorChannelMixerFilter({ id: `${FilterIdPrefix}colorchannelmixer` }),
  new ColorFilter({ id: `${FilterIdPrefix}color` }),
  new ConvolutionFilter({ id: `${FilterIdPrefix}convolution` }),
  new CropFilter({ id: `${FilterIdPrefix}crop` }),
  new FpsFilter({ id: `${FilterIdPrefix}fps` }),
  new OpacityFilter({ id: `${FilterIdPrefix}opacity` }),
  new OverlayFilter({ id: `${FilterIdPrefix}overlay` }),
  new ScaleFilter({ id: `${FilterIdPrefix}scale` }),
  new SetptsFilter({ id: `${FilterIdPrefix}setpts` }),
  new SetsarFilter({ id: `${FilterIdPrefix}setsar` }),
  new TrimFilter({ id: `${FilterIdPrefix}trim` }),
  new TextFilter({ id: `${FilterIdPrefix}text` }),
]

export const filterDefinition = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  assertPopulatedString(id)
  return new FilterDefinitionClass(object)
}

export const filterDefinitionFromId = (id: string): FilterDefinition => {
  const qualifiedId = id.includes('.') ? id : `${FilterIdPrefix}${id}`
  const definition = filterDefaults.find(definition => definition.id === qualifiedId)
  if (definition) return definition

  return filterDefinition({ id: qualifiedId })
}

export const filterInstance = (object: FilterDefinitionObject): Filter => {
  const { id } = object
  if (!id) throw Errors.invalid.definition.id
  const definition = filterDefinitionFromId(id)
  return definition.instanceFromObject(object)
}

export const filterFromId = (id: string): Filter => {
  const definition = filterDefinitionFromId(id)
  return definition.instanceFromObject({ id })
}

Factories[DefinitionType.Filter] = {
  definition: filterDefinition,
  definitionFromId: filterDefinitionFromId,
  fromId: filterFromId,
  instance: filterInstance,
  defaults: filterDefaults,
}
