

import /* type */ {
  Masher, MashIndex, Media, MediaArray, 
  ScalarRecord} from "@moviemasher/moviemasher.js"
import /* type */ { Client, Draggable } from "@moviemasher/client-core"


import /* type */ { MasherContextInterface } from './MasherContext'

import React from 'react'
import {
  eventStop, 
  VideoType
} from '@moviemasher/moviemasher.js'
import { ClientDisabledArgs, clientInstance, dropDraggable } from "@moviemasher/client-core"
import { elementSetPreviewSize } from '../../Utilities/Element'
import MasherContext from './MasherContext'
import { View } from '../../Utilities/View'
import { ClientContext } from "../../Contexts/ClientContext"
import { MasherAppProps } from "./MasherApp"

/**
 * {@codeblock ../../../../../workspaces/example-react/src/index.html}

* @parents ClientContext
* @children Browser, Timeline, Inspector, Player
* @returns provided children wrapped in a {@link View} and {@link MasherContext} followed by an SVG element
*/
export function MasherApp(props: MasherAppProps) {
  const {
    mashingType = VideoType,
    clientOptions = ClientDisabledArgs,
    previewSize,
    icons = {},
    mashMedia,
    ...rest
  } = props

  const clientContext = React.useContext(ClientContext)
  const clientInitialize = (): Client => {
    const { client } = clientContext
    if (client) return client

    return clientInstance(clientOptions)
  }

  console.log("MasherApp", mashingType, previewSize)
  const clientRef = React.useRef<Client>(clientInitialize())
  const { current: client } = clientRef

  const masherRef = React.useRef<Masher>(client.masher({mashingType}))
  const editorIndexRef = React.useRef<MashIndex>({})
  const currentRef = React.useRef<ScalarRecord>({})
  const ref = React.useRef<HTMLDivElement>(null)

  const { current: masher } = masherRef
  const { current: editorIndex } = editorIndexRef
  const { current } = currentRef

  React.useEffect(() => { 
    elementSetPreviewSize(ref.current, previewSize) 
  }, [previewSize])


  const changeDefinition = (media?: Media) => { current.mediaId = media?.id || '' }
  const drop = (draggable: Draggable, editorIndex?: MashIndex): Promise<MediaArray> => {
    return dropDraggable(masher, client, draggable, editorIndex)
  }
  const masherContext: MasherContextInterface = {
    masher, 
    current, editorIndex, drop,
    changeDefinition, icons
  }
  const viewProps = { ...rest, onDrop: eventStop, ref }
  const masherContextProps = { value: masherContext, children: <View { ...viewProps } /> }
  const masherElement = <MasherContext.Provider { ...masherContextProps } />
  
  if (clientContext.client) return masherElement

  const clientContextProps = { value: { client }, children: masherElement }
  return <ClientContext.Provider { ...clientContextProps } />
}

