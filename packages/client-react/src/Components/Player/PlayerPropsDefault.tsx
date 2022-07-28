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
import { SaveControl } from '../Controls/SaveControl'
import { View } from '../../Utilities/View'
import { Process } from '../Process/Process'
import { EditorUndoButton } from '../Controls/EditorUndoButton'
import { EditorRedoButton } from '../Controls/EditorRedoButton'

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
  optionsStrict.header.content ||= [
    DefaultIcons.app,
    <EditorUndoButton key='undo'><Button startIcon={DefaultIcons.undo}>Undo</Button></EditorUndoButton>,
    <EditorRedoButton key='redo'><Button startIcon={DefaultIcons.redo}>Redo</Button></EditorRedoButton>,
  ]

 
  if (!noApi) {
    optionsStrict.header.after ||= [
      <Process key='save-process' id='data'>
        <View><SaveControl><Button>Save</Button></SaveControl></View>
      </Process>,
      <SelectEditedControl key="select-edited" />,
      <CreateEditedControl key="create-edited">
        <Button>{DefaultIcons.add}New</Button>
      </CreateEditedControl>,
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
