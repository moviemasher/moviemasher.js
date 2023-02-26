import React from 'react'
import { VideoType } from '@moviemasher/moviemasher.js'
import { Icons } from '@moviemasher/theme-default'

import { PropsMethod } from '../../declarations'
import { EditorProps, MasherProps } from './Masher'
import { Browser } from '../Browser/Browser'
import { BrowserDefaultProps } from '../Browser/BrowserDefaultProps'
import { InspectorDefaultProps } from '../Inspector/InspectorDefaultProps'
import { PlayerDefaultProps } from '../Player/PlayerDefaultProps'
import { TimelineDefaultProps } from '../Timeline/TimelineDefaultProps'
import { Inspector } from '../Inspector/Inspector'
import { Player } from '../Player/Player'
import { Timeline } from '../Timeline/Timeline'
import { ActivityDefaultProps } from '../Activity/ActivityDefaultProps'
import { Activity } from '../Activity/Activity'
import { Panels } from '../Panel/Panels'

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
    masherChildren.push(<Player { ...PlayerDefaultProps(player) } />)
  }
  if (browser) {
    browser.icons ||= options.icons
    masherChildren.push(<Browser { ...BrowserDefaultProps(browser) } />)
  }
  if (inspector || activity) {
    const panelsChildren: JSX.Element[] = []
    if (activity) {
      activity.icons ||= options.icons
      panelsChildren.push(<Activity { ...ActivityDefaultProps(activity) } />)
    }   
    if (inspector) {  
      inspector.icons ||= options.icons
      panelsChildren.push(<Inspector { ...InspectorDefaultProps(inspector) } />)
    }
    const panelsProps = {
      children: panelsChildren, key: 'panels', className: 'panels'
    }
    masherChildren.push(<Panels { ...panelsProps } />)
  }
  if (timeline) {
    timeline.icons ||= options.icons
    masherChildren.push(<Timeline { ...TimelineDefaultProps(timeline) } />)
  }


  return {
    className: 'editor masher', 
    ...rest, 
    editType: VideoType, 
    children: masherChildren
  }
}
