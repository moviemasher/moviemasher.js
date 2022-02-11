import React from 'react'

import {
  PropsMethod, EditorIcons, EditorInputs, PropsWithoutChild, WithClassName
} from '../../declarations'
import { View } from '../../Utilities/View'
import { Button } from '../../Utilities/Button'
import { Bar, BarOptions } from '../../Utilities/Bar'
import { PlayerContent } from '../Player/PlayerContent'
import { PlayerButton } from '../Player/PlayerButton'
import { TimeSlider } from '../Player/TimeSlider'
import { Browser } from '../Browser/Browser'
import { BrowserContent } from '../Browser/BrowserContent'
import { BrowserSource } from '../Browser/BrowserSource'
import { Timeline } from './Timeline/Timeline'
import { TimelineScrubberElement } from './Timeline/TimelineScrubberElement'
import { TimelineClips } from './Timeline/TimelineClips'
import { TimelineSizer } from './Timeline/TimelineSizer'
import { TimelineZoomer } from './Timeline/TimelineZoomer'
import { TimelineTracks } from './Timeline/TimelineTracks'
import { TimelineScrubber } from './Timeline/TimelineScrubber'
import { Player } from '../Player/Player'
import { Playing } from '../Player/Playing'
import { PlayerNotPlaying } from '../Player/PlayerNotPlaying'
import { Inspector } from '../Inspector/Inspector'
import { InspectorProperties } from '../Inspector/InspectorProperties'
import { TimelineContent } from './Timeline/TimelineContent'
import { InspectorContent } from '../Inspector/InspectorContent'
import { TimelineTrackIsType } from './Timeline/TimelineTrackIsType'
import { EditorAddTrackButton } from '../Editor/EditorAddTrackButton'
import { InspectorNoSelection } from '../Inspector/InspectorNoSelection'
import { EditorUndoButton } from '../Editor/EditorUndoButton'
import { EditorRedoButton } from '../Editor/EditorRedoButton'
import { EditorRemoveButton } from '../Editor/EditorRemoveButton'
import { EditorSplitButton } from '../Editor/EditorSplitButton'
import { MasherOptions, MasherProps } from './Masher'
import { DataTypeInputs } from '../Editor/EditorInputs/DefaultInputs/DataTypeInputs'


interface ContentOptions {
  className?: string
  children?: React.ReactElement<WithClassName>
  child?: React.ReactChild
}

interface PanelOptionsStrict {
  className? : string
  header: BarOptions
  content: ContentOptions
  footer: BarOptions
}

type PanelOptions = Partial<PanelOptionsStrict>
type PanelOptionsOrFalse = PanelOptions | false
type PanelOptionsStrictOrFalse = PanelOptionsStrict | false

interface UiOptions {
  [index:string]: PanelOptionsOrFalse
  browser: PanelOptionsOrFalse
  player: PanelOptionsOrFalse
  inspector: PanelOptionsOrFalse
  timeline: PanelOptionsOrFalse
}

interface UiOptionsStrict {
  [index:string]: PanelOptionsStrictOrFalse
  browser: PanelOptionsStrictOrFalse
  player: PanelOptionsStrictOrFalse
  inspector: PanelOptionsStrictOrFalse
  timeline: PanelOptionsStrictOrFalse
}

interface EditorDefaultsArgs extends MasherOptions {
  selectClass?: string
  dropClass?: string
  icons: EditorIcons
  inputs?: EditorInputs
  panels?: Partial<UiOptions>
}

interface MasherDefaultOptions extends EditorDefaultsArgs, PropsWithoutChild {}

