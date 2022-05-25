import React from 'react'

import { PropsMethod } from '../../declarations'
import { EditorProps, MasherProps } from './Masher'
import { Browser } from '../Browser/Browser'
import { DefaultBrowserProps } from '../Browser/BrowserPropsDefault'
import { DefaultInspectorProps } from '../Inspector/InspectorPropsDefault'
import { DefaultPlayerProps } from '../Player/PlayerPropsDefault'
import { DefaultTimelineProps } from '../Timeline/TimelinePropsDefault'
import { Inspector } from '../Inspector/Inspector'
import { Player } from '../Player/Player'
import { Timeline } from '../Timeline/Timeline'
import { EditorContextDefault } from '../../Contexts/EditorContext'
import { EditType } from '@moviemasher/moviemasher.js'


export const MasherPropsDefault: PropsMethod<EditorProps, MasherProps> = function(props) {
  const { noApi, panels, ...rest } = props
  const panelOptions = panels || {}
  const children = <>
    <Player {...DefaultPlayerProps(panelOptions.player || {})} />
    <Browser {...DefaultBrowserProps(panelOptions.browser || {})} />
    <Inspector {...DefaultInspectorProps(panelOptions.inspector || {})} />
    <Timeline {...DefaultTimelineProps(panelOptions.timeline || {})} />
  </>
  const {
    disabledClass, selectedClass, droppingClass, droppingBeforeClass, droppingAfterClass
  } = EditorContextDefault
  return {
    className: 'editor masher',
    disabledClass, selectedClass, droppingClass, droppingBeforeClass, droppingAfterClass,
    ...rest, editType: EditType.Mash, children
  }
}
