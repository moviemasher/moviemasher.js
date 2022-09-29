import React from 'react'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { BrowserContent } from './BrowserContent'
import { BrowserPicker } from './BrowserPicker'
import { BrowserProps } from './Browser'
import { BrowserControl } from './BrowserControl'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { DefinitionItem } from '../DefinitionItem/DefinitionItem'
import { ClassButton } from '@moviemasher/moviemasher.js'

export interface BrowserPropsDefault extends PanelOptions, PropsWithoutChild {}

export const BrowserPropsDefault: PropsMethod<BrowserPropsDefault, BrowserProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'browser'
  optionsStrict.props.className ||= 'panel browser'
  optionsStrict.props.initialPicked ||= 'container'
  optionsStrict.header.content ||= [icons.browser]

  optionsStrict.footer.content ||= [
    <BrowserPicker key='effect' id='effect' className={ClassButton} children={icons.browserEffect} />,
    <BrowserPicker key='container' id='container' className={ClassButton} children={icons.container} />,
    <BrowserPicker key='content' id='content' className={ClassButton} children={icons.content} />,
  ]
  optionsStrict.footer.before ||= [
    <BrowserPicker key='video' id='video' types='video,videosequence' className={ClassButton} children={icons.browserVideo} />,
    <BrowserPicker key='audio' id='audio' className={ClassButton} children={icons.browserAudio} />,
    <BrowserPicker key='image' id='image' className={ClassButton} children={icons.browserImage} />,
  ]

  optionsStrict.footer.after ||= [
    <BrowserControl key='import' children={icons.upload} />
  ]

  optionsStrict.content.children ||= (
    <DefinitionItem draggable={true} className='definition preview' />
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
