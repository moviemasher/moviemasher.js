import React from "react"
import {
  assertObject, DroppingPosition, EditorIndex, EventType, isLayer, Layer, LayerAndPosition, MashAndDefinitionsObject
} from "@moviemasher/moviemasher.js"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { DragType, dragType, dragTypes, isDragType, TransferTypeFiles } from "../../Helpers/DragDrop"
import { useListeners } from "../../Hooks/useListeners"
import { ComposerContext, ComposerContextInterface } from "./ComposerContext"
import { MasherContext } from "../Masher/MasherContext"
import { View } from "../../Utilities/View"

export interface ComposerProps extends PropsWithChildren {}

/**
 * @parents Masher
 * @children ComposerContent
 */
export function Composer(props: ComposerProps): ReactResult {
  const editorContext = React.useContext(MasherContext)
  const [selectedLayer, setSelectedLayer] = React.useState<Layer | undefined>(undefined)
  const [droppingLayer, setDroppingLayer] = React.useState<Layer | undefined>(undefined)
  const [refreshed, setRefreshed] = React.useState(0)
  const [droppingPosition, setDroppingPosition] = React.useState<DroppingPosition | number>(DroppingPosition.None)
  const { editor, draggable, drop } = editorContext
 

  const refresh = () => { setRefreshed(value => value + 1) }

  const handleSelection = () => { setSelectedLayer(editor!.selection.layer) }

  useListeners({
    [EventType.Selection]: handleSelection,
    [EventType.Cast]: refresh,
  })
 if (!editor) return null

  const validDragType = (dataTransfer?: DataTransfer | null): DragType | undefined => {
    if (!dataTransfer) return

    const type = dragType(dataTransfer)
    if (!isDragType(type)) return

    if ([DragType.Mash, DragType.Layer].includes(type)) return type
  }

  const onDragLeave = () => {
    setDroppingPosition(DroppingPosition.None)
    setDroppingLayer(undefined)
  }

  const onDrop = (event: DragEvent) => {
    // console.log("Composer.onDrop")
    event.preventDefault()
    setDroppingPosition(DroppingPosition.None)
    refresh()

    const { dataTransfer } = event
    assertObject(dataTransfer)
    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) {
      const editorIndex: EditorIndex = {
        
      }
      drop(dataTransfer.files, editorIndex)
      return
    }


    const dragType = validDragType(dataTransfer)
    if (!dragType) return

    // console.log("Composer.onDrop", dragType)
    
    
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
      default: {
        if (draggable) drop(draggable)
      }
    }
  }

  const composerContext: ComposerContextInterface = {
    refreshed, refresh, selectedLayer, validDragType,
    droppingPosition, setDroppingPosition, onDrop,
    droppingLayer, setDroppingLayer, onDragLeave,
  }

  const contextProps = {
    children: <View { ...props } />,
    value: composerContext
  }
  return <ComposerContext.Provider { ...contextProps } />
}
