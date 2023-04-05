import React from 'react'

import { WithClassName } from "../../Types/Core"
import { PropsMethod, PropsWithoutChild } from "../../Types/Props"
import { Bar } from '../../Utilities/Bar'
import { PlayerContent } from './PlayerContent'
import { PlayerButton } from './PlayerButton'
import { PlayerTimeControl } from './PlayerTimeControl'
import { PlayerProps } from './Player'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'

import { ClassButton } from '@moviemasher/lib-core'
import { PlayerTime } from './PlayerTime'
import { View } from '../../Utilities/View'
import { SaveControl } from '../Controls/SaveControl'
import { CreateEditedControl } from '../Controls/CreateEditedControl'
import TranslationSpan from '../Translation/TranslationSpan/TranslationSpan.lite'
import Test from '../Test/Test.lite'

export interface PlayerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}

export const PlayerDefaultProps: PropsMethod<PlayerPropsDefault, PlayerProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  // optionsStrict.props.key ||= 'player'
  optionsStrict.props.className ||= 'panel player'


  optionsStrict.content.children ||= (
    <PlayerContent key='content' {...optionsStrict.content.props}>
      <View key="drop-box" className="drop-box" />
    </PlayerContent>
  )
  optionsStrict.header.content ||= [
    <Test />,
    <View key="panel-icon" children={icons.app} />,
    <SaveControl button={true} key='save-process'>
      <TranslationSpan id="update" />
      {icons.document}
    </SaveControl>,
    <CreateEditedControl button={true} key="create-mash">
      <TranslationSpan id="create" />
      {icons.document}
    </CreateEditedControl>
  ]
  
  optionsStrict.footer.content ||= [
    <PlayerButton key='play-button' className={ClassButton} />,
    <PlayerTimeControl key='time-slider'/>,
    <PlayerTime key='time' className="time" />,
  ]

  const children = <>
    <Bar key='head' {...optionsStrict.header} />
    {optionsStrict.content.children}
    <Bar key='foot' {...optionsStrict.footer} />
  </>
  return { 
    key: 'player',
    ...optionsStrict.props, children 
  }
}