const MasherDefault: PropsMethod<MasherDefaultOptions, MasherProps> = function(options) {
  const { mash, icons, inputs, className, selectClass, dropClass, panels } = options

  const classNameEditor = className || 'editor masher'
  const classNameDrop = dropClass || 'drop'
  const classNameSelect = selectClass || 'selected'

  const panelOptions = panels || {}
  const optionsLoose: UiOptions = {
    browser: typeof panelOptions.browser === 'undefined' ? {} : panelOptions.browser,
    player: typeof panelOptions.player === 'undefined' ? {} : panelOptions.player,
    inspector: typeof panelOptions.inspector === 'undefined' ? {} : panelOptions.inspector,
    timeline: typeof panelOptions.timeline === 'undefined' ? {} : panelOptions.timeline,
  }

  Object.values(optionsLoose).forEach(options => {
    if (!options) return

    options.header ||= {}
    options.header.className ||= 'head'

    options.content ||= {}
    options.content.className ||= 'content'

    options.footer ||= {}
    options.footer.className ||= 'foot'
  })

  const optionsStrict = optionsLoose as UiOptionsStrict

  const browserNode = (panelOptions : PanelOptionsStrict) => {
    panelOptions.className ||= 'panel browser'
    panelOptions.header.content ||= [
      <BrowserSource key='video' id='video' types='video,videosequence' className='button-icon' children={icons.browserVideo} />,
      <BrowserSource key='videostream' id='videostream' className='button-icon' children={icons.browserVideoStream} />,
      <BrowserSource key='audio' id='audio' className='button-icon' children={icons.browserAudio} />,
      <BrowserSource key='image' id='image' className='button-icon' children={icons.browserImage} />,
      <BrowserSource key='theme' id='theme' className='button-icon' children={icons.browserTheme} />,
      <BrowserSource key='effect' id='effect' className='button-icon' children={icons.browserEffect} />,
      <BrowserSource key='transition' id='transition' className='button-icon' children={icons.browserTransition} />
    ]
    panelOptions.content.children ||= (
      <View className='definition'><label /></View>
    )
    const contentProps = {
      selectClass: {classNameSelect},
      label: '--clip-label',
      children: panelOptions.content.children,
      className: panelOptions.content.className,
    }
    const children = [
      <Bar key='header' {...panelOptions.header} />,
      <BrowserContent key='content' {...contentProps} />,
      <Bar key='footer' {...panelOptions.footer} />
    ]
    const panelProps = { key: 'browser', children, className: panelOptions.className }
    return <Browser {...panelProps} />
  }

  const inspectorNode = (panelOptions:PanelOptionsStrict) => {
    panelOptions.className ||= 'panel inspector'
    panelOptions.header.content ||= [
      <InspectorNoSelection key='no-selection'>
        <View>Select something</View>
      </InspectorNoSelection>
    ]
    panelOptions.footer.content ||= []

    const { child } = panelOptions.content
    const defaultChild = child ? <InspectorNoSelection key='no-selection' children={child} /> : null

    panelOptions.content.children ||= <>
      {defaultChild}
      <InspectorProperties><label/></InspectorProperties>
    </>


    const contentProps = {
      selectClass: {classNameSelect},
      label: '--clip-label',
      children: panelOptions.content.children,
      className: panelOptions.content.className,
    }
    const children = [
      <Bar key='header' {...panelOptions.header} />,
      <InspectorContent key='content' {...contentProps} />,
      <Bar key='footer' {...panelOptions.footer} />
    ]

    const panelProps = {
      key: 'inspector',
      children,
      className: panelOptions.className
    }

    return <Inspector {...panelProps} />
  }

  const playerNode = (panelOptions: PanelOptionsStrict) => {
    panelOptions.className ||= 'panel player'
    const contentProps = {
      selectClass: {classNameSelect},
      className: panelOptions.content.className,
    }
    panelOptions.content.children ||= (
      <PlayerContent key='content' {...contentProps} />
    )
    panelOptions.header.content ||= [ <img key='logo' src="mm.svg" />]

    panelOptions.footer.content ||= [
      <PlayerButton key='play-button' className='button'>
        <Playing key='playing'>{icons.playerPause}</Playing>
        <PlayerNotPlaying key='not-playing'>{icons.playerPlay}</PlayerNotPlaying>
      </PlayerButton>,
      <TimeSlider key='time-slider'/>
    ]

    const children = [
      <Bar key='header' {...panelOptions.header} />,
      panelOptions.content.children,
      <Bar key='footer' {...panelOptions.footer} />,
    ]


    const panelProps = { key: 'player', children, className: panelOptions.className }
    return <Player {...panelProps} />
  }

  const timelineNode = (panelOptions: PanelOptionsStrict) => {
    panelOptions.className ||= 'panel timeline'
    panelOptions.content.children ||= <>
      <View className='scrub-pad' />
      <TimelineScrubber className='scrub'>
        <TimelineScrubberElement className='scrub-icon'/>
      </TimelineScrubber>
      <View className='scrub-bar-container'>
        <TimelineScrubberElement className='scrub-bar' />
      </View>
      <TimelineTracks className='tracks'>
        <View className='track'>
          <TimelineTrackIsType type='audio'><View className='track-icon' children={icons.timelineTrackAudio}/></TimelineTrackIsType>
          <TimelineTrackIsType type='video'><View className='track-icon' children={icons.timelineTrackVideo}/></TimelineTrackIsType>
          <TimelineTrackIsType type='transition'><View className='track-icon' children={icons.timelineTrackTransition}/></TimelineTrackIsType>
          <TimelineClips
            className='clips'
            selectClass={classNameSelect}
            dropClass={classNameDrop}
            label='--clip-label'
          >
            <View className='clip'>
              <label />
            </View>
          </TimelineClips>
        </View>
      </TimelineTracks>
      <TimelineSizer className='timeline-sizer' />
    </>

    panelOptions.header.content ||= [
      <EditorUndoButton key='undo'><Button startIcon={icons.undo}>Undo</Button></EditorUndoButton>,
      <EditorRedoButton key='redo'><Button startIcon={icons.redo}>Redo</Button></EditorRedoButton>,
      <EditorRemoveButton key='remove'><Button startIcon={icons.remove}>Remove</Button></EditorRemoveButton>,
      <EditorSplitButton key='split'><Button startIcon={icons.split}>Split</Button></EditorSplitButton>,
    ]

    panelOptions.footer.content ||= [
      <TimelineZoomer key='zoomer'/>,
      <EditorAddTrackButton key='video' trackType='video' children={icons.timelineAddVideo}/>,
      <EditorAddTrackButton key='audio' trackType='audio' children={icons.timelineAddAudio}/>,
      <EditorAddTrackButton key='transition' trackType='transition' children={icons.timelineAddTransition}/>,
    ]

    const contentProps = {
      selectClass: {classNameSelect},
      children: panelOptions.content.children,
      className: panelOptions.content.className,

    }
    const children = <>
      <Bar key='header' {...panelOptions.header} />
      <TimelineContent key='content' {...contentProps} />
      <Bar key='footer' {...panelOptions.footer} />
    </>

    const panelProps = { key: 'timeline', children, className: panelOptions.className }

    return <Timeline {...panelProps} />
  }

  const children = []
  if (optionsStrict.player) children.push(playerNode(optionsStrict.player))
  if (optionsStrict.timeline) children.push(timelineNode(optionsStrict.timeline))
  if (optionsStrict.inspector) children.push(inspectorNode(optionsStrict.inspector))
  if (optionsStrict.browser) children.push(browserNode(optionsStrict.browser))
  return { className: classNameEditor, mash, children, inputs: inputs || DataTypeInputs }
}
export { MasherDefault, MasherDefaultOptions, ContentOptions, UiOptions, PanelOptionsStrict, PanelOptions, PanelOptionsOrFalse }
