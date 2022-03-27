// import { BlendFilter } from "./Definitions/BlendFilter"
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
import { Definitions } from "../../Definitions"
import { Errors } from "../../Setup/Errors"
import { FilterDefinition, Filter, FilterDefinitionObject } from "./Filter"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"
import { DefinitionType } from "../../Setup/Enums"
import { FilterDefinitionClass } from "./FilterDefinition"


const filterDefinition = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <FilterDefinition> Definitions.fromId(id)

  return new FilterDefinitionClass(object)
//  throw Errors.invalid.definition.id + ' filterDefinition ' + id
}

const filterDefinitionFromId = (id : string) : FilterDefinition => {
  return filterDefinition({ id })
}

const filterInstance = (object : FilterDefinitionObject) : Filter => {
  return filterDefinition(object).instanceFromObject(object)
}

const filterFromId = (id : string) : Filter => { return filterInstance({ id }) }

const filterInitialize = (): void => {
  [
    new ConvolutionFilter({ id: 'com.moviemasher.filter.convolution', type: DefinitionType.Filter }),
    // new BlendFilter({ id: 'com.moviemasher.filter.blend', type: DefinitionType.Filter }),
    new ChromaKeyFilter({ id: 'com.moviemasher.filter.chromakey', type: DefinitionType.Filter }),
    new ColorFilter({ id: 'com.moviemasher.filter.color', type: DefinitionType.Filter }),
    new ColorChannelMixerFilter({ id: 'com.moviemasher.filter.colorchannelmixer', type: DefinitionType.Filter }),
    new CropFilter({ id: 'com.moviemasher.filter.crop', type: DefinitionType.Filter }),
    new DrawBoxFilter({ id: 'com.moviemasher.filter.drawbox', type: DefinitionType.Filter }),
    new DrawTextFilter({ id: 'com.moviemasher.filter.drawtext', type: DefinitionType.Filter }),
    new FadeFilter({ id: 'com.moviemasher.filter.fade', type: DefinitionType.Filter }),
    new OverlayFilter({ id: 'com.moviemasher.filter.overlay', type: DefinitionType.Filter }),
    new ScaleFilter({ id: 'com.moviemasher.filter.scale', type: DefinitionType.Filter }),
  ].forEach(instance => Definitions.install(instance))
}

const filterInstall = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id + 'filterInstall'

  Definitions.uninstall(id)
  const instance = filterDefinition(object)
  Definitions.install(instance)
  return instance
}

const FilterFactoryImplementation = {
  install: filterInstall,
  definition: filterDefinition,
  definitionFromId: filterDefinitionFromId,
  fromId: filterFromId,
  initialize: filterInitialize,
  instance: filterInstance,
}

Factories[DefinitionType.Filter] = FilterFactoryImplementation

export {
  filterInstall,
  filterDefinition,
  filterDefinitionFromId,
  FilterFactoryImplementation,
  filterFromId,
  filterInitialize,
  filterInstance,
}
