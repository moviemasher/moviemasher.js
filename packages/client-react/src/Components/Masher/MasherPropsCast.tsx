import React from 'react'
import { EditType } from '@moviemasher/moviemasher.js'

import { PropsMethod } from '../../declarations'
import { Panels } from '../Panel/Panels'
import { Composer } from '../Composer/Composer'
import { DefaultTimelineProps } from '../Timeline/TimelinePropsDefault'
import { Timeline } from '../Timeline/Timeline'
import { Inspector } from '../Inspector/Inspector'
import { InspectorPropsDefault } from '../Inspector/InspectorPropsDefault'
import { BrowserPropsDefault } from '../Browser/BrowserPropsDefault'
import { Browser } from '../Browser/Browser'
import { DefaultPlayerProps } from '../Player/PlayerPropsDefault'
import { Player } from '../Player/Player'
import { EditorProps, MasherProps } from './Masher'
import { DefaultComposerProps } from '../Composer/ComposerPropsDefault'
import { Activity } from '../Activity/Activity'
import { ActivityPropsDefault } from '../Activity/ActivityPropsDefault'


export const MasherPropsCast: PropsMethod<EditorProps, MasherProps> = function (props = {}) {
  const { panels, ...rest } = props
  const panelOptions = panels || {}
  panelOptions.player ||= {}
  panelOptions.browser ||= {}
  panelOptions.timeline ||= {}
  panelOptions.inspector ||= {}
  panelOptions.composer ||= {}
  panelOptions.activity ||= {}

  const composerProps = DefaultComposerProps(panelOptions.composer)
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
  <Composer { ...composerProps }  />
  <Timeline { ...timelineProps } />
</>

  return {
    className: 'editor caster', ...rest, editType: EditType.Cast, children
  }
}
