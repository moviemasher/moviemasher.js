import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { BrowserContent } from './BrowserContent'
import { BrowserPicker } from './BrowserPicker'
import { BrowserProps } from './Browser'
import { BrowserControl } from './BrowserControl'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { BrowserDefinition } from './BrowserDefinition'
import { ClassButton } from '@moviemasher/moviemasher.js'

export interface BrowserPropsDefault extends PanelOptions, PropsWithoutChild {}

export const BrowserPropsDefault: PropsMethod<BrowserPropsDefault, BrowserProps> = function (props) {
  const optionsStrict = panelOptionsStrict(props)
  optionsStrict.props.key ||= 'browser'
  optionsStrict.props.className ||= 'panel browser'
  optionsStrict.props.initialPicked ||= 'container'

  optionsStrict.header.content ||= [DefaultIcons.browser]

  optionsStrict.footer.content ||= [
    <BrowserPicker key='effect' id='effect' className={ClassButton} children={DefaultIcons.browserEffect} />,
    <BrowserPicker key='container' id='container' className={ClassButton} children={DefaultIcons.container} />,
    <BrowserPicker key='content' id='content' className={ClassButton} children={DefaultIcons.content} />,
  ]
  optionsStrict.footer.before ||= [
    <BrowserPicker key='video' id='video' types='video,videosequence' className={ClassButton} children={DefaultIcons.browserVideo} />,
    <BrowserPicker key='audio' id='audio' className={ClassButton} children={DefaultIcons.browserAudio} />,
    <BrowserPicker key='image' id='image' className={ClassButton} children={DefaultIcons.browserImage} />,
  ]

  optionsStrict.footer.after ||= [
    <BrowserControl key='import' children={DefaultIcons.upload} />
  ]

  optionsStrict.content.children ||= (
    <BrowserDefinition className='definition' icon="--clip-icon"></BrowserDefinition>
  )

  const children = <>
    <Bar {...optionsStrict.header} />
    <BrowserContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </BrowserContent>
    <Bar {...optionsStrict.footer} />
  </>
  
  return { ...optionsStrict.props, children }
}
