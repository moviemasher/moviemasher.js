import React from 'react'
import {
  Endpoints,
  editorInstance, ServerType, UnknownObject,
  DataMashDefaultResponse,
  DataMashDefaultRequest,
  Dimensions,
  EditType,
  DataCastDefaultResponse,
  DroppingPosition,
  isUndefined,
  EventType,
  ClassDroppingBefore,
  ClassDroppingAfter,
  ClassDropping,
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
import { Draggable } from '../../Helpers'
import { useListeners } from '../../Hooks/useListeners'

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
  previewDimensions?: Dimensions
  editType?: EditType
}

interface EditorDefaultsArgs extends MasherOptions {
  noApi?: boolean
  panels?: Partial<UiOptions>
}
export interface EditorProps extends EditorDefaultsArgs, PropsWithoutChild { }

export interface MasherProps extends MasherOptions, PropsWithChildren {
}
/**
 * @parents ApiClient, Masher
 * @children Browser, Timeline, Inspector, Player, Composer
 * @returns provided children wrapped in a {@link View} and {@link MasherContext}
 */
export function Masher(props: MasherProps): ReactResult {
  const {
    editType = EditType.Mash,
    previewDimensions,
    ...rest
  } = props

  const ref = React.useRef<HTMLDivElement>(null)
  const apiContext = React.useContext(ApiContext)

  const [editor] = React.useState(() => editorInstance({ editType }))

  const currentFrame = () => { return editor.selection.mash?.frame || 0 }
  const currentFrames = () => { return editor.selection.mash?.frames || 0 }

  const [frames, setFrames] = React.useState(currentFrames)
  const [frame, setFrame] = React.useState(currentFrame)

  const [requested, setRequested] = React.useState(false)
  const [draggable, setDraggable] = React.useState<Draggable | undefined>()
  const { enabled, endpointPromise, servers } = apiContext

  const updateFrames = () => { setFrames(currentFrames()) }
  useListeners({
    [EventType.Time]: () => { setFrame(currentFrame()) },
    [EventType.Duration]: updateFrames,
    [EventType.Mash]: updateFrames,
  }, editor.eventTarget)

  React.useEffect(() => {
    if (!requested && enabled.includes(ServerType.Data)) {
      setRequested(true)
      const request: DataMashDefaultRequest = {}
      // console.debug("DataDefaultRequest", Endpoints.data[editType].default, request)
      endpointPromise(Endpoints.data[editType].default, request).then((response: DataMashDefaultResponse | DataCastDefaultResponse) => {
        console.debug("DataDefaultResponse", Endpoints.data[editType].default, response)
        const { previewDimensions: serverSize, ...rest } = response
        elementSetPreviewSize(ref.current, serverSize)
        if (servers.file?.prefix) {
          editor.preloader.endpoint.prefix = String(servers.file.prefix)
        }
        editor.load(rest)
      })
    }
  }, [enabled])

  React.useEffect(() => { elementSetPreviewSize(ref.current, previewDimensions) }, [previewDimensions])

  const droppingPositionClass = (droppingPosition?: DroppingPosition | number): string => {
    if (isUndefined(droppingPosition)) return ''

    switch (droppingPosition) {
      case DroppingPosition.After: return ClassDroppingAfter
      case DroppingPosition.Before: return ClassDroppingBefore
      case DroppingPosition.None: return ''
    }
    return ClassDropping
  }

  const editorContext: EditorContextInterface = {
    frames,
    frame,
    editor,
    draggable, setDraggable, droppingPositionClass
  }
  const viewProps = { ...rest, ref }
  return (
    <EditorContext.Provider value={editorContext}>
      <View { ...viewProps } />
    </EditorContext.Provider>
  )
}
