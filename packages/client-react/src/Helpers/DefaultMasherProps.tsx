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
import { SelectEditedControl } from '../Components/Controls/SelectEditedControl'
import { CreateEditedControl } from '../Components/Controls/CreateEditedControl'

export interface ContentOptions {
  props?: WithClassName
  children?: React.ReactElement<WithClassName>
  child?: React.ReactChild
}

export interface PanelOptionsStrict {
  props?: WithClassName
  header: BarOptions
  content: ContentOptions
  footer: BarOptions
}

export type PanelOptions = Partial<PanelOptionsStrict>
export type PanelOptionsOrFalse = PanelOptions | false

export interface UiOptions {
  [index:string]: PanelOptionsOrFalse
  browser: PanelOptionsOrFalse
  player: PanelOptionsOrFalse
  inspector: PanelOptionsOrFalse
  timeline: PanelOptionsOrFalse
}

interface UiOptionsStrict {
  [index:string]: PanelOptionsStrict
  browser: PanelOptionsStrict
  player: PanelOptionsStrict
  inspector: PanelOptionsStrict
  timeline: PanelOptionsStrict
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

  const icons = suppliedIcons || DefaultIcons
  const classNameEditor = className || 'editor masher'
  const classNameDrop = dropClass || 'drop'
  const classNameSelect = selectClass || 'selected'

  const panelOptions = panels || {}
  const optionsLoose: UiOptions = {
    browser: panelOptions.browser || {},
    player: panelOptions.player || {},
    inspector: panelOptions.inspector || {},
    timeline: panelOptions.timeline || {},
  }

  Object.values(optionsLoose).forEach(options => {
    if (!options) return

    options.header ||= {}
    options.header!.props ||= { key: 'header', className: 'head' }

    options.content ||= {}
    options.content.props ||= { key: 'content', className: 'content' }

    options.footer ||= {}
    options.footer!.props ||= { key: 'footer', className: 'foot' }
  })

  const optionsStrict = optionsLoose as UiOptionsStrict


  optionsStrict.browser.props ||= { key: 'browser', className: 'panel browser' }
  optionsStrict.browser.header.content ||= [
    <BrowserSource key='theme' id='theme' className='icon-button' children={icons.browserTheme} />,
    <BrowserSource key='effect' id='effect' className='icon-button' children={icons.browserEffect} />,
    <BrowserSource key='transition' id='transition' className='icon-button' children={icons.browserTransition} />
  ]

  const SourceClass = noApi ? BrowserSource : BrowserDataSource
  optionsStrict.browser.header.before ||= [
    <SourceClass key='video' id='videosequence' className='icon-button' children={icons.browserVideo} />,
    <SourceClass key='audio' id='audio' className='icon-button' children={icons.browserAudio} />,
    <SourceClass key='image' id='image' className='icon-button' children={icons.browserImage} />,
  ]

  if (!noApi) {
    optionsStrict.browser.footer.before ||= [
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
  optionsStrict.browser.content.children ||= (
    <View className='definition'><label /></View>
  )

  optionsStrict.browser.content.props!.icon ||= '--clip-icon'
  optionsStrict.browser.content.props!.label ||= '--clip-label'
  optionsStrict.browser.content.props!.selectClass ||= classNameSelect
  optionsStrict.inspector.props ||= { key: 'inspector', className: 'panel inspector' }
  optionsStrict.inspector.header.content ||= [
    <InspectorNoSelection key='no-selection'>
      <View>Select something</View>
    </InspectorNoSelection>
  ]
  optionsStrict.inspector.footer.content ||= []

  const { child } = optionsStrict.inspector.content
  const defaultChild = child ? <InspectorNoSelection key='no-selection' children={child} /> : null

  optionsStrict.inspector.content.children ||= <>
    {defaultChild}
    <InspectorProperties><label /></InspectorProperties>
  </>

  optionsStrict.inspector.content.props!.label ||= '--clip-label'
  optionsStrict.inspector.content.props!.selectClass ||= classNameSelect


  optionsStrict.player.props ||= { key: 'player', className: 'panel player' }

  optionsStrict.player.content.props!.selectClass ||= classNameSelect

  optionsStrict.player.content.children ||= (
    <PlayerContent {...optionsStrict.player.content.props} />
  )
  optionsStrict.player.header.content ||= [<img key='logo' src="mm.svg" />]
  if (!noApi) optionsStrict.player.header.after ||= [
    <SelectEditedControl />,
    <CreateEditedControl><Button endIcon={icons.add}>New</Button></CreateEditedControl>
  ]

  optionsStrict.player.footer.content ||= [
    <PlayerButton key='play-button' className='icon-button'>
      <PlayerPlaying key='playing'>{icons.playerPause}</PlayerPlaying>
      <PlayerNotPlaying key='not-playing'>{icons.playerPlay}</PlayerNotPlaying>
    </PlayerButton>,
    <PlayerTimeControl key='time-slider'/>
  ]


  optionsStrict.timeline.props ||= { key: 'timeline', className: 'panel timeline' }
  optionsStrict.timeline.content.children ||= <>
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

  optionsStrict.timeline.header.content ||= [
    <EditorUndoButton key='undo'><Button startIcon={icons.undo}>Undo</Button></EditorUndoButton>,
    <EditorRedoButton key='redo'><Button startIcon={icons.redo}>Redo</Button></EditorRedoButton>,
    <EditorRemoveButton key='remove'><Button startIcon={icons.remove}>Remove</Button></EditorRemoveButton>,
    <EditorSplitButton key='split'><Button startIcon={icons.split}>Split</Button></EditorSplitButton>,
  ]

  optionsStrict.timeline.footer.content ||= [
    <TimelineZoomer key='zoomer'/>,
    <EditorAddTrackButton className='icon-button' key='video' trackType='video' children={icons.timelineAddVideo}/>,
    <EditorAddTrackButton className='icon-button' key='audio' trackType='audio' children={icons.timelineAddAudio}/>,
    <EditorAddTrackButton className='icon-button' key='transition' trackType='transition' children={icons.timelineAddTransition}/>,
  ]

  if (!noApi) {
    optionsStrict.timeline.header.before ||= [
      <Process key='save-process' id='data'>
        <SaveControl><Button>Save</Button></SaveControl>
      </Process>
    ]
    optionsStrict.timeline.header.after ||= [
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

  optionsStrict.timeline.content.props!.selectClass ||= classNameSelect

  const children = <>
    <Player {...optionsStrict.player.props}>
      <Bar {...optionsStrict.player.header} />
      {optionsStrict.player.content.children}
      <Bar {...optionsStrict.player.footer} />
    </Player>
    <Browser {...optionsStrict.browser.props}>
      <Bar {...optionsStrict.browser.header} />
      <BrowserContent {...optionsStrict.browser.content.props}>
        {optionsStrict.browser.content.children}
      </BrowserContent>
      <Bar {...optionsStrict.browser.footer} />
    </Browser>
    <Inspector {...optionsStrict.inspector.props}>
      <Bar {...optionsStrict.inspector.header} />
      <InspectorContent {...optionsStrict.inspector.content.props}>
        {optionsStrict.inspector.content.children}
      </InspectorContent>
      <Bar {...optionsStrict.inspector.footer} />
    </Inspector>
    <Timeline {...optionsStrict.timeline.props}>
      <Bar {...optionsStrict.timeline.header} />
      <TimelineContent {...optionsStrict.timeline.content.props}>
        {optionsStrict.timeline.content.children}
      </TimelineContent>
      <Bar {...optionsStrict.timeline.footer} />
    </Timeline>
  </>
  return { ...rest, className: classNameEditor, children }
}
