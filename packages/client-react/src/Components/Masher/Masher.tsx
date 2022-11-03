import React from 'react'
import {
  editorInstance, UnknownObject,
  DataDefaultRequest,
  Size,
  EditType,
  DataDefaultResponse,
  eventStop,
  EditorIndex,
  DataPutResponse,
  Endpoints, fetchCallback, FileStoreResponse, ServerType,
  RenderingUploadRequest, RenderingUploadResponse, ApiCallback, 
  ApiCallbackResponse,
  DataDefinitionPutRequest, RenderingStatusResponse, OutputTypes, 
  assertObject, EventType, isMashAndDefinitionsObject,
  idGenerate, ActivityType, Definition, assertPreloadableDefinition, 
  isDefinitionObject, isClip, isEffect, isLayer, DefinitionObject, isDefinition, 
  sizeAboveZero,
  ScalarObject
} from '@moviemasher/moviemasher.js'

import type { ThemeIcons } from '@moviemasher/theme-default'


import { PropsWithChildren, PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { ApiContext } from '../ApiClient/ApiContext'
import { View } from '../../Utilities/View'
import { MasherContext, MasherContextInterface } from './MasherContext'
import { elementSetPreviewSize } from '../../Utilities/Element'
import { TimelinePropsDefault } from '../Timeline/TimelineDefaultProps'
import { InspectorPropsDefault } from '../Inspector/InspectorDefaultProps'
import { BroadcasterPropsDefault } from '../Broadcaster/BroadcasterDefaultProps'
import { PlayerPropsDefault } from '../Player/PlayerDefaultProps'
import { BrowserPropsDefault } from '../Browser/BrowserDefaultProps'
import { PanelOptions } from '../Panel/Panel'
import { ComposerPropsDefault } from '../Composer/ComposerDefaultProps'
import { Draggable, dropFilesFromList } from '../../Helpers/DragDrop'
import { ActivityPropsDefault } from '../Activity/ActivityDefaultProps'

export type PanelOptionsOrFalse = PanelOptions | false

export interface UiOptions {
  [index: string]: PanelOptionsOrFalse
  browser: BrowserPropsDefault | false
  player: PlayerPropsDefault | false
  inspector: InspectorPropsDefault | false
  timeline: TimelinePropsDefault | false
  composer: ComposerPropsDefault | false
  broadcaster: BroadcasterPropsDefault | false
  activity: ActivityPropsDefault | false
}

export interface MasherOptions extends UnknownObject, WithClassName {
  previewSize?: Size
  icons?: ThemeIcons
  editType?: EditType
  edited?: DataDefaultResponse
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
  console.log("Masher")
  const {
    editType = EditType.Mash,
    previewSize,
    icons = {},
    edited,
    ...rest
  } = props

  const editorIndexRef = React.useRef<EditorIndex>({})
  const currentRef = React.useRef<ScalarObject>({})
  const svgRef = React.useRef<SVGSVGElement>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  const apiContext = React.useContext(ApiContext)
  const [editor] = React.useState(() => editorInstance({ editType}))
  const [requested, setRequested] = React.useState(false)
  const [streaming, setStreaming] = React.useState(false)

  const { current: editorIndex } = editorIndexRef
  const { current } = currentRef
  const { enabled, endpointPromise, servers } = apiContext

  React.useEffect(() => { 
    elementSetPreviewSize(ref.current, previewSize) 
  }, [previewSize])

  const editorLoad = (object?: DataDefaultResponse) => {
    const loadObject = object || edited || { [editType]: {}, definitions: [] }
    const { previewSize: size = previewSize, ...rest } = loadObject

    const { current: svg } = svgRef
    const { current: div } = ref
    assertObject(svg)
    if (sizeAboveZero(size)) elementSetPreviewSize(div, size)
    
    editor.svgElement = svg
    editor.load(rest)
  }
  React.useEffect(() => {
    if (!enabled) {
      editorLoad()
      return
    }
    if (!requested && servers[ServerType.Data]) {
      setRequested(true)
      const request: DataDefaultRequest = {}
      const promise = endpointPromise(Endpoints.data[editType].default, request)
      promise.then((response: DataDefaultResponse) => {
        console.debug("DataDefaultResponse", Endpoints.data[editType].default, response)
        const { previewSize: serverSize = previewSize, ...rest } = response
        if (servers.file?.prefix) {
          editor.preloader.endpoint.prefix = String(servers.file.prefix)
        }
        editorLoad(response)
      })
    }
  }, [servers])

  const dropFiles = (files: FileList, editorIndex?: EditorIndex): Promise<Definition[]> => {
    const fileInfos = dropFilesFromList(files, servers.file)
    if (fileInfos.length) {
      const errors: UnknownObject[] = []
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
    }
    return Promise.resolve([])
  }

  const dropDefinitionObject = (definitionObject: DefinitionObject, editorIndex?: EditorIndex): Promise<Definition[]>  => {
    // console.log("Masher onDrop DefinitionObject...", definitionObject, editorIndex)
    return editor.add(definitionObject, editorIndex)
  }

  const drop = (draggable: Draggable, editorIndex?: EditorIndex): Promise<Definition[]>  => {
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
    if (isLayer(draggable)) {
      console.log("Masher drop Layer")
      return Promise.resolve([])
    }
    if (isDefinitionObject(draggable)) {
      console.log("Masher drop DefinitionObject")
      return dropDefinitionObject(draggable, editorIndex)
      
    }
    if (isMashAndDefinitionsObject(draggable)) {
      console.log("Masher drop MashAndDefinitionsObject")
      return Promise.resolve([])
    }
    return dropFiles(draggable, editorIndex).then(definitions => {
      console.log("Masher.dropFiles", definitions)
      const [definition] = definitions
      if (isDefinition(definition)) changeDefinition(definition)
      return definitions
    })
  }
  
  const delayPromise = (): Promise<void> => (
    new Promise(resolve => { setTimeout(resolve, 2000) }) 
  )

  const handleApiCallback = (id: string, definition: Definition, callback: ApiCallback): Promise<void> => {
    console.debug("handleApiCallback request", callback)
    const { eventTarget } = editor
    return fetchCallback(callback).then((response: ApiCallbackResponse) => {
      console.debug("handleApiCallback response", response)
      const { apiCallback, error } = response
      if (error) return handleError(callback.endpoint.prefix!, error, id)

      if (apiCallback) {
        const { request, endpoint } = apiCallback
        if (endpoint.prefix === Endpoints.data.definition.put) {
          assertObject(request)

          const { body } = request
          assertObject(body)

          const putRequest: DataDefinitionPutRequest = body
          const { definition: definitionObject } = putRequest
          // console.debug("handleApiCallback calling updateDefinition", definitionObject)

          editor.updateDefinition(definitionObject, definition)
        }
        if (callback.endpoint.prefix === Endpoints.rendering.status) {
          const statusResponse: RenderingStatusResponse = response
          let steps = 0
          let step = 0
          OutputTypes.forEach(type => {
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

  const saveDefinitionsPromise = (definitions: Definition[]): Promise<void> => {
    let promise = Promise.resolve()
    const { eventTarget } = editor

    definitions.forEach(definition => {
      assertPreloadableDefinition(definition)
      const { label, type, source } = definition

      const id = idGenerate('activity')
      eventTarget.emit(EventType.Active, { id, label, type: ActivityType.Render })

      const { rendering } = Endpoints
      const responsePromise = fetch(source)
      const blobPromise = responsePromise.then(response => response.blob())
      const filePromise = blobPromise.then(blob => new File([blob], label))
      const callbackPromise = filePromise.then(file => {
        const request: RenderingUploadRequest = { type, name: label, size: file.size }
        console.debug("RenderingUploadRequest", rendering.upload, request)
        const responsePromise = endpointPromise(rendering.upload, request)
        return responsePromise.then((response: RenderingUploadResponse) => {
          console.debug("RenderingUploadResponse", rendering.upload, response)
          const { error, fileApiCallback, apiCallback, fileProperty } = response
          if (error) return handleError(rendering.upload, error, id)

          else if (fileApiCallback && fileApiCallback.request) {
            if (fileProperty) fileApiCallback.request.body![fileProperty] = file
            else fileApiCallback.request.body = file
            return fetchCallback(fileApiCallback).then((response: FileStoreResponse) => {
              console.debug("FileStoreResponse", response)
              const { error } = response
              if (error) return handleError(fileApiCallback.endpoint.prefix!, error, id)
    
              assertObject(apiCallback)
              return handleApiCallback(id, definition, apiCallback)
            })
          } 
          assertObject(apiCallback)
          return handleApiCallback(id, definition, apiCallback)
        })
      })
      promise = promise.then(() => callbackPromise)
    })
    return promise
  }

  const save = async () => {
    const { definitionsUnsaved } = editor
    const definitionsPromise = saveDefinitionsPromise(definitionsUnsaved)
    const requestPromise = definitionsPromise.then(() => editor.dataPutRequest())
    const savePromise = requestPromise.then(request => {
      // const { editType } = editor
      console.debug("DataPutRequest", Endpoints.data[editType].put, JSON.parse(JSON.stringify(request)))
      endpointPromise(Endpoints.data[editType].put, request).then((response: DataPutResponse) => {
        console.debug("DataPutResponse", Endpoints.data[editType].put, response)
        const { error, temporaryIdLookup } = response
        if (error) console.error(Endpoints.data[editType].put, error)
        else editor.saved(temporaryIdLookup)
      })
    })
    await savePromise
  }

  const changeDefinition = (definition?: Definition) => { 
    current.definitionId = definition?.id
  }

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
