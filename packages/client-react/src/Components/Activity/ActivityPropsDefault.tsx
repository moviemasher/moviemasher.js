import React from 'react'
import { ClassButton, isUndefined } from '@moviemasher/moviemasher.js'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { ActivityContent } from './ActivityContent'
import { ActivityProps } from './Activity'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { ActivityGroup } from './ActivityContext'
import { ActivityPicker } from './ActivityPicker'
import { ActivityLabel } from './ActivityLabel'
import { PanelFoot } from '../Panel/PanelFoot'
import { CollapseControl } from '../Collapse/CollapseControl'
import { NotCollapsed } from '../Collapse/NotCollapsed'
import { Collapsed } from '../Collapse/Collapsed'
import { View } from '../../Utilities/View'
import { ActivityProgress } from './ActivityProgress'
import { ActivityPicked } from './ActivityPicked'
import { ActivityItem } from './ActivityItem'

export interface ActivityPropsDefault extends PanelOptions, PropsWithoutChild {}

export const ActivityPropsDefault: PropsMethod<ActivityPropsDefault, ActivityProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'activity'
  optionsStrict.props.className ||= 'panel activity'
  optionsStrict.props.initialPicked ||= ActivityGroup.Active
  if (isUndefined(optionsStrict.props.collapsed)) optionsStrict.props.collapsed = true
  
  optionsStrict.header.content ||= [
    icons.activity, 
    <NotCollapsed key="not-collapsed"><View key="view" /></NotCollapsed>,
    <Collapsed key="collapsed">
      <ActivityProgress key="progress" className='progress' />
    </Collapsed>,
    <CollapseControl key="collapse-control">
      <NotCollapsed key="not-collapsed" children={icons.collapse}/>
      <Collapsed key="collapsed" children={icons.collapsed}/>
    </CollapseControl>
  ]

  optionsStrict.content.children ||= <ActivityItem className='item' collapsed={true}>
    <CollapseControl key="collapse-control">
      <NotCollapsed key="not-collapsed" children={icons.collapse}/>
      <Collapsed key="collapsed" children={icons.collapsed}/>
    </CollapseControl>
    <ActivityLabel key="label" className="label" />
    <ActivityPicked key="active" id="active">
      <ActivityProgress key="progress" />
    </ActivityPicked>
    <ActivityPicked key="error" id="error" children={icons.error} />
    <ActivityPicked key="complete" id="complete" children={icons.complete} />
  </ActivityItem>
  
  optionsStrict.footer.content ||= [
    <ActivityPicker key='active' id='active' className={ClassButton} children={icons.active} />,
    <ActivityPicker key='error' id='error' className={ClassButton} children={icons.error} />,
    <ActivityPicker key='complete' id='complete' className={ClassButton} children={icons.complete} />,
  ]

  const children = <>
    <Bar {...optionsStrict.header} />
    <ActivityContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </ActivityContent>
    <PanelFoot {...optionsStrict.footer} />
  </>

  return { ...optionsStrict.props, children }
}
