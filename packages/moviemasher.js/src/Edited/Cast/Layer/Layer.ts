import { Propertied } from "../../../Base/Propertied"
import { Selectable } from "../../../Editor/Selectable"
import { Loader } from "../../../Loader/Loader"
import { DroppingPosition, isLayerType, LayerType } from "../../../Setup/Enums"
import { isObject } from "../../../Utility/Is"
import { Mash, Mashes, MashObject } from "../../Mash/Mash"
import { Cast } from "../Cast"
import { Triggers } from "../Trigger/Trigger"


export interface LayerObject  {
  type: LayerType
  label?: string
  mash?: MashObject
  layers?: LayerObjects
  preloader?: Loader
}

export const isLayerObject = (value: any): value is LayerObject => {
  return isObject(value) && "type" in value && isLayerType(value.type)
}

export interface LayerFolderObject extends LayerObject {
  collapsed: boolean
  layers: LayerObjects
}

export const isLayerFolderObject = (value: any): value is LayerFolderObject => {
  return isLayerObject(value) && value.type === LayerType.Folder
}

export interface LayerMashObject extends LayerObject {
  mash: MashObject
}

export const isLayerMashObject = (value: any): value is LayerMashObject => {
  return isLayerObject(value) && value.type === LayerType.Mash
}

export interface LayerArgs {
  label?: string
}

export interface LayerMashArgs extends LayerArgs {
  mash: Mash
}

export interface LayerFolderArgs extends LayerArgs {
  collapsed: boolean
  layers: Layers
}

export type LayerObjects = LayerObject[]

export interface LayerMash extends Layer, LayerMashArgs {
}

export interface LayerFolder extends Layer, LayerFolderArgs {
}

export interface Layer extends Propertied, LayerArgs, Selectable {
  id: string
  mashes: Mashes
  cast: Cast
  type: LayerType
  triggers: Triggers
}
export type Layers = Layer[]

export interface LayersAndIndex {
  layers: Layers
  index: number
}


export interface LayerAndPosition {
  layer?: Layer
  position?: DroppingPosition | number
}
