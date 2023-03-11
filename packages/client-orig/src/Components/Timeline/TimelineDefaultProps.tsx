import React from 'react'

import { WithClassName } from "../../Types/Core"
import { PropsMethod, PropsWithoutChild } from "../../Types/Props"
import { Bar } from '../../Utilities/Bar'
import { TimelineScrubberElement } from './TimelineScrubberElement'
import { TimelineTrack } from './TimelineTrack'
import { TimelineSizer } from './TimelineSizer'
import { TimelineZoomer } from './TimelineZoomer'
import { TimelineTracks } from './TimelineTracks'
import { TimelineScrubber } from './TimelineScrubber'
import { TimelineContent } from './TimelineContent'
import { TimelineAddTrackControl } from './TimelineAddTrackControl'

import { TimelineProps } from './Timeline'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { TimelineTrackIcon } from './TimelineTrackIcon'
import { TimelineZoom } from './TimelineZoom'
import { TimelineAddClipControl } from './TimelineAddClipControl'
import { ClipItem } from '../ClipItem/ClipItem'
import { View } from '../../Utilities/View'

export interface TimelinePropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}

export const TimelineDefaultProps: PropsMethod<TimelinePropsDefault, TimelineProps> = function(props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  // optionsStrict.props.key ||= 'timeline'
  optionsStrict.props.className ||= 'panel timeline'

  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.timeline} />,
  ]

  optionsStrict.footer.content ||= [
    <TimelineAddClipControl key='add-clip'>
      {icons.add}
    </TimelineAddClipControl>,
    <TimelineAddTrackControl key='add-track'>
      {icons.add}
      {icons.trackDense}
    </TimelineAddTrackControl>,
    <TimelineZoom key="zoom-out" zoom={0}>
      {icons.zoomLess}
    </TimelineZoom>,
    <TimelineZoomer key='zoomer'/>,
    <TimelineZoom key="zoom-in" zoom={1}>
     {icons.zoomMore}
    </TimelineZoom>,
  ]

  optionsStrict.content.children ||= <>
    <TimelineScrubber styleWidth={true} inactive={true} styleHeight={true} className='scrubber-bar'>
      <TimelineScrubberElement className='scrubber-element-bar' />
    </TimelineScrubber>
    <TimelineScrubber styleWidth={true} className='scrubber-icon'>
      <TimelineScrubberElement className='scrubber-element-icon'/>
    </TimelineScrubber>
    <TimelineTracks>
      <TimelineTrackIcon className='track-icon' icons={icons} />
      <TimelineTrack className='track'>
        <ClipItem className='clip preview' />
      </TimelineTrack>
    </TimelineTracks>
    <TimelineSizer className='drop-box' />
  </>
  
  const children = <>
    <Bar key='head' {...optionsStrict.header} />
    <TimelineContent key='content' {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </TimelineContent>
    <Bar key='foot' {...optionsStrict.footer} />
  </>

  return { 
    key: 'timeline',
    ...optionsStrict.props, children 
  }
}
