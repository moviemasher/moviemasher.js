import React from "react"
import {
  Layer, Layers, SelectionType, isLayerFolder, DroppingPosition
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { Problems } from "../../Setup/Problems"
import { LayerContext } from "../../Contexts/LayerContext"
import { ComposerContext } from "../../Contexts/ComposerContext"
import { EditorContext } from "../../Contexts/EditorContext"
import { ComposerLayer } from "./ComposerLayer"

export interface ComposerContentProps extends PropsAndChild, WithClassName {}

/**
 * @parents Composer
 * @children ComposerLayer
 */
export function ComposerContent(props: ComposerContentProps): ReactResult {
  const composerContext = React.useContext(ComposerContext)
  const editorContext = React.useContext(EditorContext)

  const {
    droppingLayer, setDroppingLayer,
    droppingPosition, setDroppingPosition,
    onDrop, onDragLeave
  } = composerContext
  const { editor, droppingClass } = editorContext
  if (!editor) return null

  const { className: propsClassName = 'content', children, ...rest } = props

  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

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
      classes.push(droppingClass)
    }
    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingLayer, editor.selection.layer]
  )

  const onClick = () => { editor.deselect(SelectionType.Layer) }

  const onDragOver: React.DragEventHandler = event => {
    setDroppingPosition(viewChildren.length)
    setDroppingLayer()
    event.preventDefault()
  }

  const viewProps = {
    ...rest, children: viewChildren, key: 'composer-view',
    onClick, onDragLeave, onDragOver, onDrop, className
  }
  return <View {...viewProps} />
}