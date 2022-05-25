import { ChromaKeyFilter } from "./Definitions/ChromaKeyFilter"
import { ColorFilter } from "./Definitions/ColorFilter"
import { ColorChannelMixerFilter } from "./Definitions/ColorChannelMixerFilter"
import { ConvolutionFilter } from "./Definitions/ConvolutionFilter"
import { CropFilter } from "./Definitions/CropFilter"
import { DrawBoxFilter } from "./Definitions/DrawBoxFilter"
import { DrawTextFilter } from "./Definitions/DrawTextFilter"
import { FadeFilter } from "./Definitions/FadeFilter"
import { OverlayFilter } from "./Definitions/OverlayFilter"
import { ScaleFilter } from "./Definitions/ScaleFilter"
import { Errors } from "../../Setup/Errors"
import { FilterDefinition, Filter, FilterDefinitionObject } from "./Filter"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"
import { DefinitionType } from "../../Setup/Enums"
import { FilterDefinitionClass } from "./FilterDefinitionClass"
import { BlendFilter } from "./Definitions/BlendFilter"

const FilterIdPrefix = 'com.moviemasher.filter'

export const filterDefaults = [
  new ConvolutionFilter({ id: `${FilterIdPrefix}.convolution`, type: DefinitionType.Filter }),
  new BlendFilter({ id: `${FilterIdPrefix}.blend`, type: DefinitionType.Filter }),
  new ChromaKeyFilter({ id: `${FilterIdPrefix}.chromakey`, type: DefinitionType.Filter }),
  new ColorFilter({ id: `${FilterIdPrefix}.color`, type: DefinitionType.Filter }),
  new ColorChannelMixerFilter({ id: `${FilterIdPrefix}.colorchannelmixer`, type: DefinitionType.Filter }),
  new CropFilter({ id: `${FilterIdPrefix}.crop`, type: DefinitionType.Filter }),
  new DrawBoxFilter({ id: `${FilterIdPrefix}.drawbox`, type: DefinitionType.Filter }),
  new DrawTextFilter({ id: `${FilterIdPrefix}.drawtext`, type: DefinitionType.Filter }),
  new FadeFilter({ id: `${FilterIdPrefix}.fade`, type: DefinitionType.Filter }),
  new OverlayFilter({ id: `${FilterIdPrefix}.overlay`, type: DefinitionType.Filter }),
  new ScaleFilter({ id: `${FilterIdPrefix}.scale`, type: DefinitionType.Filter }),
]

export const filterDefinition = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  return new FilterDefinitionClass(object)
}

export const filterDefinitionFromId = (id: string): FilterDefinition => {
  const qualifiedId = id.includes('.') ? id : `${FilterIdPrefix}.${id}`
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

export const FilterFactoryImplementation =

Factories[DefinitionType.Filter] = {
  definition: filterDefinition,
  definitionFromId: filterDefinitionFromId,
  fromId: filterFromId,
  instance: filterInstance,
  defaults: filterDefaults,
}
