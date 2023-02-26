import {

  assertObject, DataDefaultRequest, DataDefaultResponse, Editor, EditorIndex, 
  editorInstance, EditType, Endpoints, eventStop, EventType,
  idGenerate, idTemporary, isClip, isEffect, isMashAndMediaObject, isMedia, 
  isMediaObject, MashType, Media, MediaObject, ScalarRecord, Size, 
  UnknownRecord, urlBaseInitialize, VideoType
} from '@moviemasher/moviemasher.js'
import React from 'react'

import {
  ActivityType,
  Client, ClientDisabledArgs, clientInstance, ClientOptions, ClientReadOptions, ReadOperation
} from "@moviemasher/client-core"



import { Draggable, dropFilesFromList } from '@moviemasher/client-core'
import { ApiContext } from '../../../client-react-deleted/ApiClient/ApiContext'
import { PropsWithChildren, PropsWithoutChild, ReactResult, ThemeIcons, WithClassName } from '../../declarations'
import { elementSetPreviewSize } from '../../Utilities/Element'
import { View } from '../../Utilities/View'
import { ActivityPropsDefault } from '../Activity/ActivityDefaultProps'
import { BrowserPropsDefault } from '../Browser/BrowserDefaultProps'
import { InspectorPropsDefault } from '../Inspector/InspectorDefaultProps'
import { PanelOptions } from '../Panel/Panel'
import { PlayerPropsDefault } from '../Player/PlayerDefaultProps'
import { TimelinePropsDefault } from '../Timeline/TimelineDefaultProps'
import { MasherContext, MasherContextInterface } from './MasherContext'

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
  clientOptions?: ClientOptions
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
    clientOptions = ClientDisabledArgs,
    previewSize,
    icons = {},
    mashMedia,
    ...rest
  } = props

  console.log("Masher", editType, previewSize)
  const clientRef = React.useRef<Client>(clientInstance(clientOptions))
  const editorRef = React.useRef<Editor>(editorInstance({ editType }))
  const editorIndexRef = React.useRef<EditorIndex>({})
  const currentRef = React.useRef<ScalarRecord>({})
  const svgRef = React.useRef<SVGSVGElement>(null)
  const ref = React.useRef<HTMLDivElement>(null)


  const apiContext = React.useContext(ApiContext)

  const [requested, setRequested] = React.useState(false)
  const [streaming, setStreaming] = React.useState(false)

  const { current: client } = clientRef
  const { current: editor } = editorRef
  const { current: editorIndex } = editorIndexRef
  const { current } = currentRef
  const { endpointPromise, servers } = apiContext

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
    editor.load(mash)
  }
  React.useEffect(() => {
    console.debug("Masher useEffect", requested)

    if (!client.enabled(ReadOperation)) {
      editorLoad()
      return
    }
    if (!requested) {
      setRequested(true)

      const request: DataDefaultRequest = {}

      console.debug("DataDefaultRequest", Endpoints.data[editType].default, request)

      const promise = endpointPromise(Endpoints.data[editType].default, request)
      promise.then((response: DataDefaultResponse) => {
        console.debug("DataDefaultResponse", Endpoints.data[editType].default, response)
        const { previewSize: serverSize = previewSize } = response
        console.log("Masher DataDefaultResponse", servers.file?.prefix)
        if (servers.file?.prefix) {
          urlBaseInitialize(String(servers.file.prefix))
          console.log("Masher DataDefaultResponse", servers.file.prefix)
        }
        editorLoad(response)
      })
    }
  }, [requested])

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
  


  const changeDefinition = (media?: Media) => { current.mediaId = media?.id }
  
  const masherContext: MasherContextInterface = {
    client, editor, 
    streaming, setStreaming,
    current, editorIndex, drop,
    changeDefinition, icons
  }
  const viewProps = { ...rest, onDrop: eventStop, ref }
  return (
    <MasherContext.Provider value={masherContext}>
      <View { ...viewProps } />
      <svg style={{ display: 'none' }} ref={svgRef} />
    </MasherContext.Provider>
  )
}
