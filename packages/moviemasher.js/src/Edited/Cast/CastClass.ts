import { PreviewItem, PreviewItems, Scalar, SvgItem, UnknownObject } from "../../declarations"
import { Size } from "../../Utility/Size"
import { GraphFiles, PreloadOptions } from "../../MoveMe"
import { SelectedItems } from "../../Utility/SelectedProperty"
import { Default } from "../../Setup/Default"
import { Errors } from "../../Setup/Errors"
import { DroppingPosition, SelectType } from "../../Setup/Enums"
import { assertPopulatedString, isAboveZero, isNumber, isPopulatedArray } from "../../Utility/Is"
import { EditedClass } from "../EditedClass"
import { Mash, Mashes } from "../Mash/Mash"
import { Cast, CastArgs } from "./Cast"
import { assertLayer, isLayerFolder, layerInstance } from "./Layer/LayerFactory"
import {
  Layer, LayerAndPosition, LayerFolder, LayerObject, Layers, LayersAndIndex
} from "./Layer/Layer"
import { EmptyMethod } from "../../Setup/Constants"
import { PreviewOptions } from "../Mash/Preview/Preview"
import { svgElement, svgPolygonElement } from "../../Utility/Svg"
import { Actions } from "../../Editor/Actions/Actions"
import { Selectables } from "../../Editor/Selectable"
import { arrayReversed } from "../../Utility/Array"
import { Property } from "../../Setup/Property"
import { Editor } from "../../Editor/Editor"

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
    const {
      createdAt, icon, id, label,
      definitions,
      layers,
      preloader,
      ...rest
    } = args
    this.dataPopulate(rest)
    if (isPopulatedArray(layers)) this.layers.push(...layers.map(object => 
      this.createLayer(object)
    ))
    this.label ||= Default.cast.label
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
    const { preloader } = this
    const object: LayerObject = {
      preloader, 
      ...layerObject
    }
    const layer = layerInstance(object, this)
    assertLayer(layer)
    layer.cast = this

    return layer
  }

  destroy(): void {
    this.mashes.forEach(mash => mash.destroy())
  }

  protected override emitterChanged() {
    this.mashes.forEach(mash => mash.emitter = this.emitter)
  }

  editedGraphFiles(args?: PreloadOptions): GraphFiles {
    return this.mashes.flatMap(mash => mash.editedGraphFiles(args))
  }

  get imageSize(): Size { return super.imageSize }
  set imageSize(value: Size) {
    super.imageSize = value
    const { imageSize } = this
    this.mashes.forEach(mash => { mash.imageSize = imageSize })
  }

  layers: Layers = []

  get layerFolders(): LayerFolder[] {
    return CastLayerFolders(this.layers)
  }

  loadPromise(args?: PreloadOptions): Promise<void> {
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

  selectType = SelectType.Cast

  selectables(): Selectables { return [this] }

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => {
      const undoValue = this.value(property.name)
      const target = this
      return {
        value: undoValue,
        selectType: SelectType.Cast, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options = { property, target, redoValue, undoValue }
          actions.create(options)
        },
      }
    })
  }

  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    if (property) return

    switch (name) {
      case 'color': {
        this.mashes.forEach(mash => mash.setValue(value, name, property))
        break
      }
    }
  }
  
  previewItemsPromise(editor?: Editor): Promise<PreviewItems> {
    const { mashes } = this
    const items: PreviewItems = []
    let promise: Promise<PreviewItems> = Promise.resolve([])
    arrayReversed(mashes).forEach((mash: Mash) => {
      promise = promise.then(newItems => {
        items.push(...newItems)
        return mash.previewItemsPromise(editor)
      })
    })
    return promise.then(newItems => {
      items.push(...newItems)
      return items
    })
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.layers = this.layers
    return json
  }
}
