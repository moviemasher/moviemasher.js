import React, {
  ReactChild,
  ReactElement,
  useContext,
  cloneElement,
  ReactNode,
  useState,
  FC,
  isValidElement,
  ReactChildren
} from 'react'
import {
  elementScrollMetrics,
  UnknownObject,
  TimeRange,
  pixelFromFrame,
  pixelPerFrame,
  pixelToFrame,
  TrackRange,
  Scalar,
  ScalarRaw,
  ScalarValue,
  NumberObject,
  TrackType,
  Clip
} from '@moviemasher/moviemasher.js'
import { View } from '../View'
import { AppContext, AppContextInterface } from '../AppContext'

 interface TimelineTrackChildren extends UnknownObject {
  children? : ReactNode,
 }

interface TimelineTemplateProps extends UnknownObject {
  label?: string
  icon?: string
  frame?: string
  frames?: string
  track?: string
  start?: string
  type? : string
  duration?: string
  clip?: string
  values?: string
  children?: ReactNode
}

type TimelineClipsByTrack = Record<TrackType, Record<number, Clip[]>>

interface TimelineProps extends UnknownObject {
  audioTrack?: ReactElement
  audioTrackHeight?: ScalarValue
  children? : ReactElement<TimelineTemplateProps>
  index?: string
  track?: ReactElement
  trackHeight?: ScalarValue
  type? : string
  videoTrack?: ReactElement
  videoTrackHeight? : ScalarValue
}

const TimelineTemplate: ReactElement<TimelineTemplateProps> = <View/>

const TimelineMetrics = (context : AppContextInterface): NumberObject | undefined => {
  const { timelineReference } = context
  if (!timelineReference) return

  const { current } = timelineReference
  return elementScrollMetrics(current)
}


