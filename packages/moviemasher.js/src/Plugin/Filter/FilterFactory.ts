import { ChromaKeyFilter } from "./Definitions/ChromaKeyFilter"
import { ColorFilter } from "./Definitions/ColorFilter"
import { ColorChannelMixerFilter } from "./Definitions/ColorChannelMixerFilter"
import { ConvolutionFilter } from "./Definitions/ConvolutionFilter"
import { CropFilter } from "./Definitions/CropFilter"
import { OverlayFilter } from "./Definitions/OverlayFilter"
import { ScaleFilter } from "./Definitions/ScaleFilter"

import { FilterDefinition, Filter, FilterDefinitionObject, Filters, FilterObject } from "./Filter"
import { assertPopulatedString } from "../../Utility/Is"
import { FilterDefinitionClass } from "./FilterDefinitionClass"
import { OpacityFilter } from "./Definitions/OpacityFilter"
import { SetsarFilter } from "./Definitions/SetsarFilter"
import { FpsFilter } from "./Definitions/FpsFilter"
import { IdPrefix } from "../../Setup/Constants"
import { SetptsFilter } from "./Definitions/SetptsFilter"
import { AlphamergeFilter } from "./Definitions/AlphamergeFilter"
import { TrimFilter } from "./Definitions/TrimFilter"
import { TextFilter } from "./Definitions/TextFilter"
import { ColorizeFilter } from "./Definitions/ColorizeFilter"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../../Helpers/Error/ErrorName"

export const FilterIdPrefix = `${IdPrefix}filter.`

export const filterDefinition = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  assertPopulatedString(id)
  return new FilterDefinitionClass(object)
}

export const filterDefinitionFromId = (id: string): FilterDefinition => {
  const qualifiedId = id.includes('.') ? id : `${FilterIdPrefix}${id}`
  const definition = Filters[qualifiedId] 
  if (definition) return definition 

  throw new Error(`NEW FILTER ${id} ${qualifiedId}`)
  return filterDefinition({ id: qualifiedId })
}

export const filterInstance = (object: FilterObject): Filter => {
  const { id } = object
  if (!id) return errorThrow(ErrorName.FilterId) 

  const definition = filterDefinitionFromId(id)
  return definition.instanceFromObject(object)
}

export const filterFromId = (id: string): Filter => {
  const definition = filterDefinitionFromId(id)
  return definition.instanceFromObject({ id })
}

(() => {
  const filters = {
    alphamerge: AlphamergeFilter,
    chromakey: ChromaKeyFilter, 
    colorchannelmixer: ColorChannelMixerFilter,
    color: ColorFilter,
    colorize: ColorizeFilter,
    convolution: ConvolutionFilter,
    crop: CropFilter,
    fps: FpsFilter,
    opacity: OpacityFilter,
    overlay: OverlayFilter,
    scale: ScaleFilter,
    setpts: SetptsFilter,
    setsar: SetsarFilter,
    trim: TrimFilter,
    text: TextFilter,
  }
  Object.entries(filters).forEach(([unqualifiedId, klass]) => {
    const id = `${FilterIdPrefix}${unqualifiedId}`
    Filters[id] = new klass({ id })
  })
})()
