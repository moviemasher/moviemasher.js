import React from 'react'
import { EditType } from '@moviemasher/moviemasher.js'

import { PropsMethod } from '../../declarations'
import { EditorProps, MasherProps } from './Masher'
import { Browser } from '../Browser/Browser'
import { BrowserPropsDefault } from '../Browser/BrowserPropsDefault'
import { InspectorPropsDefault } from '../Inspector/InspectorPropsDefault'
import { DefaultPlayerProps } from '../Player/PlayerPropsDefault'
import { DefaultTimelineProps } from '../Timeline/TimelinePropsDefault'
import { Inspector } from '../Inspector/Inspector'
import { Player } from '../Player/Player'
import { Timeline } from '../Timeline/Timeline'
import { ActivityPropsDefault } from '../Activity/ActivityPropsDefault'
import { Activity } from '../Activity/Activity'
import { Panels } from '../Panel/Panels'

export const MasherPropsDefault: PropsMethod<EditorProps, MasherProps> = function(props = {}) {
  const { panels, ...rest } = props
  const panelOptions = panels || {}
  panelOptions.player ||= {}
  panelOptions.browser ||= {}
  panelOptions.timeline ||= {}
  panelOptions.inspector ||= {}
  panelOptions.activity ||= {}

  const playerProps = DefaultPlayerProps(panelOptions.player)
  const browserProps = BrowserPropsDefault(panelOptions.browser)
  const timelineProps = DefaultTimelineProps(panelOptions.timeline)
  const inspectorProps = InspectorPropsDefault(panelOptions.inspector)
  const activityProps = ActivityPropsDefault(panelOptions.activity)

  const children = <>
    <Player { ...playerProps } />
    <Browser { ...browserProps } />
    <Panels key="panels" className='panels'>
      <Inspector { ...inspectorProps } />
      <Activity { ...activityProps } />
    </Panels>
    <Timeline { ...timelineProps } />
  </>

  return {
    className: 'editor masher', ...rest, editType: EditType.Mash, children
  }
}