const Timeline: FC<TimelineProps> = (props) => {
  const context = useContext(AppContext)
  const {
    audioTrack,
    audioTrackHeight,
    children,
    index,
    track,
    trackHeight,
    type,
    videoTrack,
    videoTrackHeight,
    ...rest
  } = props

  const numericHeight = (...values: Array<ScalarValue | undefined>): number => {
    const found = values.find(value => {
      switch (typeof value) {
        case undefined: return false
        case 'number': return value
        default: return !isNaN(Number(value))
      }

    })
    if (found) return Number(found)

    return -1
  }

  const [heightAudio, setHeightAudio] = useState(numericHeight(audioTrackHeight, trackHeight))
  const [heightVideo, setHeightVideo] = useState(numericHeight(videoTrackHeight || trackHeight))
  const [heightDefault, setHeightDefault] = useState(numericHeight(trackHeight))

  const trackTemplate = (type?: TrackType): ReactElement => {
    switch (type) {
      case TrackType.Audio: return audioTrack || track || TimelineTemplate
      case TrackType.Video: return videoTrack || track || TimelineTemplate
      default: return track || TimelineTemplate
    }
  }

  const sizingNode = (index = 0, type?: TrackType): ReactElement => {
    const template = trackTemplate(type)
    const style: UnknownObject = {}
    switch (type) {
      case TrackType.Audio:
        style.height = audioTrackHeight || trackHeight
        break
      case TrackType.Video:
        style.height = videoTrackHeight || trackHeight
        break
      default:
        style.height = trackHeight
        break
    }

    const trackProps: UnknownObject = {
      key: `${type || 'main'}-${index}`
    }
    if (Object.keys(style).length) trackProps.style = style
    return cloneElement(template, trackProps)
  }

  const trackHeights = (): NumberObject => {
    return {
      video: Math.min(0, context.videoTracks - 1) * heightVideo,
      main: Math.max(1, context.videoTracks) * heightDefault,
      audio: context.audioTracks * heightAudio,
    }
  }

  const heightOfTracks = (heights : NumberObject): number => {
    return Object.values(heights).reduce((previous, value) => previous + value, 0)
  }


  const trackRanges = (metrics: NumberObject): TrackRange[] | undefined => {
    if (heightDefault) return // we don't know height, so inefficiently draw all tracks

    const { height, scrollPaddingBottom, scrollPaddingTop, scrollTop } = metrics
    const usableHeight = height - (scrollPaddingBottom + scrollPaddingTop)
    const heights = trackHeights()
    if (heightOfTracks(heights) <= usableHeight) return // we have enough space for tracks

    return // TODO: optimize drawing by only including tracks that would be visible

    const remaining = scrollTop
    const ranges: TrackRange[] = []
    if (context.videoTracks) {
      TrackRange.fromArgs()
    }
    return ranges
  }


  const clipsByTypeTrack = (timeRange : TimeRange, ranges?: TrackRange[]): TimelineClipsByTrack => {
    const byTrack: TimelineClipsByTrack = { [TrackType.Audio]: {}, [TrackType.Video]: {}}
    const { clips } = context
    const rangesTrack = ranges ? ranges : [TrackRange.fromArgs()]

    // TODO: support drawing just a segment of track, by using timeRange
    const range = undefined // timeRange
    rangesTrack.forEach(trackRange => {
      clips(range, trackRange).forEach(clip => {
        byTrack[clip.trackType][clip.track] ||= []
        byTrack[clip.trackType][clip.track].push(clip)
      })
    })
    return byTrack
  }


  const clipNode = (clip : Clip, perFrame: number): ReactChild => {
    const templateClip = isValidElement<TimelineTemplateProps>(children) ? children : TimelineTemplate
    const { props: templateProps } = templateClip
    const { children: templateChildren, ...templatePropsRest } = templateProps
    const { label } = clip
    const kids = templateChildren || label // insert label text element if empty
    // const kids = React.Children.toArray(templateChildren)
    // kids.push(<span data-label={label.replace('"', '\\"')} />)

    const style: UnknownObject = {
      left: pixelFromFrame(clip.frame, perFrame, 'floor'),
      width: pixelFromFrame(clip.frames, perFrame, 'floor')
    }
    if (templateChildren) {
      if (templateProps.label) {
        style[templateProps.label] = `'${label.replace("'", "\\'")}'`
      }
    }

    const clipProps = { key: clip.identifier, style, children: kids }
    return cloneElement(templateClip, clipProps)
  }


  const trackNode = (type: TrackType, index: number, trackClips: Clip[], perFrame: number): ReactElement => {
    const trackType = type === TrackType.Video && !index ? undefined : type
    const templateTrack = trackTemplate(trackType)
    if (!isValidElement<TimelineTrackChildren>(templateTrack)) return templateTrack

    const { props: templateProps } = templateTrack

    const { children: templateChildren, ...templatePropsRest } = templateProps
    const clipNodes : ReactNode[] = []
    const kids = React.Children.toArray(templateChildren)
    clipNodes.push(...kids)
    trackClips.forEach(clip => {
      clipNodes.push(clipNode(clip, perFrame))
    })
    const style: UnknownObject = {}
    const trackProps = { key: `${type}-${index}`, style, children: clipNodes }
    return cloneElement(templateTrack, trackProps)
  }


  const contentNodes = (): ReactChild[] => {
    const childNodes : ReactChild[] = []
    const metrics = TimelineMetrics(context)
    if (!metrics) return childNodes

    const { width } = metrics
    const { timeRange, zoom, quantize } = context
    const mashTimeRange = timeRange.scale(quantize)
    const perFrame = pixelPerFrame(mashTimeRange.frames, width, zoom)
    const contentFrames = pixelToFrame(width, perFrame)
    if (!contentFrames) return childNodes

    const { scrollLeft } = metrics
    const contentFrame = pixelToFrame(scrollLeft, perFrame)
    const viewableTimeRange = TimeRange.fromArgs(contentFrame, quantize, contentFrames)

    const ranges = trackRanges(metrics)
    const byType = clipsByTypeTrack(viewableTimeRange, ranges)
    Object.entries(byType).forEach(([type, byTrack]) => {
      Object.entries(byTrack).forEach(([index, trackClips]) => {
        childNodes.push(trackNode(type as TrackType, Number(index), trackClips, perFrame))
      })
    })
    return childNodes
  }

  const sizingNodes = (): ReactChild[] => {
    if (context.timelineReference) {
      const { current } = context.timelineReference
      if (current && current.children.length) {
        let index = 0
        if (heightVideo < 0) {
          const videoMetrics = elementScrollMetrics(current.children[index])
          const videoHeight = videoMetrics ? videoMetrics.height : 0
          // console.log("trackNodes setting heightVideo", videoHeight)
          setHeightVideo(videoHeight)
          index += 1
        }
        if (heightDefault < 0) {
          const defaultMetrics = elementScrollMetrics(current.children[1])
          const defaultHeight = defaultMetrics ? defaultMetrics.height : 0
          // console.log("trackNodes setting heightDefault", defaultHeight)
          setHeightDefault(defaultHeight)
          index += 1
        }
        if (heightAudio < 0) {
          const audioMetrics = elementScrollMetrics(current.children[2])
          const audioHeight = audioMetrics ? audioMetrics.height : 0
          // console.log("trackNodes setting heightAudio", audioHeight)
          setHeightAudio(audioHeight)
          index += 1
        }
        return contentNodes()
      }
    }

    const nodes: ReactChild[] = []
    if (heightVideo < 0) nodes.push(sizingNode(0, TrackType.Video))
    if (heightDefault < 0) nodes.push(sizingNode())
    if (heightAudio < 0) nodes.push(sizingNode(0, TrackType.Audio))
    return nodes
  }

  const contentViewOptions : UnknownObject = {
    key: 'timeline',
    children: heightDefault > -1 ? contentNodes() : sizingNodes(),
    ...rest
  }
  if (context.timelineReference) contentViewOptions.ref = context.timelineReference

  return <View { ...contentViewOptions } />
}

export { Timeline, TimelineProps }
