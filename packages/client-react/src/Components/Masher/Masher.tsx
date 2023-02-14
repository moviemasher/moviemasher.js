import React from 'react'
import {
  editorInstance, UnknownRecord,
  DataDefaultRequest,
  Size,
  EditType,
  DataDefaultResponse,
  eventStop,
  EditorIndex,
  Endpoints, ServerType,
  ApiCallback, 
  ApiCallbackResponse,
  DataDefinitionPutRequest, RenderingStatusResponse, EncodeTypes, 
  assertObject, EventType, 
  idGenerate, ActivityType, 
  isClip, isEffect, 
  ScalarRecord, urlBaseInitialize, isMediaObject, MediaObject, Media, isMedia, MediaArray, isMashAndMediaObject, VideoType, idTemporary, assertMashMedia
} from '@moviemasher/moviemasher.js'

import type { ThemeIcons } from '@moviemasher/theme-default'


import { PropsWithChildren, PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { ApiContext } from '../ApiClient/ApiContext'
import { View } from '../../Utilities/View'
import { MasherContext, MasherContextInterface } from './MasherContext'
import { elementSetPreviewSize } from '../../Utilities/Element'
import { TimelinePropsDefault } from '../Timeline/TimelineDefaultProps'
import { InspectorPropsDefault } from '../Inspector/InspectorDefaultProps'
import { PlayerPropsDefault } from '../Player/PlayerDefaultProps'
import { BrowserPropsDefault } from '../Browser/BrowserDefaultProps'
import { PanelOptions } from '../Panel/Panel'
import { Draggable, dropFilesFromList, jsonPromise } from '@moviemasher/client-core'
import { ActivityPropsDefault } from '../Activity/ActivityDefaultProps'
import { useClient } from '../../Hooks/useClient'

export type PanelOptionsOrFalse = PanelOptions | false

export interface UiOptions {
  [index: string]: PanelOptionsOrFalse
  browser: BrowserPropsDefault | false
  player: PlayerPropsDefault | false
  inspector: InspectorPropsDefault | false
  timeline: TimelinePropsDefault | false
  activity: ActivityPropsDefault | false
}

export interface MasherOptions extends UnknownRecord, WithClassName {
  previewSize?: Size
  icons?: ThemeIcons
  editType?: EditType
  mashMedia?: DataDefaultResponse
}

export interface EditorProps extends MasherOptions, PropsWithoutChild {
  panels?: Partial<UiOptions>
}

export interface MasherProps extends MasherOptions, PropsWithChildren {}

/**
 * @parents ApiClient, Masher
 * @children Browser, Timeline, Inspector, Player, Composer
 * @returns provided children wrapped in a {@link View} and {@link MasherContext}
 */
export function Masher(props: MasherProps): ReactResult {
  const {
    editType = VideoType,
    previewSize,
    icons = {},
    mashMedia,
    ...rest
  } = props

  console.log("Masher", editType, previewSize)
  const editorIndexRef = React.useRef<EditorIndex>({})
  const currentRef = React.useRef<ScalarRecord>({})
  const svgRef = React.useRef<SVGSVGElement>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  const apiContext = React.useContext(ApiContext)
  const [editor] = React.useState(() => editorInstance({ editType }))
  const [requested, setRequested] = React.useState(false)
  const [streaming, setStreaming] = React.useState(false)

  const { current: editorIndex } = editorIndexRef
  const { current } = currentRef
  const { enabled, endpointPromise, servers } = apiContext

  React.useEffect(() => { 
    elementSetPreviewSize(ref.current, previewSize) 
  }, [previewSize])

  const editorLoad = (object?: DataDefaultResponse) => {
    const loadObject = object || mashMedia || { mash: { id: idTemporary(), media: [] } }
    // const { previewSize: size = previewSize, ...rest } = loadObject
    console.log('Masher.editorLoad', object, mashMedia, loadObject)

    const { current: svg } = svgRef
    // const { current: div } = ref
    assertObject(svg, 'svg')
    // if (sizeAboveZero(size)) elementSetPreviewSize(div, size)
    
    editor.svgElement = svg
    const { mash } = loadObject
    // assertMashData(loadObject)
    editor.load(mash)
  }
  React.useEffect(() => {
    console.debug("Masher useEffect", enabled, requested)

    if (!enabled) {
      editorLoad()
      return
    }
    if (!requested && servers[ServerType.Data]) {
      setRequested(true)
      const request: DataDefaultRequest = {}

      console.debug("DataDefaultRequest", Endpoints.data[editType].default, request)

      const promise = endpointPromise(Endpoints.data[editType].default, request)
      promise.then((response: DataDefaultResponse) => {
        console.debug("DataDefaultResponse", Endpoints.data[editType].default, response)
        const { previewSize: serverSize = previewSize, ...rest } = response
        console.log("Masher DataDefaultResponse", servers.file?.prefix)
        if (servers.file?.prefix) {
          urlBaseInitialize(String(servers.file.prefix))
          console.log("Masher DataDefaultResponse", servers.file.prefix)
        }
        editorLoad(response)
      })
    }
  }, [servers, enabled, requested])

  const dropFiles = (files: FileList, editorIndex?: EditorIndex): Promise<Media[]> => {
    const fileInfos = dropFilesFromList(files, servers.file)
    if (fileInfos.length) {
      const errors: UnknownRecord[] = []
      const validFiles: File[] = []
      const { eventTarget } = editor
      fileInfos.forEach(fileInfo => {
        if (fileInfo instanceof File) validFiles.push(fileInfo)
        else errors.push(fileInfo)
      })

      if (errors.length) {
        errors.forEach(error => {
          const id = idGenerate('activity-error')
          const info = { id, type: ActivityType.Error, ...error }
          eventTarget.emit(EventType.Active, info)
        })
      }
      if (validFiles.length) return editor.addFiles(validFiles, editorIndex)
    } else console.log('Masher.dropFiles no info')
    return Promise.resolve([])
  }

  const dropMediaObject = (definitionObject: MediaObject, editorIndex?: EditorIndex): Promise<Media[]>  => {
    // console.log("Masher onDrop DefinitionObject...", definitionObject, editorIndex)
    return editor.addMedia(definitionObject, editorIndex)
  }

  const drop = (draggable: Draggable, editorIndex?: EditorIndex): Promise<Media[]>  => {
    console.log("Masher drop", draggable, editorIndex)

    
    if (!draggable) return Promise.resolve([]) 
    console.log("Masher drop editorIndex = ", editorIndex)

    if (isClip(draggable)) {
      console.log("Masher drop Clip")
      return Promise.resolve([])
    }
    if (isEffect(draggable)) {
      console.log("Masher drop Effect")
      return Promise.resolve([])
    }
    
    if (isMediaObject(draggable)) {
      console.log("Masher drop DefinitionObject")
      return dropMediaObject(draggable, editorIndex)
      
    }
    if (isMashAndMediaObject(draggable)) {
      console.log("Masher drop MashAndMediaObject")
      return Promise.resolve([])
    }
    return dropFiles(draggable, editorIndex).then(definitions => {
      console.log("Masher.dropFiles", definitions)
      const [definition] = definitions
      if (isMedia(definition)) changeDefinition(definition)
      return definitions
    })
  }
  
  const delayPromise = (): Promise<void> => (
    new Promise(resolve => { setTimeout(resolve, 2000) }) 
  )

  const handleApiCallback = (id: string, definition: Media, callback: ApiCallback): Promise<void> => {
    console.debug("handleApiCallback request", callback)
    const { eventTarget } = editor
    return jsonPromise(callback).then((response: ApiCallbackResponse) => {
      console.debug("handleApiCallback response", response)
      const { apiCallback, error } = response
      if (error) return handleError(callback.endpoint.pathname!, error.message, id)

      if (apiCallback) {
        const { init, endpoint } = apiCallback
        if (endpoint.pathname === Endpoints.data.definition.put) {
          assertObject(init, 'init')

          const { body } = init
          assertObject(body, 'body')

          const putRequest: DataDefinitionPutRequest = body
          const { definition: definitionObject } = putRequest
          console.debug("handleApiCallback calling updateDefinition", definitionObject)

          editor.updateDefinition(definitionObject, definition)
          console.debug("handleApiCallback called updateDefinition")
        }
        if (callback.endpoint.pathname === Endpoints.rendering.status) {
          const statusResponse: RenderingStatusResponse = response
          let steps = 0
          let step = 0
          EncodeTypes.forEach(type => {
            const state = statusResponse[type]
            if (!state) return

            steps += state.total
            step += state.completed
          })
          if (steps) eventTarget.emit(EventType.Active, { 
            id, step, steps, type: ActivityType.Render 
          })
        }
        
        return delayPromise().then(() => handleApiCallback(id, definition, apiCallback))
      }
      eventTarget.emit(EventType.Active, { id, type: ActivityType.Complete })
    })
  }

  const handleError = (endpoint: string, error: string, id: string) => {
    editor.eventTarget.emit(EventType.Active, { 
      id, type: ActivityType.Error, error: 'import.render', value: error 
    })
    console.error(endpoint, error)
    return Promise.reject(error)
  }

  const saveDefinitionsPromise = (definitions: MediaArray): Promise<void> => {
    let promise = Promise.resolve()
    const { eventTarget } = editor
throw new Error('')
    // definitions.forEach(definition => {
    //   assertContentDefinition(definition)
    //   const { label, type, source } = definition

    //   const id = idGenerate('activity')
    //   eventTarget.emit(EventType.Active, { id, label, type: ActivityType.Render })

    //   const { rendering } = Endpoints
    //   console.log("Masher fetch", source)
    //   const responsePromise = fetch(source)
    //   const blobPromise = responsePromise.then(response => response.blob())
    //   const filePromise = blobPromise.then(blob => new File([blob], label))
    //   const resultPromise = filePromise.then(file => {
    //     const request: RenderingUploadRequest = { type, name: label, size: file.size }
    //     console.debug("RenderingUploadRequest", rendering.upload, request)
    //     const responsePromise = endpointPromise(rendering.upload, request)
    //     return responsePromise.then((response: RenderingUploadResponse) => {
    //       console.debug("RenderingUploadResponse", rendering.upload, response)
    //       const { error, fileApiCallback, apiCallback, fileProperty } = response
    //       if (error) return handleError(rendering.upload, error, id)

    //       else if (fileApiCallback && fileApiCallback.init) {
    //         if (fileProperty) fileApiCallback.init.body![fileProperty] = file
    //         else fileApiCallback.init.body = file
    //         return jsonPromise(fileApiCallback).then((response: FileStoreResponse) => {
    //           console.debug("FileStoreResponse", response)
    //           const { error } = response
    //           if (error) return handleError(fileApiCallback.endpoint.pathname!, error, id)
    
    //           assertObject(apiCallback, 'apiCallback')
    //           return handleApiCallback(id, definition, apiCallback)
    //         })
    //       } 
    //       assertObject(apiCallback, 'apiCallback')
    //       return handleApiCallback(id, definition, apiCallback)
    //     })
    //   })
    //   promise = promise.then(() => resultPromise)
    // })
    return promise
  }

  const client = useClient()
  const save = () => {
    const { mashMedia } = editor
    assertMashMedia(mashMedia)
    client.save(mashMedia)
  }

  const changeDefinition = (media?: Media) => { current.mediaId = media?.id }

  const editorContext: MasherContextInterface = {
    streaming, setStreaming,
    current, editor, save, editorIndex, drop,
    changeDefinition, icons
  }
  const viewProps = { ...rest, onDrop: eventStop, ref }
  return (
    <MasherContext.Provider value={editorContext}>
      <View { ...viewProps } />
      <svg style={{ display: 'none' }} ref={svgRef} />
    </MasherContext.Provider>
  )
}
