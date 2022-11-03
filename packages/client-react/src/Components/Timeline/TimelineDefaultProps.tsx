import React from 'react'

import {
  PropsMethod, PropsWithoutChild, WithClassName
} from '../../declarations'
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
import { Button } from '../../Utilities/Button'

export interface TimelinePropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}

export const TimelineDefaultProps: PropsMethod<TimelinePropsDefault, TimelineProps> = function(props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'timeline'
  optionsStrict.props.className ||= 'panel timeline'

  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.timeline} />,
  ]

  optionsStrict.footer.content ||= [
    <TimelineAddClipControl key='add-clip'>
      <Button children={icons.add}/>
    </TimelineAddClipControl>,
    <TimelineAddTrackControl key='add-track'>
      <Button children={[icons.add, icons.trackDense]}/>
    </TimelineAddTrackControl>,
    <TimelineZoom key="zoom-out" zoom={0}>
      <Button useView={true}>{icons.zoomLess}</Button>
    </TimelineZoom>,
    <TimelineZoomer key='zoomer'/>,
    <TimelineZoom key="zoom-in" zoom={1}>
      <Button useView={true}>{icons.zoomMore}</Button>
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
    <Bar {...optionsStrict.header} />
    <TimelineContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </TimelineContent>
    <Bar {...optionsStrict.footer} />
  </>

  return { ...optionsStrict.props, children }
}
