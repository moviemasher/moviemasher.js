import React from 'react'

import {
  PropsMethod, EditorIcons, PropsWithoutChild, WithClassName
} from '../declarations'
import { View } from '../Utilities/View'
import { Button } from '../Utilities/Button'
import { Bar, BarOptions } from '../Utilities/Bar'
import { PlayerContent } from '../Components/Player/PlayerContent'
import { PlayerButton } from '../Components/Player/PlayerButton'
import { PlayerTimeControl } from '../Components/Player/PlayerTimeControl'
import { Browser } from '../Components/Browser/Browser'
import { BrowserContent } from '../Components/Browser/BrowserContent'
import { BrowserSource } from '../Components/Browser/BrowserSource'
import { Timeline } from '../Components/Masher/Timeline/Timeline'
import { TimelineScrubberElement } from '../Components/Masher/Timeline/TimelineScrubberElement'
import { TimelineClips } from '../Components/Masher/Timeline/TimelineClips'
import { TimelineSizer } from '../Components/Masher/Timeline/TimelineSizer'
import { TimelineZoomer } from '../Components/Masher/Timeline/TimelineZoomer'
import { TimelineTracks } from '../Components/Masher/Timeline/TimelineTracks'
import { TimelineScrubber } from '../Components/Masher/Timeline/TimelineScrubber'
import { Player } from '../Components/Player/Player'
import { PlayerPlaying } from '../Components/Player/PlayerPlaying'
import { PlayerNotPlaying } from '../Components/Player/PlayerNotPlaying'
import { Inspector } from '../Components/Inspector/Inspector'
import { InspectorProperties } from '../Components/Inspector/InspectorProperties'
import { TimelineContent } from '../Components/Masher/Timeline/TimelineContent'
import { InspectorContent } from '../Components/Inspector/InspectorContent'
import { TimelineTrackIsType } from '../Components/Masher/Timeline/TimelineTrackIsType'
import { EditorAddTrackButton } from '../Components/Editor/EditorAddTrackButton'
import { InspectorNoSelection } from '../Components/Inspector/InspectorNoSelection'
import { EditorUndoButton } from '../Components/Editor/EditorUndoButton'
import { EditorRedoButton } from '../Components/Editor/EditorRedoButton'
import { EditorRemoveButton } from '../Components/Editor/EditorRemoveButton'
import { EditorSplitButton } from '../Components/Editor/EditorSplitButton'
import { MasherOptions, MasherProps } from '../Components/Masher/Masher'
import { DataTypeInputs } from '../Components/Editor/EditorInputs/DefaultInputs/DataTypeInputs'
import { BrowserDataSource } from '../Components/Browser/BrowserDataSource'
import { Process } from '../Components/Process/Process'
import { UploadControl } from '../Components/Controls/UploadControl'
import { ProcessActive } from '../Components/Process/ProcessActive'
import { ProcessStatus } from '../Components/Process/ProcessStatus'
import { SaveControl } from '../Components/Controls/SaveControl'
import { RenderControl } from '../Components/Controls/RenderControl'
import { DefaultIcons } from '../Components/Editor/EditorIcons/DefaultIcons'
import { EditorInputs } from '../Components/Editor/EditorInputs/EditorInputs'
import { ViewControl } from '../Components/Controls/ViewControl'
import { ProcessProgress } from '../Components/Process/ProcessProgress'
import { MashesControl } from '../Components/Controls/MashesControl'
import { InspectorEffects } from '../Components/Inspector/InspectorEffects'


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
  icons?: EditorIcons
  inputs?: EditorInputs
  panels?: Partial<UiOptions>
  noApi?: boolean
}

export interface MasherPropsDefault extends EditorDefaultsArgs, PropsWithoutChild {}

export const DefaultMasherProps: PropsMethod<MasherPropsDefault, MasherProps> = function(options) {
  const {
    icons: suppliedIcons, inputs: suppliedInputs,
    className, selectClass, dropClass, panels, noApi,
    ...rest
  } = options
  const inputs = suppliedInputs || DataTypeInputs
  const icons = suppliedIcons || DefaultIcons
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
      <BrowserSource key='theme' id='theme' className='icon-button' children={icons.browserTheme} />,
      <BrowserSource key='effect' id='effect' className='icon-button' children={icons.browserEffect} />,
      <BrowserSource key='transition' id='transition' className='icon-button' children={icons.browserTransition} />
    ]

    const SourceClass = noApi ? BrowserSource : BrowserDataSource
    panelOptions.header.before ||= [
      <SourceClass key='video' id='videosequence' className='icon-button' children={icons.browserVideo} />,
      <SourceClass key='audio' id='audio' className='icon-button' children={icons.browserAudio} />,
      <SourceClass key='image' id='image' className='icon-button' children={icons.browserImage} />,
    ]

    if (!noApi) {
      panelOptions.footer.before ||= [
        <Process key='upload-process' id='data'>
          <UploadControl>
            {icons.upload}
          </UploadControl>
          <ProcessActive>
            <ProcessStatus />
            <ProcessProgress/>
          </ProcessActive>
        </Process>
      ]
    }
    panelOptions.content.children ||= (
      <View className='definition'><label /></View>
    )
    const contentProps = {
      selectClass: classNameSelect,
      label: '--clip-label',
      icon: '--clip-icon',
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
      <InspectorProperties><label /></InspectorProperties>
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
    panelOptions.header.content ||= [<img key='logo' src="mm.svg" />]
    if (!noApi) panelOptions.header.after ||= [<MashesControl/>]

    panelOptions.footer.content ||= [
      <PlayerButton key='play-button' className='icon-button'>
        <PlayerPlaying key='playing'>{icons.playerPause}</PlayerPlaying>
        <PlayerNotPlaying key='not-playing'>{icons.playerPlay}</PlayerNotPlaying>
      </PlayerButton>,
      <PlayerTimeControl key='time-slider'/>
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
            icon='--clip-icon'
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
      <EditorAddTrackButton className='icon-button' key='video' trackType='video' children={icons.timelineAddVideo}/>,
      <EditorAddTrackButton className='icon-button' key='audio' trackType='audio' children={icons.timelineAddAudio}/>,
      <EditorAddTrackButton className='icon-button' key='transition' trackType='transition' children={icons.timelineAddTransition}/>,
    ]

    if (!noApi) {
      panelOptions.header.before ||= [
        <Process key='save-process' id='data'>
          <SaveControl><Button>Save</Button></SaveControl>
        </Process>
      ]
      panelOptions.header.after ||= [
        <ViewControl key='view-control' ><Button>View</Button></ViewControl>,
        <Process key='render-process' id='rendering'>
          <RenderControl><Button>Render</Button></RenderControl>
          <ProcessActive>
            <ProcessStatus />
            <ProcessProgress/>
          </ProcessActive>

        </Process>,
      ]
    }

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
  return { ...rest, className: classNameEditor, children }
}
export { ContentOptions, UiOptions, PanelOptionsStrict, PanelOptions, PanelOptionsOrFalse }
