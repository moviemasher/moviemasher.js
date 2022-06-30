import { UnknownObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFiles, GraphFileOptions } from "../../MoveMe"
import { Default } from "../../Setup/Default"
import { Errors } from "../../Setup/Errors"
import { DataType, DroppingPosition } from "../../Setup/Enums"
import { isAboveZero, isNumber, isString } from "../../Utility/Is"
import { EditedClass } from "../EditedClass"
import { Mashes } from "../Mash/Mash"
import { Cast, CastArgs } from "./Cast"
import { assertLayer, isLayerFolder, layerInstance } from "./Layer/LayerFactory"
import {
  Layer, LayerAndPosition, LayerFolder, LayerObject, LayerObjects, Layers, LayersAndIndex
} from "./Layer/Layer"
import { propertyInstance } from "../../Setup/Property"
import { EmptyMethod, NamespaceSvg } from "../../Setup/Constants"
import { PreviewOptions } from "../../Editor/Preview/Preview"

const CastLayerFolders = (layers: Layer[]): LayerFolder[] => {
  return layers.flatMap(layer => {
    if (isLayerFolder(layer)) {
      return [layer, ...CastLayerFolders(layer.layers)]
    }
    return []
  })
}

const CastPositionIndex = (index: number, droppingPosition?: DroppingPosition): number => {
  if (droppingPosition === DroppingPosition.After) return index + 1

  return index
}

const CastFindLayerFolder = (layer: Layer, layers: Layers): LayerFolder | undefined => {
  if (layers.includes(layer)) return

  const layerFolders = CastLayerFolders(layers)
  return layerFolders.find(layerFolder => layerFolder.layers.includes(layer))
}

const CastLayersAndIndex = (layers: Layers, layerAndPosition: LayerAndPosition): LayersAndIndex => {
  const { layer, position = DroppingPosition.At } = layerAndPosition
  const numeric = isNumber(position)
  const defined = !!layer
  const folder = defined && isLayerFolder(layer)
  const index = numeric ? position : 0
  if (!defined || numeric) return {
    index: index, layers: folder ? layer.layers : layers
  }
  if (folder && position === DroppingPosition.At) return {
    index: 0, layers: layer.layers
  }
  const layerFolder = CastFindLayerFolder(layer, layers)
  if (!layerFolder) return { index, layers }

  const { layers: folderLayers} = layerFolder
  const currentIndex = folderLayers.indexOf(layer)
  if (currentIndex < 0) throw new Error(Errors.internal)

  return { layers: folderLayers, index: CastPositionIndex(currentIndex, position) }
}

export class CastClass extends EditedClass implements Cast {
  constructor(args: CastArgs) {
    super(args)
    const property = propertyInstance(
        { name: 'backcolor', type: DataType.Rgb, defaultValue: Default.cast.backcolor }
      )
    this.properties.push(property)
  
    const {
      createdAt,
      icon,
      id,
      label,
      layers,
      definitions,
      preloader,
      backcolor,
      ...rest
    } = args

    this.propertiesInitialize(args)
    // propertiesInitialize doesn't set defaults
    if (!isString(label)) this.label = Default.mash.label
    if (!isString(backcolor)) this.backcolor = Default.mash.backcolor

    this.dataPopulate(rest)
    this.layersInitialize(layers)
  }

  addLayer(layer: Layer, layerAndPosition: LayerAndPosition = {}) {
    const { layers, index } = CastLayersAndIndex(this.layers, layerAndPosition)
    layers.splice(index, 0, layer)
  }

  private _buffer = Default.cast.buffer
  get buffer(): number { return this._buffer }
  set buffer(value: number) {
    if (!isAboveZero(value)) throw Errors.invalid.argument + 'buffer ' + value

    if (this._buffer !== value) {
      this._buffer = value
      this.mashes.forEach(mash => { mash.buffer = value })
    }
  }

  createLayer(layerObject: LayerObject): Layer {
    const { preloader, visibleContext } = this
    const object = {
      preloader, visibleContext,
      ...layerObject
    }
    const layer = layerInstance(object)
    assertLayer(layer)

    return layer
  }

  destroy(): void {
    this.mashes.forEach(mash => mash.destroy())
  }

  protected override emitterChanged() {
    this.mashes.forEach(mash => mash.emitter = this._emitter)
  }

  graphFiles(args?: GraphFileOptions): GraphFiles {
    return this.mashes.flatMap(mash => mash.graphFiles(args))
  }

  get imageSize(): Dimensions { return super.imageSize }
  set imageSize(value: Dimensions) {
    super.imageSize = value
    const { imageSize } = this
    this.mashes.forEach(mash => { mash.imageSize = imageSize })
  }

  layers: Layers = []

  get layerFolders(): LayerFolder[] {
    return CastLayerFolders(this.layers)
  }

  layersInitialize(layerObjects?: LayerObjects): void {
    if (!layerObjects) return
    const { preloader } = this
    this.layers.push(...layerObjects.map(layer =>
      layerInstance({ preloader, ...layer })
    ))
  }

  loadPromise(args?: GraphFileOptions): Promise<void> {
    return Promise.all(this.mashes.map(mash => mash.loadPromise(args))).then(EmptyMethod)
  }

  get loading(): boolean {
    return this.mashes.some(mash => mash.loading)
  }

  get mashes(): Mashes { return this.layers.flatMap(layer => layer.mashes) }

  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): LayerAndPosition {
    const result = this.removeLayer(layer)
    this.addLayer(layer, layerAndPosition)
    return result
  }

  putPromise(): Promise<void> { 
    return Promise.all(this.mashes.map(mash => mash.putPromise())).then(EmptyMethod)
  }

  reload(): Promise<void> | undefined {
    // TODO: reload mashes?

    return
  }

  removeLayer(layer: Layer): LayerAndPosition {
    const layerFolder = CastFindLayerFolder(layer, this.layers)
    const layers = layerFolder?.layers || this.layers
    const index = layers.indexOf(layer)
    if (index < 0) {
      console.error("removeLayer", index, layers.length, layer.label, layerFolder?.label)
      throw new Error(Errors.internal)
    }

    layers.splice(index, 1)
    return { position: index, layer: layerFolder }
  }

  svgElement(graphArgs: PreviewOptions): SVGSVGElement {
    const { imageSize: size } = this
    const svg = globalThis.document.createElementNS(NamespaceSvg, 'svg')
    svg.setAttribute('height', String(size.height))
    svg.setAttribute('width', String(size.width))
    const args: PreviewOptions = {
      backcolor: this.backcolor, ...graphArgs,
    }
    svg.append(...this.mashes.map(mash => mash.svgElement(args)))
    return svg
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.layers = this.layers
    return json
  }
}
