import React from 'react'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { WebrtcContent } from './WebrtcContent'
import { WebrtcProps } from './Webrtc'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { NotCollapsed } from '../Collapse/NotCollapsed'
import { Collapsed } from '../Collapse/Collapsed'
import { CollapseControl } from '../Collapse/CollapseControl'
import { View } from '../../Utilities/View'
import { WebrtcPicker } from './WebrtcPicker'
import { isUndefined } from '@moviemasher/moviemasher.js'
import { PanelFoot } from '../Panel/PanelFoot'
import { WebrtcCollapseControl } from './WebrtcCollapseControl'
import { WebrtcButton } from './WebrtcButton'
import { Button } from '../../Utilities/Button'
// import { WebrtcRefresh } from './WebrtcRefresh'

export interface WebrtcPropsDefault extends PanelOptions, PropsWithoutChild {

}

export const WebrtcDefaultProps: PropsMethod<WebrtcPropsDefault, WebrtcProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'webrtc'
  optionsStrict.props.className ||= 'panel webrtc'
  if (isUndefined(optionsStrict.props.initialCollapsed)) optionsStrict.props.initialCollapsed = true
  
  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.broadcaster} />,
    <NotCollapsed key="not-collapsed"><View key="view" /></NotCollapsed>,
    <Collapsed key="collapsed">
      <label>collapsed...</label>
    </Collapsed>,
    <WebrtcCollapseControl key="collapse-control">
      <NotCollapsed key="not-collapsed" children={icons.collapse}/>
      <Collapsed key="collapsed" children={icons.collapsed}/>
    </WebrtcCollapseControl>
  ]

  optionsStrict.footer.content ||= [
    <WebrtcPicker key="preview" id="preview" children={icons.webrtcPreview}/>, 
    <WebrtcPicker key="settings" id="settings" children={icons.webrtcOptions} />,
    <WebrtcButton key="broadcast">
      <Button>Broadcast</Button>
    </WebrtcButton>
    // <WebrtcCollapseControl key="refresh" children={icons.refresh} />,
  ]
  optionsStrict.footer.before ||= []
  optionsStrict.footer.after ||= []

  const children = <>
    <Bar {...optionsStrict.header} />
    <WebrtcContent {...optionsStrict.content.props } />
    <PanelFoot {...optionsStrict.footer} />
  </>
  
  return { ...optionsStrict.props, children }
}
