import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import {
  PropsMethod, PropsWithoutChild, WithClassName
} from '../../declarations'
import { View } from '../../Utilities/View'
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
import { Panel, PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { TimelineTrackIcon } from './TimelineTrackIcon'
import { Button } from '../../Utilities'
import { TimelineZoom } from './TimelineZoom'
import { TimelineAddClipControl } from './TimelineAddClipControl'

export interface TimelinePropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}

export const DefaultTimelineProps: PropsMethod<TimelinePropsDefault, TimelineProps> = function(props) {
  const optionsStrict = panelOptionsStrict(props)
  optionsStrict.props.key ||= 'timeline'
  optionsStrict.props.className ||= 'panel timeline'

  optionsStrict.header.content ||= [DefaultIcons.timeline]

  optionsStrict.footer.content ||= [
    <TimelineAddClipControl key='add-clip'>
      <Button children={DefaultIcons.add}/>
    </TimelineAddClipControl>,
    <TimelineAddTrackControl key='add-track'>
      <Button children={[DefaultIcons.add, DefaultIcons.trackDense]}/>
    </TimelineAddTrackControl>,
    <TimelineZoom key="zoom-out" zoom={0}>
      <Button useView={true}>{DefaultIcons.zoomLess}</Button>
    </TimelineZoom>,
    <TimelineZoomer key='zoomer'/>,
    <TimelineZoom key="zoom-in" zoom={1}>
      <Button useView={true}>{DefaultIcons.zoomMore}</Button>
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
      <TimelineTrackIcon className='track-icon' icons={DefaultIcons} />
      <TimelineTrack
        className='track'
        label='--clip-label'
        icon='--clip-icon'
      >
        <View className='clip'>
          <label />
        </View>
      </TimelineTrack>
    </TimelineTracks>
    <TimelineSizer className='timeline-sizer' />
  </>

  const children = <Panel {...optionsStrict.props}>
    <Bar {...optionsStrict.header} />
    <TimelineContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </TimelineContent>
    <Bar {...optionsStrict.footer} />
  </Panel>
  return { children }
}
