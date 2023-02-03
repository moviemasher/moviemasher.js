import React from "react"
import {
  assertCast,
  assertLayerMash,
  assertObject, DroppingPosition, EditorIndex, Endpoints, EventType, GraphFiles, isLayer, isPopulatedString, Layer, LayerAndPosition, MashAndDefinitionsObject, StreamingCutRequest, StreamingCutResponse, StreamingPreloadRequest, StreamingPreloadResponse, timeFromArgs
} from "@moviemasher/moviemasher.js"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { DragType, dragType, dragTypes, isDragType, TransferTypeFiles } from "../../Helpers/DragDrop"
import { useListeners } from "../../Hooks/useListeners"
import { ComposerContext, ComposerContextInterface } from "./ComposerContext"
import { MasherContext } from "../Masher/MasherContext"
import { View } from "../../Utilities/View"
import { useEditor } from "../../Hooks/useEditor"
import { useRefresh } from "../../Hooks/useRefresh"
import { ApiContext } from "../ApiClient/ApiContext"

export interface ComposerProps extends PropsWithChildren {}

/**
 * @parents Masher
 * @children ComposerContent
 */
export function Composer(props: ComposerProps): ReactResult {
  const editor = useEditor()
  const [refresh] = useRefresh()
  const masherContext = React.useContext(MasherContext)
  const apiContext = React.useContext(ApiContext)
  const [selectedLayer, setSelectedLayer] = React.useState<Layer | undefined>(undefined)
  const [droppingLayer, setDroppingLayer] = React.useState<Layer | undefined>(undefined)
  const [droppingPosition, setDroppingPosition] = React.useState<DroppingPosition | number>(DroppingPosition.None)
  
  const { drop, current, streaming } = masherContext
  const { endpointPromise } = apiContext

  const handleSelection = () => { setSelectedLayer(editor.selection.layer) }

  useListeners({
    [EventType.Selection]: handleSelection,
    [EventType.Cast]: refresh,
  })
  

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
    console.log("Composer.onDrop")
    event.preventDefault()
    setDroppingPosition(DroppingPosition.None)
    refresh()

    const { dataTransfer } = event
    assertObject(dataTransfer, 'dataTransfer')
    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) {
      const editorIndex: EditorIndex = {
        
      }
    console.log("Composer.onDrop FILES")
      drop(dataTransfer.files, editorIndex)
      return
    }


    const dragType = validDragType(dataTransfer)
    console.log("Composer.onDrop dragType=", dragType)
    if (!dragType) return
    
    const layerAndPosition: LayerAndPosition = {
      layer: droppingLayer, position: droppingPosition
    }
    const { layer: draggable } = editor.selection
    console.log("Composer.onDrop", layerAndPosition)
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


  const preload = () => {
    const { streamId: id} = current
    if (!isPopulatedString(id)) return
    const files: GraphFiles = []

    const request: StreamingPreloadRequest = { files, id  }
    // setStatus(`Preloading...`)
    console.debug("StreamingPreloadRequest", Endpoints.streaming.preload, request)
    endpointPromise(Endpoints.streaming.preload, request).then((response: StreamingPreloadResponse) => {
      console.debug("StreamingPreloadResponse", Endpoints.streaming.preload, response)
      // setStatus(`Preloaded`)
      // setPreloading(false)
    })
  }

  
  const update = () => {
    const { streamId: id} = current
    if (!isPopulatedString(id)) return
    
    const { edited, definitions } = editor
    assertCast(edited)

    const { mashes } = edited

    const definitionObjects = definitions.map(definition => definition.toJSON())
    const mashObjects = mashes.map(mash => mash.toJSON())
    const request: StreamingCutRequest = { definitionObjects, mashObjects, id }
    console.debug('StreamingCutRequest', Endpoints.streaming.cut, request)
    // setStatus(`Updating stream`)
    endpointPromise(Endpoints.streaming.cut, request).then((response:StreamingCutResponse) => {
      console.debug("StreamingCutResponse", Endpoints.streaming.cut, response)
      // setStatus(`Updated stream`)
      // setUpdating(false)
    })
  }
  
  const compose = (layer: Layer, frame: number, frames: number) => {
    assertLayerMash(layer)
    const { mash } = layer
    const { quantize } = mash
    if (streaming) {

    } else {
      console.log("Composer.compose SEEKING", layer.label, "FRAME", frame, "FRAMES", frames)
      const promise = mash.seekToTime(timeFromArgs(frame, quantize)) || Promise.resolve()

      promise.then(() => {
      console.log("Composer.compose SEEKED", layer.label, "FRAME", frame, "FRAMES", frames)

        mash.paused = !frames
      })
    }

  }
  const composerContext: ComposerContextInterface = {
    compose, refresh: refresh, selectedLayer, validDragType,
    droppingPosition, setDroppingPosition, onDrop,
    droppingLayer, setDroppingLayer, onDragLeave,
  }

  const contextProps = {
    children: <View { ...props } />,
    value: composerContext
  }
  return <ComposerContext.Provider { ...contextProps } />
}
