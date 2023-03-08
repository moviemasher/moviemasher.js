import React from 'react'
import { ClassButton } from '@moviemasher/moviemasher.js'

import { PropsMethod, PropsWithoutChild } from "../../Types/Props"
import { Bar } from '../../Utilities/Bar'
import { BrowserContent } from './BrowserContent'
import { BrowserPicker } from './BrowserPicker'
import { BrowserProps } from './Browser'
import { BrowserControl } from './BrowserControl'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { DefinitionItem } from '../DefinitionItem/DefinitionItem'
import { View } from '../../Utilities/View'

export interface BrowserPropsDefault extends PanelOptions, PropsWithoutChild {}

export const BrowserDefaultProps: PropsMethod<BrowserPropsDefault, BrowserProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  // optionsStrict.props.key ||= 'browser'
  optionsStrict.props.className ||= 'panel browser'
  // optionsStrict.props.initialPicked ||= 'container'
  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.browser} />
  ]

  optionsStrict.footer.content ||= [
    <BrowserPicker key='effect' id='effect' className={ClassButton} children={icons.effect} />,
    <BrowserPicker key='container' id='container' className={ClassButton} children={icons.container} />,
    <BrowserPicker key='content' id='content' className={ClassButton} children={icons.content} />,
  ]
  optionsStrict.footer.before ||= [
    <BrowserPicker key='video' id='video' types='video,videosequence' className={ClassButton} children={icons.browserVideo} />,
    <BrowserPicker key='audio' id='audio' className={ClassButton} children={icons.browserAudio} />,
    <BrowserPicker key='image' id='image' className={ClassButton} children={icons.browserImage} />,
    <BrowserPicker key='font' id='font' className={ClassButton} children={icons.browserText} />,
  ]

  optionsStrict.footer.after ||= [
    <BrowserControl key='import'>{icons.import}</BrowserControl>
  ]

  optionsStrict.content.children ||= (
    <DefinitionItem draggable={true} className='definition preview' />
  )

  const children = <>
    <Bar key='head' {...optionsStrict.header} />
    <BrowserContent key='content' {...optionsStrict.content.props} />
    <Bar key='foot' {...optionsStrict.footer} />
  </>
  
  return { 
    initialPicked: 'container', 
    key: 'browser',
    ...optionsStrict.props, children, 
  }
}
