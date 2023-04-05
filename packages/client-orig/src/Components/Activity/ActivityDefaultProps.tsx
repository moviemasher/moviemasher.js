import React from 'react'
import { ClassButton } from '@moviemasher/lib-core'

import { PropsMethod, PropsWithoutChild } from "../../Types/Props"
import { Bar } from '../../Utilities/Bar'
import { ActivityContent } from './ActivityContent.lite'
import { ActivityProps } from './Activity'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { ActivityGroup } from './ActivityContext'
import { ActivityPicker } from './ActivityPicker'
import { CollapseControl } from '../Collapse/CollapseControl'
import { NotCollapsed } from '../Collapse/NotCollapsed'
import { Collapsed } from '../Collapse/Collapsed'
import { View } from '../../Utilities/View'
import { ActivityProgress } from './ActivityProgress'

export interface ActivityPropsDefault extends PanelOptions, PropsWithoutChild {}

export const ActivityDefaultProps: PropsMethod<ActivityPropsDefault, ActivityProps> = (props = {}) => {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.className ||= 'panel activity'
  // optionsStrict.props.key ||= 'activity'
  // optionsStrict.props.initialPicked ||= ActivityGroup.Active
  // if (isUndefined(optionsStrict.props.initialCollapsed)) {
  //   optionsStrict.props.initialCollapsed = true
  // }
  
  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.activity} />,
  
    <NotCollapsed key="not-collapsed"><View key="view" /></NotCollapsed>,
    <Collapsed key="collapsed">
      <ActivityProgress key="progress" className='progress' />
    </Collapsed>,
    <CollapseControl key="collapse-control">
      <NotCollapsed key="not-collapsed" children={icons.collapse}/>
      <Collapsed key="collapsed" children={icons.collapsed}/>
    </CollapseControl>
  ]

  
  optionsStrict.footer.content ||= [
    <ActivityPicker key='active' id='active' className={ClassButton} children={icons.active} />,
    <ActivityPicker key='error' id='error' className={ClassButton} children={icons.error} />,
    <ActivityPicker key='complete' id='complete' className={ClassButton} children={icons.complete} />,
  ]

  const children = <>
    <Bar key='head' {...optionsStrict.header} />
    <ActivityContent key='content' {...optionsStrict.content.props} />
    <Bar key='foot' {...optionsStrict.footer} />
  </>

  return { 
    initialPicked: ActivityGroup.Active,
    initialCollapsed: true,
    key: 'activity',
    ...optionsStrict.props, 
    children, 
  }
}
