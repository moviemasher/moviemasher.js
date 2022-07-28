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
import { EditType } from '@moviemasher/moviemasher.js'
import { ViewControl } from '../Controls/ViewControl'
import { Process } from '../Process/Process'
import { RenderControl } from '../Controls/RenderControl'
import { ProcessActive } from '../Process/ProcessActive'
import { ProcessStatus } from '../Process/ProcessStatus'
import { ProcessProgress } from '../Process/ProcessProgress'
import { Button } from '../../Utilities/Button'
import { View } from '../../Utilities/View'
import { DefaultIcons } from '@moviemasher/icons-default'

export const MasherPropsDefault: PropsMethod<EditorProps, MasherProps> = function(props) {
  const { noApi, panels, ...rest } = props
  const panelOptions = panels || {}
  panelOptions.player ||= {}
  panelOptions.browser ||= {}
  panelOptions.timeline ||= {}
  panelOptions.inspector ||= {}
  if (!noApi) {
    panelOptions.timeline.footer ||= {}
    panelOptions.timeline.footer.after ||= [
      <View key='render' className="progress">
        <Process key='render-process' id='rendering'>
          <ProcessActive>
            <ProcessStatus />
            <ProcessProgress />
          </ProcessActive>
          <RenderControl>{DefaultIcons.render}</RenderControl>
        </Process>
        <ViewControl key='view-control'>{DefaultIcons.view}</ViewControl>
      </View>
    ]
  }

  const playerProps = DefaultPlayerProps(panelOptions.player)
  const browserProps = DefaultBrowserProps(panelOptions.browser)
  const timelineProps = DefaultTimelineProps(panelOptions.timeline)
  const inspectorProps = DefaultInspectorProps(panelOptions.inspector)

  const children = <>
    <Player { ...playerProps } />
    <Browser { ...browserProps } />
    <Inspector { ...inspectorProps } />
    <Timeline { ...timelineProps } />
  </>

  return {
    className: 'editor masher', ...rest, editType: EditType.Mash, children
  }
}
