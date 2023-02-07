import React from 'react'

import { PropsMethod, PropsWithoutChild, WithClassName } from '../../declarations'
import { Button } from '../../Utilities/Button'
import { Bar } from '../../Utilities/Bar'
import { PlayerContent } from './PlayerContent'
import { PlayerButton } from './PlayerButton'
import { PlayerTimeControl } from './PlayerTimeControl'
import { PlayerPlaying } from './PlayerPlaying'
import { PlayerNotPlaying } from './PlayerNotPlaying'
import { PlayerProps } from './Player'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'

import { ClassButton, EditType } from '@moviemasher/moviemasher.js'
import { PlayerTime } from './PlayerTime'
import { View } from '../../Utilities/View'
import { Mashing } from '../Masher/Mashing'
import { BroadcasterControl } from '../Broadcaster/BroadcasterControl'
import { SaveControl } from '../Controls/SaveControl'
import { labelTranslate } from '../../Utilities/Label'
import { CreateEditedControl } from '../Controls/CreateEditedControl'
import { SelectEditedControl } from '../Controls/SelectEditedControl'

export interface PlayerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}

export const PlayerDefaultProps: PropsMethod<PlayerPropsDefault, PlayerProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'player'
  optionsStrict.props.className ||= 'panel player'


  optionsStrict.content.children ||= (
    <PlayerContent {...optionsStrict.content.props}>
      <View key="drop-box" className="drop-box" />
    </PlayerContent>
  )
  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.app} />,
    <SelectEditedControl key="select-edited" className="row" children={icons.document} />,
    <SaveControl key='save-process'>
      <Button key="button">
        {labelTranslate('update')}
        {icons.document}
      </Button>
    </SaveControl>,
    <CreateEditedControl key="create-edited">
      <Button>
        {labelTranslate('create')} 
        {icons.document}
      </Button>
    </CreateEditedControl>
   
  ]
  
  optionsStrict.footer.content ||= [
    <Mashing key="mashing-mash" editType={EditType.Mash}>
      <PlayerButton key='play-button' className={ClassButton}>
        <PlayerPlaying key='playing'>{icons.pause}</PlayerPlaying>
        <PlayerNotPlaying key='not-playing'>{icons.play}</PlayerNotPlaying>
      </PlayerButton>
      <PlayerTimeControl key='time-slider'/>
      <PlayerTime key='time' className="time" />
    </Mashing>,
    <Mashing key="mashing-cast" editType={EditType.Cast}>
      <BroadcasterControl key='import' children={icons.broadcast} />
    </Mashing>,
  ]

  const children = <>
    <Bar {...optionsStrict.header} />
    {optionsStrict.content.children}
    <Bar {...optionsStrict.footer} />
  </>
  return { ...optionsStrict.props, children }
}