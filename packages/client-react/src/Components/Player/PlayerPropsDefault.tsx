import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild, WithClassName } from '../../declarations'
import { Button } from '../../Utilities/Button'
import { Bar } from '../../Utilities/Bar'
import { PlayerContent } from './PlayerContent'
import { PlayerButton } from './PlayerButton'
import { PlayerTimeControl } from './PlayerTimeControl'
import { PlayerPlaying } from './PlayerPlaying'
import { PlayerNotPlaying } from './PlayerNotPlaying'
import { PlayerProps } from './Player'
import { SelectEditedControl } from '../Controls/SelectEditedControl'
import { CreateEditedControl } from '../Controls/CreateEditedControl'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'

export interface PlayerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {
  noApi?: boolean
}

export const DefaultPlayerProps: PropsMethod<PlayerPropsDefault, PlayerProps> = function (props) {
  const { className, noApi, ...options } = props

  const optionsStrict = panelOptionsStrict(options)
  optionsStrict.props.key ||= 'player'
  optionsStrict.props.className ||= 'panel player'


  optionsStrict.content.children ||= (
    <PlayerContent {...optionsStrict.content.props} />
  )
  optionsStrict.header.content ||= [DefaultIcons.app]

  if (!noApi) {
    optionsStrict.header.after ||= [
      <SelectEditedControl key="select-edited" />,
      <CreateEditedControl key="create-edited"><Button endIcon={DefaultIcons.add}>New</Button></CreateEditedControl>,
    ]
  }

  optionsStrict.footer.content ||= [
    <PlayerButton key='play-button' className='icon-button'>
      <PlayerPlaying key='playing'>{DefaultIcons.playerPause}</PlayerPlaying>
      <PlayerNotPlaying key='not-playing'>{DefaultIcons.playerPlay}</PlayerNotPlaying>
    </PlayerButton>,
    <PlayerTimeControl key='time-slider'/>
  ]

  const children = <>
    <Bar {...optionsStrict.header} />
    {optionsStrict.content.children}
    <Bar {...optionsStrict.footer} />
  </>
  return { ...optionsStrict.props, children }
}
