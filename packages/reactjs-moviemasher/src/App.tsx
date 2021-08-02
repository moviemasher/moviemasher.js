import React, { FC, useEffect, useRef, useState } from 'react'
import { Time, EventType, Mash, Masher, MovieMasher } from '@moviemasher/moviemasher.js'
import { v4 as uuid } from "uuid"
import { AppContextInterface, AppContextProvider } from './AppContext'

interface AppProps {}


const createMash = (): Mash => {
  console.warn("TODO: remove mash content")
  const clips = [
    { id: "com.moviemasher.theme.text", frame: 0, frames: 100, string: "Fuck yeah!" },
    { id: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue"},
    { id: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "Woot woot!" },
    { id: "com.moviemasher.theme.color", frame: 250, frames: 50, color: "green"},
    { id: "com.moviemasher.theme.text", frame: 300, frames: 100, string: "Love it!" },
    { id: "com.moviemasher.theme.color", frame: 400, frames: 50, color: "red"},
    { id: "com.moviemasher.theme.text", frame: 450, frames: 100, string: "Juicy!" },
    { id: "com.moviemasher.theme.color", frame: 550, frames: 50, color: "yellow"},
    { id: "com.moviemasher.theme.text", frame: 600, frames: 100, string: "Gorgeous!" },
    { id: "com.moviemasher.theme.color", frame: 700, frames: 50, color: "violet"},
    { id: "com.moviemasher.theme.text", frame: 750, frames: 100, string: "Joy!" },
    { id: "com.moviemasher.theme.color", frame: 850, frames: 50, color: "orange"},
  ]
  return MovieMasher.mash.instance({ id: uuid(), video: [{ clips }] })
}

const App: FC<AppProps> = (props) => {
  const previewReference = useRef<HTMLCanvasElement>()
  const timelineReference = useRef<HTMLDivElement>()
  const [mash, setMash] = useState(createMash)
  const [quantize, setQuantize] = useState(mash.quantize)

  const createMasher = (): Masher => MovieMasher.masher.instance({ mash })

  const [masher] = useState(createMasher)
  const [paused, setPaused] = useState(masher.paused)
  const [volume, setVolume] = useState(masher.volume)
  const [timeRange, setTimeRange] = useState(masher.timeRange)


  const [audioTracks, setAudibleTracks] = useState(mash.audio.length)
  const [videoTracks, setVisibleTracks] = useState(mash.video.length)
  const [zoom, setZoom] = useState(0)
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(masher.canvas)

  const [timelineWidth, setTimelineWidth] = useState(0)

  const changeTime = (value: Time) => { masher.time = value }
  const changePaused = (value: boolean) => { masher.paused = value }
  const changeVolume = (value: number) => { masher.volume = value }

 // Event handlers
  const handleCanvas = () => { listenCanvas(masher.canvas) }
  const handleVolume = () => { setVolume(masher.volume) }
  const handlePaused = () => { setPaused(masher.paused) }
  const handleTime = () => { setTimeRange(masher.timeRange) }
  const handleTrack = () => {
    setAudibleTracks(mash.audio.length)
    setVisibleTracks(mash.video.length)
  }

  const handleResize = () => {
    const { current: currentTimeline } = timelineReference || {}
    if (currentTimeline) setTimelineWidth(currentTimeline.getBoundingClientRect().width)
  }
  const [resizeObserver] = useState(new ResizeObserver(handleResize))

  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {
      canvas.removeEventListener(EventType.Canvas, handleCanvas)
      canvas.removeEventListener(EventType.Duration, handleTime)
      canvas.removeEventListener(EventType.Pause, handlePaused)
      canvas.removeEventListener(EventType.Play, handlePaused)
      canvas.removeEventListener(EventType.Time, handleTime)
      canvas.removeEventListener(EventType.Time, handleTrack)
      canvas.removeEventListener(EventType.Volume, handleVolume)
    }
    // const value = masher.canvas
    if (value) {
      value.addEventListener(EventType.Canvas, handleCanvas)
      value.addEventListener(EventType.Duration, handleTime)
      value.addEventListener(EventType.Pause, handlePaused)
      value.addEventListener(EventType.Play, handlePaused)
      value.addEventListener(EventType.Time, handleTime)
      value.addEventListener(EventType.Volume, handleVolume)
      setCanvas(value)
    }
  }

  const context: AppContextInterface = {
    audioTracks,
    videoTracks,
    previewReference,
    timelineReference,
    timelineWidth,
    timeRange,
    setTimelineWidth,
    setTime: changeTime,
    quantize,
    setPaused: changePaused,
    setVolume: changeVolume,
    setZoom,
    clips: masher.clips.bind(masher),
    paused,
    volume,
    zoom,
  }

  useEffect(() => {
    const { current: currentPreview } = previewReference || {}
    if (currentPreview) {
      listenCanvas(masher.canvas)
      masher.canvas = currentPreview
    }
    const { current: currentTimeline } = timelineReference || {}
    if (currentTimeline) resizeObserver.observe(currentTimeline)
    return () => {
      listenCanvas()
      resizeObserver.disconnect()

    }
  }, [])

  return <AppContextProvider value={context} children={props.children} />
}

export { App }
