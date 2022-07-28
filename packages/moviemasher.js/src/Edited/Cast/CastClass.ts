import { Scalar, UnknownObject } from "../../declarations"
import { Size } from "../../Utility/Size"
import { GraphFiles, GraphFileOptions } from "../../MoveMe"
import { SelectedProperties } from "../../Utility/SelectedProperty"
import { Default } from "../../Setup/Default"
import { Errors } from "../../Setup/Errors"
import { ActionType, DataType, DroppingPosition, SelectType } from "../../Setup/Enums"
import { assertPopulatedString, isAboveZero, isNumber, isString, isUndefined } from "../../Utility/Is"
import { EditedClass } from "../EditedClass"
import { Mashes } from "../Mash/Mash"
import { Cast, CastArgs } from "./Cast"
import { assertLayer, isLayerFolder, layerInstance } from "./Layer/LayerFactory"
import {
  Layer, LayerAndPosition, LayerFolder, LayerObject, LayerObjects, Layers, LayersAndIndex
} from "./Layer/Layer"
import { propertyInstance } from "../../Setup/Property"
import { EmptyMethod } from "../../Setup/Constants"
import { PreviewOptions, Svg, Svgs } from "../../Editor/Preview/Preview"
import { svgElement } from "../../Utility/Svg"
import { Actions } from "../../Editor/Actions/Actions"

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
    const { preloader } = this
    const object: LayerObject = {
      preloader, 
      ...layerObject
    }
    const layer = layerInstance(object, this)
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

  layersInitialize(layerObjects?: LayerObjects): void {
    if (!layerObjects) return
    const { preloader } = this
    this.layers.push(...layerObjects.map(layer =>
      layerInstance({ preloader, ...layer }, this)
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

  svgs(args: PreviewOptions): Svgs {
    const { mashes } = this
    const svgs = mashes.reverse().flatMap(mash => mash.svgs(args))
    // console.log(this.constructor.name, "svgs", svgs.length, mashes.length)
    return svgs
  }

  svg(args: PreviewOptions): Svg {
    const { imageSize, id } = this
    const element = svgElement(imageSize)
    element.append(...this.svgs(args).map(svg => svg.element))
    return { id, element: element }
  }

  selectedProperties(actions: Actions): SelectedProperties {
    return this.properties.map(property => ({
      selectType: SelectType.Cast, property, 
      value: this.value(property.name),
      changeHandler: (property: string, value: Scalar) => {
        assertPopulatedString(property, 'changeCast property')
    
        const redoValue = isUndefined(value) ? this.value(property) : value
        const undoValue = this.value(property)
        const options: UnknownObject = {
          property, target: this, redoValue, undoValue, type: ActionType.Change
        }
        actions.create(options)
      },
    }))
  }
  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.layers = this.layers
    return json
  }
}
