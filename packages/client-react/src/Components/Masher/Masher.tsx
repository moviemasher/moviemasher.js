import React from 'react'
import {
  editorInstance, UnknownObject,
  DataMashDefaultResponse,
  DataMashDefaultRequest,
  Size,
  EditType,
  DataCastDefaultResponse,
  eventStop,
  EditorIndex,
  DataPutResponse,
  Endpoints, fetchCallback, FileStoreResponse, ServerType,
  RenderingUploadRequest, RenderingUploadResponse, ApiCallback, 
  ApiCallbackResponse,
  DataDefinitionPutRequest, RenderingStatusResponse, OutputTypes, 
  assertObject, EventType, 
  idGenerate, ActivityType, Definition, assertPreloadableDefinition, assertPopulatedString, Defined
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { ApiContext } from '../../Contexts/ApiContext'
import { View } from '../../Utilities/View'
import { EditorContext, EditorContextInterface } from '../../Contexts/EditorContext'
import { elementSetPreviewSize } from '../../Utilities/Element'
import { TimelinePropsDefault } from '../Timeline/TimelinePropsDefault'
import { InspectorPropsDefault } from '../Inspector/InspectorPropsDefault'
import { PlayerPropsDefault } from '../Player/PlayerPropsDefault'
import { BrowserPropsDefault } from '../Browser/BrowserPropsDefault'
import { PanelOptions } from '../Panel/Panel'
import { ComposerPropsDefault } from '../Composer/ComposerPropsDefault'
import { Draggable, dropFilesFromList } from '../../Helpers/DragDrop'

export type PanelOptionsOrFalse = PanelOptions | false

export interface UiOptions {
  [index: string]: PanelOptionsOrFalse
  browser: BrowserPropsDefault | false
  player: PlayerPropsDefault | false
  inspector: InspectorPropsDefault | false
  timeline: TimelinePropsDefault | false
  composer: ComposerPropsDefault | false
}

export interface MasherOptions extends UnknownObject, WithClassName {
  previewSize?: Size
  editType?: EditType
}

interface EditorDefaultsArgs extends MasherOptions {
  noApi?: boolean
  panels?: Partial<UiOptions>
}
export interface EditorProps extends EditorDefaultsArgs, PropsWithoutChild {}

export interface MasherProps extends MasherOptions, PropsWithChildren {}
/**
 * @parents ApiClient, Masher
 * @children Browser, Timeline, Inspector, Player, Composer
 * @returns provided children wrapped in a {@link View} and {@link MasherContext}
 */
  
export function Masher(props: MasherProps): ReactResult {
  const {
    editType = EditType.Mash,
    previewSize,
    ...rest
  } = props

  const ref = React.useRef<HTMLDivElement>(null)
  const apiContext = React.useContext(ApiContext)
  const [editor] = React.useState(() => editorInstance({ editType }))
  const [requested, setRequested] = React.useState(false)
  const [draggable, setDraggable] = React.useState<Draggable | undefined>()

  const { enabled, endpointPromise, servers } = apiContext

  React.useEffect(() => {
    if (!requested && enabled.includes(ServerType.Data)) {
      setRequested(true)
      const request: DataMashDefaultRequest = {}
      // console.debug("DataDefaultRequest", Endpoints.data[editType].default, request)
      endpointPromise(Endpoints.data[editType].default, request).then((response: DataMashDefaultResponse | DataCastDefaultResponse) => {
        console.debug("DataDefaultResponse", Endpoints.data[editType].default, response)
        const { previewSize: serverSize, ...rest } = response
        elementSetPreviewSize(ref.current, serverSize)
        if (servers.file?.prefix) {
          editor.preloader.endpoint.prefix = String(servers.file.prefix)
        }
        editor.load(rest)
      })
    }
  }, [enabled])

  React.useEffect(() => { elementSetPreviewSize(ref.current, previewSize) }, [previewSize])

  const dropFiles = (files: FileList, editorIndex?: EditorIndex): Promise<Definition[]> => {
    const { file } = servers
    assertObject(file)
    
    const fileInfos = dropFilesFromList(files, file)
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
          eventTarget.emit(EventType.Activity, info)
        })
      }
      if (validFiles.length) return editor.addFiles(validFiles, editorIndex)
    }
    return Promise.resolve([])
  }
  
  const delayPromise = (): Promise<void> => (
    new Promise(resolve => { setTimeout(resolve, 2000) }) 
  )

  const handleApiCallback = (id: string, definition: Definition, callback: ApiCallback): Promise<void> => {
    console.debug("handleApiCallback request", callback)
    const { eventTarget, preloader } = editor
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
          const { id } = putRequest.definition
          assertPopulatedString(id)

          Defined.updateDefinitionId(definition.id, id)
          definition.id = id
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
          if (steps) eventTarget.emit(EventType.Activity, { 
            id, step, steps, type: ActivityType.Render 
          })
        }
        return delayPromise().then(() => handleApiCallback(id, definition, apiCallback))
      }
      eventTarget.emit(EventType.Activity, { id, type: ActivityType.Complete })
    })
  }

  const handleError = (endpoint: string, error: string, id: string) => {
    editor.eventTarget.emit(EventType.Activity, { 
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
      eventTarget.emit(EventType.Activity, { id, label, type: ActivityType.Render })

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
      const { editType } = editor
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

  const editorContext: EditorContextInterface = {
    editor, draggable, setDraggable, dropFiles, save
  }
  const viewProps = { ...rest, onDrop: eventStop, ref }
  return (
    <EditorContext.Provider value={editorContext}>
      <View { ...viewProps } />
    </EditorContext.Provider>
  )
}
