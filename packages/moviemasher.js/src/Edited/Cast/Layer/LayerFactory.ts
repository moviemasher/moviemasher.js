import { LayerType } from "../../../Setup/Enums"
import { mashInstance } from "../../Mash/MashFactory"
import { LayerFolderClass } from "./LayerFolderClass"
import { LayerMashClass } from "./LayerMashClass"
import { LayerClass } from "./LayerClass"
import {
  isLayerFolderObject, isLayerMashObject, Layer, LayerFolder, LayerFolderArgs,
  LayerFolderObject, LayerMash, LayerMashArgs, LayerMashObject, LayerObject
} from "./Layer"
import { Cast } from "../Cast"

const LayerFolderDefault = { type: LayerType.Folder, collapsed: false, layers: [] }
const LayerMashDefault = { type: LayerType.Mash, mash: {} }

export const layerFolderInstance = (object: LayerFolderObject, cast: Cast): LayerFolder => {
  const { preloader } = object
  object.layers ||= []
  const args:LayerFolderArgs = {
    ...object,
    layers: object.layers.map(layer => layerInstance({ preloader, ...layer }, cast))
  }
  return new LayerFolderClass(args)
}

export const layerMashInstance = (object: LayerMashObject, cast: Cast): LayerMash => {
  const { preloader } = object

  object.mash ||= {}
  const mash = mashInstance({ preloader, ...object.mash } )
  const args: LayerMashArgs = {
    ...object,
    mash
  }
  return new LayerMashClass(args)
}

export const layerInstance = (layerObject: LayerObject, cast: Cast): Layer => {
  if (isLayerMashObject(layerObject)) return layerMashInstance(layerObject, cast)
  if (isLayerFolderObject(layerObject)) return layerFolderInstance(layerObject, cast)
  throw new Error("expected LayerObject")
}

export const isLayer = (value: any): value is Layer => value instanceof LayerClass
export function assertLayer(value: any): asserts value is Layer {
  if (!isLayer(value)) throw "expected Layer"
}

export const isLayerMash = (value: any): value is LayerMash => value instanceof LayerMashClass
export function assertLayerMash(value: any): asserts value is LayerMash {
  if (!isLayerMash(value)) throw "expected LayerMash"
}

export const isLayerFolder = (value: any): value is LayerFolder => value instanceof LayerFolderClass
export function assertLayerFolder(value: any): asserts value is LayerFolder {
  if (!isLayerFolder(value)) throw "expected LayerFolder"
}
