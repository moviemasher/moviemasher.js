import React from 'react'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { BroadcasterContent } from './BroadcasterContent'
import { BroadcasterProps } from './Broadcaster'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { NotCollapsed } from '../Collapse/NotCollapsed'
import { Collapsed } from '../Collapse/Collapsed'
import { CollapseControl } from '../Collapse/CollapseControl'
import { View } from '../../Utilities/View'

export interface BroadcasterPropsDefault extends PanelOptions, PropsWithoutChild {}

export const BroadcasterDefaultProps: PropsMethod<BroadcasterPropsDefault, BroadcasterProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'broadcaster'
  optionsStrict.props.className ||= 'panel broadcaster'

  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.broadcaster} />,
    <NotCollapsed key="not-collapsed"><View key="view" /></NotCollapsed>,
    <Collapsed key="collapsed">
      <label>collapsed...</label>
    </Collapsed>,
    <CollapseControl key="collapse-control">
      <NotCollapsed key="not-collapsed" children={icons.collapse}/>
      <Collapsed key="collapsed" children={icons.collapsed}/>
    </CollapseControl>
  ]

  optionsStrict.footer.content ||= []
  optionsStrict.footer.before ||= []
  optionsStrict.footer.after ||= []

  const children = <>
    <Bar {...optionsStrict.header} />
    <BroadcasterContent {...optionsStrict.content.props } />
    <Bar {...optionsStrict.footer} />
  </>
  
  return { ...optionsStrict.props, children }
}
