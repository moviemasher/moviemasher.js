import React from "react"
import {
  Layer, Layers, SelectType, isLayerFolder, DroppingPosition, ClassDropping, 
  assertTrue,
  isDefinitionType
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { LayerContext } from "../../Contexts/LayerContext"
import { ComposerContext } from "./ComposerContext"
import { ComposerLayer } from "./ComposerLayer"
import { useEditor } from "../../Hooks/useEditor"
import { dragType, dragTypes, isDragType, TransferTypeFiles } from "../../Helpers/DragDrop"

export interface ComposerContentProps extends PropsAndChild, WithClassName {}

/**
 * @parents Composer
 * @children ComposerLayer
 */
export function ComposerContent(props: ComposerContentProps): ReactResult {
  const composerContext = React.useContext(ComposerContext)

  const {
    droppingLayer, setDroppingLayer,
    droppingPosition, setDroppingPosition,
    onDrop, onDragLeave
  } = composerContext
  const editor = useEditor()

  const { className: propsClassName = 'content', children, ...rest } = props

  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const layersArray = (layers: Layers, depth = 0): React.ReactElement[] => {
    return layers.flatMap(layer => {
      if (!layer) {
        console.trace("layersArray no layer", depth, layers)
        return []
      }
      return layerArray(layer, depth)
    })
  }

  const layerArray = (layer: Layer, depth: number): React.ReactElement[] => {
    const layerContext = { layer, depth }
    const contextProps = {
      key: `layer-${layer.id}`,
      value: layerContext,
      children: <ComposerLayer {...child.props} />
    }
    const context = <LayerContext.Provider {...contextProps} />
    const elements = [context]
    if (isLayerFolder(layer) && !layer.collapsed) {
      elements.push(...layersArray(layer.layers, depth + 1))
    }
    return elements
  }

  const viewChildren = React.useMemo(
    () => layersArray(editor.selection.cast?.layers || []),
    [composerContext.refreshed, composerContext.selectedLayer]
  )

  const calculatedClassName = (): string => {
    const classes: string[] = [propsClassName]
    if (droppingPosition !== DroppingPosition.None && !droppingLayer) {
      classes.push(ClassDropping)
    }
    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingLayer, editor.selection.layer]
  )

  const onClick = () => { editor.selection.unset(SelectType.Layer) }

  const dragValid = (dataTransfer?: DataTransfer | null): dataTransfer is DataTransfer => {
    if (!dataTransfer) return false

    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) return true
    
    const type = dragType(dataTransfer)
    return !!type
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    const {dataTransfer} = event
    if (!dragValid(dataTransfer)) return 
    
    // const { types, files, items } = dataTransfer
    // console.log("types", types)
    // console.log("files", files)
    // console.log("items", items)
    // // const type = dragType(dataTransfer)

    setDroppingPosition(viewChildren.length)
    setDroppingLayer()
  }

  const viewProps = {
    ...rest, children: viewChildren, key: 'composer-view',
    onClick, onDragLeave, onDragOver, onDrop, className
  }
  return <View {...viewProps} />
}
