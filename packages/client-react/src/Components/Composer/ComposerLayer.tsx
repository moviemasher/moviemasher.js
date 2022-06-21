import { ClassSelected, DroppingPosition, isLayerFolder } from "@moviemasher/moviemasher.js"

import React from "react"
import { ComposerContext } from "../../Contexts/ComposerContext"
import { EditorContext } from "../../Contexts/EditorContext"
import { LayerContext } from "../../Contexts/LayerContext"
import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { DragElementPoint, DragElementRect, DragSuffix } from "../../Helpers/DragDrop"
import { View } from "../../Utilities/View"

export interface ComposerLayerProps extends PropsWithChildren, WithClassName { }

/**
 * @parents ComposerContent
 * @children ComposerLayerFolder, ComposerLayerMash, ComposerFolderClose, ComposerFolderOpen, ComposerDepth, ComposerLayerLabel
 */
export function ComposerLayer(props: ComposerLayerProps): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const editorContext = React.useContext(EditorContext)
  const composerContext = React.useContext(ComposerContext)
  const layerContext = React.useContext(LayerContext)

  const {
    validDragType, droppingPosition, setDroppingPosition, onDrop,
    droppingLayer, setDroppingLayer, onDragLeave
  } = composerContext
  const { editor, setDraggable, droppingPositionClass } = editorContext
  const { layer } = layerContext
  if (!(editor && layer)) return null

  const { className: propsClassName = 'layer', ...rest} = props

  const onClick: React.MouseEventHandler = event => {
    event.stopPropagation()
    editor.select(layer)
  }

  const onDragEnd: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const { dropEffect } = dataTransfer
    setDraggable()
    if (dropEffect === 'none') editor.removeLayer(layer)
  }

  const onDragStart: React.DragEventHandler = event => {
    const point = DragElementPoint(event, ref.current!)
    onMouseDown(event)
    const { dataTransfer } = event
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(`layer${DragSuffix}`, JSON.stringify(point))
    setDraggable(layer)
  }

  const onMouseDown: React.MouseEventHandler = event => {
    // event.preventDefault()
    event.stopPropagation()
    editor.select(layer)
  }

  const currentDroppingPosition = (event: React.DragEvent<Element>): DroppingPosition => {
    const { dataTransfer } = event
    const { current } = ref
    if (!(current && validDragType(dataTransfer))) return DroppingPosition.None

    const rect = DragElementRect(ref.current!)
    const point = DragElementPoint(event, rect)

    const quarterHeight = Math.ceil(rect.height / 4)
    const folder = isLayerFolder(layer)

    if (point.y < quarterHeight * (folder ? 1 : 2)) return DroppingPosition.Before

    if (!folder || (point.y > quarterHeight * 3)) return DroppingPosition.After

    return DroppingPosition.At
  }

  const onDragOver: React.DragEventHandler = event => {
    const position = currentDroppingPosition(event)
    setDroppingPosition(position)
    setDroppingLayer(layer)
    event.preventDefault()
    event.stopPropagation()
  }

  const calculatedClassName = (): string => {
    const selected = layer === editor.selection.layer
    const classes: string[] = [propsClassName]
    if (selected) classes.push(ClassSelected)
    if (droppingLayer === layer) {
      classes.push(droppingPositionClass(droppingPosition))
    }
    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingLayer, editor.selection.layer]
  )

  const viewProps = {
    ...rest, className, ref,
    onMouseDown, onDragStart, onDragEnd,
    onClick, onDragLeave, onDragOver, onDrop,
    draggable: true,
  }
  return <View {...viewProps }/>
}
