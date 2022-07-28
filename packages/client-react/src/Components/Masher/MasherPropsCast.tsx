import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod } from '../../declarations'
import { PanelHead } from '../Panel/PanelHead'
import { Panel } from '../Panel/Panel'
import { PanelFoot } from '../Panel/PanelFoot'
import { PanelContent } from '../Panel/PanelContent'
import { Panels } from '../Panel/Panels'
import { Composer } from '../Composer/Composer'
import { Button } from '../../Utilities/Button'
import { PanelCollapseControl } from '../Panel/PanelCollapseControl'
import { PanelCollapsed } from '../Panel/PanelCollapsed'
import { PanelNotCollapsed } from '../Panel/PanelNotCollapsed'
import { DefaultTimelineProps } from '../Timeline/TimelinePropsDefault'
import { Timeline } from '../Timeline/Timeline'
import { Inspector } from '../Inspector/Inspector'
import { DefaultInspectorProps } from '../Inspector/InspectorPropsDefault'
import { DefaultBrowserProps } from '../Browser/BrowserPropsDefault'
import { Browser } from '../Browser/Browser'
import { DefaultPlayerProps } from '../Player/PlayerPropsDefault'
import { Player } from '../Player/Player'
import { View } from '../../Utilities/View'
import { StreamersCreateControl } from '../Streamers/StreamersCreateControl'
import { EditorProps, MasherProps } from './Masher'
import { DefaultComposerProps } from '../Composer/ComposerPropsDefault'

import { EditType } from '@moviemasher/moviemasher.js'

const composerProps = DefaultComposerProps({ props: { className: "panel composer" } })
const timelineProps = DefaultTimelineProps({ props: { className: "panel timeline" } })
const inspectorProps = DefaultInspectorProps({ props: { className: "panel inspector" } })
const browserProps = DefaultBrowserProps({ props: { className: "panel browser" } })
const playerProps = DefaultPlayerProps({ props: { className: "panel player" } })

const children = <>
  <Player key="player" { ...playerProps } />
  <Composer key="composer" { ...composerProps }  />
  <Inspector key="inspector" { ...inspectorProps } />
  <Timeline key="timeline" { ...timelineProps } />
  <Panels key="panels" className='panels'>
    <Panel key="streamers" className='panel streamers'>
      <PanelHead key="head" className='head'>{DefaultIcons.streamers}</PanelHead>
      <PanelContent key="content" className='content'>CONTENT</PanelContent>
      <PanelFoot key="foot" className='foot'>
        <StreamersCreateControl>
          <Button>{DefaultIcons.add}</Button>
        </StreamersCreateControl>
      </PanelFoot>
    </Panel>
    <Panel key="chat" className='panel chat'>
      <PanelHead key="head" className='head'>
        {DefaultIcons.chat}
        <PanelCollapseControl key="collapse">
          <PanelCollapsed key="collapsed" children={DefaultIcons.collapsed}/>
          <PanelNotCollapsed key="not-collapsed" children={DefaultIcons.collapse}/>
        </PanelCollapseControl>
      </PanelHead>
      <PanelNotCollapsed key="not-collapsed">
        <PanelContent key="content" className='content'>
          <View>
            {DefaultIcons.message}
            Some chat
          </View>
        </PanelContent>
        <PanelFoot key="foot" className='foot'>
          {DefaultIcons.administrator}
          <input type='text'/>
        </PanelFoot>
      </PanelNotCollapsed>
    </Panel>
    <Browser key="browser" { ...browserProps } />
  </Panels>
</>

export const MasherPropsCast: PropsMethod<EditorProps, MasherProps> = function (editorProps) {
  const { noApi, panels, ...rest } = editorProps
  return {
    className: 'editor caster', ...rest, editType: EditType.Cast, children
  }
}
