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
import { EditorUndoButton } from '../Controls/EditorUndoButton'
import { EditorRedoButton } from '../Controls/EditorRedoButton'
import { ClassButton } from '@moviemasher/moviemasher.js'
import { PlayerTime } from './PlayerTime'
import { View } from '../../Utilities/View'
import { labelTranslate } from '../../Utilities/Label'

export interface PlayerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}

export const DefaultPlayerProps: PropsMethod<PlayerPropsDefault, PlayerProps> = function (props = {}) {
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
    icons.app,
    <EditorUndoButton key='undo'>
      <Button>{icons.undo}{labelTranslate('undo')}</Button>
    </EditorUndoButton>,
    <EditorRedoButton key='redo'>
      <Button>{icons.redo}{labelTranslate('redo')}</Button>
    </EditorRedoButton>,
  ]
  
  optionsStrict.footer.content ||= [
    <PlayerButton key='play-button' className={ClassButton}>
      <PlayerPlaying key='playing'>{icons.playerPause}</PlayerPlaying>
      <PlayerNotPlaying key='not-playing'>{icons.playerPlay}</PlayerNotPlaying>
    </PlayerButton>,
    <PlayerTimeControl key='time-slider'/>,
    <PlayerTime key='time' className="time" />
  ]

  const children = <>
    <Bar {...optionsStrict.header} />
    {optionsStrict.content.children}
    <Bar {...optionsStrict.footer} />
  </>
  return { ...optionsStrict.props, children }
}
