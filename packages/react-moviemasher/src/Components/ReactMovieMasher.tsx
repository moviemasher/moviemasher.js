import React from 'react'

import { DataType, Mash, UnknownObject } from '@moviemasher/moviemasher.js'
import { Editor } from './Editor/Editor'
import { PlayerContent } from './Player/PlayerContent'
import { PlayButton } from './Player/PlayButton'
import { TimeSlider } from './Player/TimeSlider'
import { BrowserPanel } from './Browser/BrowserPanel'
import { BrowserContent } from './Browser/BrowserContent'
import { BrowserSource } from './Browser/BrowserSource'
import { TimelinePanel } from './Timeline/TimelinePanel'
import { ScrubberElement } from './Timeline/ScrubberElement'
import { TimelineClips } from './Timeline/TimelineClips'
import { TimelineSizer } from './Timeline/TimelineSizer'
import { Zoomer } from './Timeline/Zoomer'
import { TimelineTracks } from './Timeline/TimelineTracks'
import { Scrubber } from './Timeline/Scrubber'
import { PlayerPanel } from './Player/PlayerPanel'
import { Playing } from './Player/Playing'
import { NotPlaying } from './Player/NotPlaying'
import { EditorIcons, EditorInputs } from '../declarations'
import { InspectorPanel } from './Inspector/InspectorPanel'
import { Defined } from './Inspector/Defined'
import { Inspector } from './Inspector/Inspector'
import { View } from '../Utilities/View'
import { TimelineContent } from './Timeline/TimelineContent'
import { InspectorContent } from './Inspector/InspectorContent'
import { Hosts } from './Hosts/Hosts'
import { TrackIsType } from './Timeline/TrackIsType'
import { AddTrackButton } from '../Controls/AddTrackButton'
import { NoSelection } from './Inspector/NoSelection'
import { UndoButton } from '../Controls/UndoButton'
import { Button } from '../Utilities/Button'
import { RedoButton } from '../Controls/RedoButton'
import { RemoveButton } from '../Controls/RemoveButton'
import { SplitButton } from '../Controls/SplitButton'

interface ContentOptions {
  className?: string
  children?: React.ReactChild
  child?: React.ReactChild
}

