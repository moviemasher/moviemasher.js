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
import { Definitions } from "../Definitions"
import { Errors } from "../../Setup/Errors"
import { DefinitionType } from "../../Setup/Enums"
import { FilterDefinitionClass } from "./FilterDefinition"
import { FilterDefinition, Filter, FilterDefinitionObject } from "./Filter"
import { Factories } from "../Factories"
import { Is } from "../../Utilities/Is"

const Classes : {[index : string] : typeof FilterDefinitionClass } = {
  setsar: SetSarFilter,
  blend: BlendFilter,
  chromakey: ChromaKeyFilter,
  color: ColorFilter,
  colorchannelmixer: ColorChannelMixerFilter,
  convolution: ConvolutionFilter,
  crop: CropFilter,
  drawbox: DrawBoxFilter,
  drawtext: DrawTextFilter,
  fade: FadeFilter,
  overlay: OverlayFilter,
  scale: ScaleFilter,
}

const filterDefinition = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && typeof id === "string" && id.length)) throw Errors.id

  if (Definitions.installed(id)) return <FilterDefinition> Definitions.fromId(id)

  if (!Classes[id]) throw Errors.unknown.filter

  return new Classes[id]({ id, type: DefinitionType.Filter })
}

const filterDefinitionFromId = (id : string) : FilterDefinition => {
  return filterDefinition({ id })
}

const filterInstance = (object : FilterDefinitionObject) : Filter => {
  const { id } = object
  if (!id) throw Errors.id

  return filterDefinition({ id }).instanceFromObject(object)
}

const filterFromId = (id : string) : Filter => {
  return filterInstance({ id })
}

const filterInitialize = () : void => {}

const filterDefine = (object : FilterDefinitionObject) : FilterDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return filterDefinition(object)
}

const FilterFactoryImplementation = {
  define: filterDefine,
  definition: filterDefinition,
  definitionFromId: filterDefinitionFromId,
  fromId: filterFromId,
  initialize: filterInitialize,
  instance: filterInstance,
}

Factories.filter = FilterFactoryImplementation

export {
  filterDefine,
  filterDefinition,
  filterDefinitionFromId,
  FilterFactoryImplementation,
  filterFromId,
  filterInitialize,
  filterInstance,
}
