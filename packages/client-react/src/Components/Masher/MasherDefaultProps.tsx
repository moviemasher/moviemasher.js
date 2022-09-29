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
import { Icons } from '@moviemasher/theme-default'

export const MasherDefaultProps: PropsMethod<EditorProps, MasherProps> = function(options = {}) {
  options.className ||= 'editor masher'
  options.icons ||= Icons
  const { panels = {}, ...rest } = options
  const { 
    player = {}, 
    browser = {}, 
    timeline = {}, 
    inspector = {}, 
    activity = {},
  } = panels
  const masherChildren: JSX.Element[] = []

  if (player) {
    player.icons ||= options.icons
    masherChildren.push(<Player { ...DefaultPlayerProps(player) } />)
  }
  if (browser) {
    browser.icons ||= options.icons
    masherChildren.push(<Browser { ...BrowserPropsDefault(browser) } />)
  }
  if (inspector || activity) {
    const panelsChildren: JSX.Element[] = []
    if (inspector) {  
      inspector.icons ||= options.icons
      panelsChildren.push(<Inspector { ...InspectorPropsDefault(inspector) } />)
    }
    if (activity) {
      activity.icons ||= options.icons
      panelsChildren.push(<Activity { ...ActivityPropsDefault(activity) } />)
    }    
    const panelsProps = {
      children: panelsChildren, key: 'panels', className: 'panels'
    }
    masherChildren.push(<Panels { ...panelsProps } />)
  }
  if (timeline) {
    timeline.icons ||= options.icons
    masherChildren.push(<Timeline { ...DefaultTimelineProps(timeline) } />)
  }

  return {
    className: 'editor masher', 
    ...rest, 
    editType: EditType.Mash, 
    children: masherChildren
  }
}