interface BarOptions {
  className?: string
  left?: React.ReactChildren
  right?: React.ReactChildren
  middle?: React.ReactFragment
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

interface ReactMovieMasherProps {
  className?: string
  selectClass?: string
  dropClass?: string
  icons: EditorIcons
  inputs: EditorInputs
  mash?: Mash
  panels?: Partial<UiOptions>
  children?: never
}

const Bar: React.FunctionComponent<BarOptions> = props => {
  const { className, left, middle, right } = props
  if (!(left || middle || right)) return null

  const children = [left, middle, right].filter(Boolean)

  const viewProps: UnknownObject = {
    className, children,
  }
  return <View {...viewProps}/>
}

const ReactMovieMasher: React.FunctionComponent<ReactMovieMasherProps> = props => {
  const { mash, icons, inputs, className, selectClass, dropClass, panels } = props

  const classNameEditor = className || 'moviemasher-app'
  const classNameDrop = dropClass || 'moviemasher-drop'
  const classNameSelect = selectClass || 'moviemasher-selected'

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
    options.header.className ||= 'moviemasher-head'

    options.content ||= {}
    options.content.className ||= 'moviemasher-content'

    options.footer ||= {}
    options.footer.className ||= 'moviemasher-foot'
  })

  const options = optionsLoose as UiOptionsStrict

  const browserNode = (panelOptions : PanelOptionsStrict) => {
    panelOptions.className ||= 'moviemasher-panel moviemasher-browser'
    panelOptions.header.middle ||= <>
      <BrowserSource id='video' types='video,videosequence' className='moviemasher-button-icon' children={icons.browserVideo} />
      <BrowserSource id='videostream' className='moviemasher-button-icon' children={icons.browserVideoStream} />
      <BrowserSource id='audio' className='moviemasher-button-icon' children={icons.browserAudio} />
      <BrowserSource id='image' className='moviemasher-button-icon' children={icons.browserImage} />
      <BrowserSource id='theme' className='moviemasher-button-icon' children={icons.browserTheme} />
      <BrowserSource id='effect' className='moviemasher-button-icon' children={icons.browserEffect} />
      <BrowserSource id='transition' className='moviemasher-button-icon' children={icons.browserTransition} />
    </>
    panelOptions.content.children ||= (
      <View className='moviemasher-definition'><label /></View>
    )
    const contentProps = {
      selectClass: {classNameSelect},
      label: '--clip-label',
      children: panelOptions.content.children,
      className: panelOptions.content.className,
    }
    const children = <>
      <Bar {...panelOptions.header} />
      <BrowserContent {...contentProps} />
      <Bar {...panelOptions.footer} />
    </>
    const panelProps = { children, className: panelOptions.className }
    return <BrowserPanel {...panelProps} />
  }

  const inspectorNode = (panelOptions:PanelOptionsStrict) => {
    panelOptions.className ||= 'moviemasher-panel moviemasher-inspector'
    panelOptions.header.middle ||= <>
      <NoSelection>
        <View>Select something</View>
      </NoSelection>
    </>
    panelOptions.footer.middle ||= <>
    </>

    const { child } = panelOptions.content
    const defaultChild = child ? <NoSelection children={child}/> : null
    panelOptions.content.children ||= <>
      {defaultChild}
      <Inspector properties='label,backcolor' inputs={inputs}><label /></Inspector>
      <Defined property='color' className='moviemasher-input'>
        <label>Color</label> {inputs[DataType.Text]}
      </Defined>
      <Inspector inputs={inputs} className='moviemasher-input'><label/></Inspector>
    </>

    const contentProps = {
      selectClass: {classNameSelect},
      label: '--clip-label',
      children: panelOptions.content.children,
      className: panelOptions.content.className,
    }
    const children = <>
      <Bar {...panelOptions.header} />
      <InspectorContent {...contentProps} />
      <Bar {...panelOptions.footer} />
    </>

    const panelProps = { children, className: panelOptions.className }
    return <InspectorPanel {...panelProps} />
  }

  const playerNode = (panelOptions: PanelOptionsStrict) => {
    panelOptions.className ||= 'moviemasher-panel moviemasher-player'
    const contentProps = {
      selectClass: {classNameSelect},
      className: panelOptions.content.className,
    }
    panelOptions.content.children ||= (
      <PlayerContent {...contentProps} />
    )
    panelOptions.header.middle ||= <>

    </>

    panelOptions.footer.middle ||= <>
      <PlayButton className='moviemasher-button'>
        <Playing>{icons.playerPause}</Playing>
        <NotPlaying>{icons.playerPlay}</NotPlaying>
      </PlayButton>
      <TimeSlider />
    </>

    const children = <>
      <Bar {...panelOptions.header} />
      {panelOptions.content.children}
      <Bar {...panelOptions.footer} />
    </>

    const panelProps = { children, className: panelOptions.className }
    return <PlayerPanel {...panelProps} />
  }

  const timelineNode = (panelOptions: PanelOptionsStrict) => {
    panelOptions.className ||= 'moviemasher-panel moviemasher-timeline'
    panelOptions.content.children ||= <>
      <View className='moviemasher-scrub-pad' />
      <Scrubber className='moviemasher-scrub'>
        <ScrubberElement className='moviemasher-scrub-icon'/>
      </Scrubber>
      <View className='moviemasher-scrub-bar-container'>
        <ScrubberElement className='moviemasher-scrub-bar' />
      </View>
      <TimelineTracks className='moviemasher-tracks'>
        <View className='moviemasher-track'>
          <TrackIsType type='audio'><View className='moviemasher-track-icon' children={icons.timelineTrackAudio}/></TrackIsType>
          <TrackIsType type='video'><View className='moviemasher-track-icon' children={icons.timelineTrackVideo}/></TrackIsType>
          <TrackIsType type='transition'><View className='moviemasher-track-icon' children={icons.timelineTrackTransition}/></TrackIsType>
          <TimelineClips
            className='moviemasher-clips'
            selectClass={classNameSelect}
            dropClass={classNameDrop}
            label='--clip-label'
          >
            <View className='moviemasher-clip'>
              <label />
            </View>
          </TimelineClips>
        </View>
      </TimelineTracks>
      <TimelineSizer className='moviemasher-timeline-sizer' />
    </>

    panelOptions.header.middle ||= <>
      <UndoButton><Button startIcon={icons.undo}>Undo</Button></UndoButton>
      <RedoButton><Button startIcon={icons.redo}>Redo</Button></RedoButton>
      <RemoveButton><Button startIcon={icons.remove}>Remove</Button></RemoveButton>
      <SplitButton><Button startIcon={icons.split}>Split</Button></SplitButton>
    </>

    panelOptions.footer.middle ||= <>
      <Zoomer />
      <AddTrackButton trackType='video' children={icons.timelineAddVideo}/>
      <AddTrackButton trackType='audio' children={icons.timelineAddAudio}/>
      <AddTrackButton trackType='transition' children={icons.timelineAddTransition}/>
    </>

    const contentProps = {
      selectClass: {classNameSelect},
      children: panelOptions.content.children,
      className: panelOptions.content.className,

    }
    const children = <>
      <Bar {...panelOptions.header} />
      <TimelineContent {...contentProps} />
      <Bar {...panelOptions.footer} />
    </>

    const panelProps = { children, className: panelOptions.className }

    return <TimelinePanel {...panelProps} />
  }

  const children = []
  if (options.player) children.push(playerNode(options.player))
  if (options.browser) children.push(browserNode(options.browser))
  if (options.inspector) children.push(inspectorNode(options.inspector))
  if (options.timeline) children.push(timelineNode(options.timeline))
  const editorProps = { className: classNameEditor, mash, children }
  return <Hosts><Editor {...editorProps} /></Hosts>
}
export { ReactMovieMasher }
