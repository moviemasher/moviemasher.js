import { LayerType } from "../../../Setup/Enums"
import { mashInstance } from "../../Mash/MashFactory"
import { LayerFolderClass } from "./LayerFolderClass"
import { LayerMashClass } from "./LayerMashClass"
import { LayerClass } from "./LayerClass"
import {
  isLayerFolderObject, isLayerMashObject, Layer, LayerFolder, LayerFolderArgs,
  LayerFolderObject, LayerMash, LayerMashArgs, LayerMashObject, LayerObject
} from "./Layer"

const LayerFolderDefault = { type: LayerType.Folder, collapsed: false, layers: [] }
const LayerMashDefault = { type: LayerType.Mash, mash: {} }

export const layerFolderInstance = (object: LayerFolderObject = LayerFolderDefault): LayerFolder => {
  const { definitions, preloader } = object
  object.layers ||= []
  const args:LayerFolderArgs = {
    ...object,
    layers: object.layers.map(layer => layerInstance({ definitions, preloader, ...layer }))
  }
  return new LayerFolderClass(args)
}

export const layerMashInstance = (object: LayerMashObject = LayerMashDefault): LayerMash => {
  const { definitions, preloader } = object

  object.mash ||= {}
  const args: LayerMashArgs = {
    ...object,
    mash: mashInstance({ preloader, definitions, ...object.mash })
  }
  return new LayerMashClass(args)
}

export const layerInstance = (layerObject: LayerObject): Layer => {
  if (isLayerMashObject(layerObject)) return layerMashInstance(layerObject)
  if (isLayerFolderObject(layerObject)) return layerFolderInstance(layerObject)
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
