import React from "react"
import {
  DroppingPosition, EventType, isLayer, Layer, LayerAndPosition, MashAndDefinitionsObject
} from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult } from "../../declarations"
import { DragType, dragType, isDragType } from "../../Helpers/DragDrop"
import { useListeners } from "../../Hooks/useListeners"
import { ComposerContext, ComposerContextInterface } from "../../Contexts/ComposerContext"
import { EditorContext } from "../../Components/Masher/EditorContext"

export interface ComposerProps extends PropsAndChildren {}

/**
 * @parents Masher
 * @children ComposerContent
 */
export function Composer(props: ComposerProps): ReactResult {
  const editorContext = React.useContext(EditorContext)
  const [selectedLayer, setSelectedLayer] = React.useState<Layer | undefined>(undefined)
  const [droppingLayer, setDroppingLayer] = React.useState<Layer | undefined>(undefined)
  const [refreshed, setRefreshed] = React.useState(0)
  const [droppingPosition, setDroppingPosition] = React.useState<DroppingPosition | number>(DroppingPosition.None)
  const { editor, draggable } = editorContext
 

  const refresh = () => { setRefreshed(value => value + 1) }

  const handleSelection = () => { setSelectedLayer(editor!.selection.layer) }

  useListeners({
    [EventType.Selection]: handleSelection,
    [EventType.Cast]: refresh,
  })
 if (!editor) return null

  const validDragType = (dataTransfer: DataTransfer): DragType | undefined => {
    const type = dragType(dataTransfer)
    if (!isDragType(type)) return

    if ([DragType.Mash, DragType.Layer].includes(type)) return type
  }

  const onDragLeave = () => {
    setDroppingPosition(DroppingPosition.None)
    setDroppingLayer(undefined)
  }

  const onDrop: React.DragEventHandler = event => {
    event.preventDefault()
    setDroppingPosition(DroppingPosition.None)
    refresh()

    const { dataTransfer } = event
    const dragType = validDragType(dataTransfer)
    if (!dragType) return

    const layerAndPosition: LayerAndPosition = {
      layer: droppingLayer, position: droppingPosition
    }
    switch (dragType) {
      case DragType.Layer: {
        if (isLayer(draggable)) editor.moveLayer(draggable, layerAndPosition)
        break
      }
      case DragType.Mash: {
        const mashAndDefinitions: MashAndDefinitionsObject = {
          mashObject: {}, definitionObjects: []
        }
        editor.addMash(mashAndDefinitions, layerAndPosition)
        break
      }
    }
  }

  const composerContext: ComposerContextInterface = {
    refreshed, refresh, selectedLayer, validDragType,
    droppingPosition, setDroppingPosition, onDrop,
    droppingLayer, setDroppingLayer, onDragLeave,
  }


  return <ComposerContext.Provider value={composerContext} children={props.children} />
}
