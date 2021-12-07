import { BlendFilter } from "./Definitions/BlendFilter"
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
import { SetSarFilter } from "./Definitions/SetSarFilter"
import { Definitions } from "../../Definitions"
import { Errors } from "../../Setup/Errors"
import { FilterDefinition, Filter, FilterDefinitionObject } from "./Filter"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utilities/Is"
import { DefinitionType } from "../../Setup/Enums"


const filterDefinition = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <FilterDefinition> Definitions.fromId(id)

  throw Errors.invalid.definition.id + ' filterDefinition ' + id
}

const filterDefinitionFromId = (id : string) : FilterDefinition => {
  return filterDefinition({ id })
}

const filterInstance = (object : FilterDefinitionObject) : Filter => {
  return filterDefinition(object).instanceFromObject(object)
}

const filterFromId = (id : string) : Filter => { return filterInstance({ id }) }

const filterInitialize = () : void => {
  new ConvolutionFilter({ id: 'convolution', type: DefinitionType.Filter })
  new SetSarFilter({ id: 'setsar', type: DefinitionType.Filter })
  new BlendFilter({ id: 'blend', type: DefinitionType.Filter })
  new ChromaKeyFilter({ id: 'chromakey', type: DefinitionType.Filter })
  new ColorFilter({ id: 'color', type: DefinitionType.Filter })
  new ColorChannelMixerFilter({ id: 'colorchannelmixer', type: DefinitionType.Filter })
  new CropFilter({ id: 'crop', type: DefinitionType.Filter })
  new DrawBoxFilter({ id: 'drawbox', type: DefinitionType.Filter })
  new DrawTextFilter({ id: 'drawtext', type: DefinitionType.Filter })
  new FadeFilter({ id: 'fade', type: DefinitionType.Filter })
  new OverlayFilter({ id: 'overlay', type: DefinitionType.Filter })
  new ScaleFilter({ id: 'scale', type: DefinitionType.Filter })
}

const filterDefine = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id + 'filterDefine'

  Definitions.uninstall(id)
  return filterDefinition(object)
}

const FilterFactoryImplementation = {
  define: filterDefine,
  install: filterDefine,
  definition: filterDefinition,
  definitionFromId: filterDefinitionFromId,
  fromId: filterFromId,
  initialize: filterInitialize,
  instance: filterInstance,
}

Factories[DefinitionType.Filter] = FilterFactoryImplementation

export {
  filterDefine,
  filterDefine as filterInstall,
  filterDefinition,
  filterDefinitionFromId,
  FilterFactoryImplementation,
  filterFromId,
  filterInitialize,
  filterInstance,
}
