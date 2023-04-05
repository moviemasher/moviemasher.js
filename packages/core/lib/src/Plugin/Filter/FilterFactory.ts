import { ChromaKeyFilter } from './Definitions/ChromaKeyFilter.js'
import { ColorFilter } from './Definitions/ColorFilter.js'
import { ColorChannelMixerFilter } from './Definitions/ColorChannelMixerFilter.js'
import { ConvolutionFilter } from './Definitions/ConvolutionFilter.js'
import { CropFilter } from './Definitions/CropFilter.js'
import { OverlayFilter } from './Definitions/OverlayFilter.js'
import { ScaleFilter } from './Definitions/ScaleFilter.js'

import { FilterDefinition, Filter, FilterDefinitionObject, Filters, FilterObject } from './Filter.js'
import { assertPopulatedString } from '../../Utility/Is.js'
import { FilterDefinitionClass } from './FilterDefinitionClass.js'
import { OpacityFilter } from './Definitions/OpacityFilter.js'
import { SetsarFilter } from './Definitions/SetsarFilter.js'
import { FpsFilter } from './Definitions/FpsFilter.js'
import { IdPrefix } from '../../Setup/Constants.js'
import { SetptsFilter } from './Definitions/SetptsFilter.js'
import { AlphamergeFilter } from './Definitions/AlphamergeFilter.js'
import { TrimFilter } from './Definitions/TrimFilter.js'
import { TextFilter } from './Definitions/TextFilter.js'
import { ColorizeFilter } from './Definitions/ColorizeFilter.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'

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
