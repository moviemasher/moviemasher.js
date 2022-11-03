import React from "react"
import { 
  ClassSelected, DroppingPosition, eventStop, isLayerFolder, isObject
} from "@moviemasher/moviemasher.js"

import { 
  PropsWithChildren, ReactResult, WithClassName
} from "../../declarations"
import { 
  DragElementPoint, DragElementRect, DragSuffix, droppingPositionClass 
} from "../../Helpers/DragDrop"
import { View } from "../../Utilities/View"
import { ComposerContext } from "./ComposerContext"
import { MasherContext } from "../Masher/MasherContext"
import { LayerContext } from "../../Contexts/LayerContext"
import { useEditor } from "../../Hooks/useEditor"

export interface ComposerLayerProps extends PropsWithChildren, WithClassName { }

/**
 * @parents ComposerContent
 * @children ComposerLayerFolder, ComposerLayerMash, ComposerFolderClose, ComposerFolderOpen, ComposerDepth, ComposerLayerLabel
 */
export function ComposerLayer(props: ComposerLayerProps): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const editorContext = React.useContext(MasherContext)
  const composerContext = React.useContext(ComposerContext)
  const layerContext = React.useContext(LayerContext)

  const {
    validDragType, droppingPosition, setDroppingPosition, onDrop,
    droppingLayer, setDroppingLayer, onDragLeave
  } = composerContext

  const editor = useEditor()
  const { layer } = layerContext
  if (!layer) return null

  const { className: propsClassName = 'layer', ...rest} = props

  const onDragEnd = (event: DragEvent) => {
    const { dataTransfer } = event
    if (!dataTransfer) return

    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') editor.removeLayer(layer)
  }

  const onPointerDown = (event: Event) => {
    // console.log("ComposerLayer onPointerDown")
    event.stopPropagation()
    editor.selection.set(layer)
  }
  
  const onDragStart = (event: DragEvent) => {

    console.log("ComposerLayer onDragStart")
    const point = DragElementPoint(event, ref.current!)
    onPointerDown(event)
    const { dataTransfer } = event
    if (!isObject(dataTransfer)) return

    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(`layer${DragSuffix}`, JSON.stringify(point))
  }


  const currentDroppingPosition = (event: DragEvent): DroppingPosition => {
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

  const onDragOver = (event: DragEvent) => {
    const position = currentDroppingPosition(event)
    setDroppingPosition(position)
    setDroppingLayer(layer)
    eventStop(event)
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
    onPointerDown, onDragStart, onDragEnd,
    onDragLeave, onDragOver, onDrop,
    draggable: true,
  }
  return <View {...viewProps }/>
}
