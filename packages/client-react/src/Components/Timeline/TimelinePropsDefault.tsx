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
import { TimelineTrackAddControl } from '../Controls/EditorAddTrackButton'

import { TimelineProps } from './Timeline'
import { Panel, PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { TimelineTrackIcon } from './TimelineTrackIcon'
import { Button } from '../../Utilities'

export interface TimelinePropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {
  noApi?: boolean
}

export const DefaultTimelineProps: PropsMethod<TimelinePropsDefault, TimelineProps> = function(props) {
  const { noApi, ...options } = props

  const optionsStrict = panelOptionsStrict(options)
  optionsStrict.props.key ||= 'timeline'
  optionsStrict.props.className ||= 'panel timeline'

  optionsStrict.header.content ||= [DefaultIcons.timeline]

  optionsStrict.footer.content ||= [
    <TimelineTrackAddControl key='add-track'>
      <Button children={[DefaultIcons.add, DefaultIcons.trackDense]}/>
    </TimelineTrackAddControl>,
    DefaultIcons.zoomLess,
    <TimelineZoomer key='zoomer'/>,
    DefaultIcons.zoomMore,
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
