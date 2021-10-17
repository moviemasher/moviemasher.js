import React, { FC, useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import {
  Time,
  EventType,
  Mash,
  Masher,
  MovieMasher,
} from '@moviemasher/moviemasher.js'

import { v4 as uuid } from "uuid"
import { AppContextDefault, AppContextInterface, AppContextProvider } from './AppContext'

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
    { id: "com.moviemasher.theme.text", frame: 750, frames: 1100, string: "Joy!" },
    { id: "com.moviemasher.theme.color", frame: 1850, frames: 1000, color: "orange"},
  ]
  const clips1 = clips.slice(0, 5).map(clip => ({
    ...clip, label: `0: ${clip.string || clip.color}`,
  }))
  const clips2 = clips.map(clip => ({
    ...clip, label: `1: ${clip.string || clip.color}`,
  }))
  const clips3 = clips.filter((clip, index) => index % 2).map(clip => ({
    ...clip, label: `2: ${clip.string || clip.color}`,
  }))
  return MovieMasher.mash.instance({
    id: uuid(), video: [
      { clips: clips1 }, { clips: clips2 }, { clips: clips3 }]
  })
}

const App: FC<AppProps> = (props) => {
  const previewReference = useRef<HTMLCanvasElement>()
  const [mash, setMash] = useState(createMash)
  const [quantize, setQuantize] = useState(mash.quantize)

  const createMasher = () : Masher => {
    AppContextDefault.masher.mash = mash
    return AppContextDefault.masher
  }

  const [masher] = useState(createMasher)
  const [paused, setPaused] = useState(masher.paused)
  const [volume, setVolume] = useState(masher.volume)
  const [selectedClipIdentifier, setSelectedClipIdentifier] = useState('')
  const [selectedEffectIdentifier, setSelectedEffectIdentifier] = useState('')
  const [timeRange, setTimeRange] = useState(masher.timeRange)

  const [counter, setCounter] = useState(0)

  const [audioTracks, setAudibleTracks] = useState(mash.audio.length)
  const [videoTracks, setVisibleTracks] = useState(mash.video.length)
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(masher.canvas)


  const changeTime = (value: Time) => { masher.time = value }
  const changePaused = (value: boolean) => { masher.paused = value }
  const changeVolume = (value: number) => { masher.volume = value }

 // Event handlers
  const handleCanvas = () => { listenCanvas(masher.canvas) }
  const handleVolume = () => { setVolume(masher.volume) }
  const handlePaused = () => { setPaused(masher.paused) }

  const handleSelection = () => {
    setSelectedClipIdentifier(String(masher.selectedClip.identifier))
    setSelectedEffectIdentifier(String(masher.selectedEffect.identifier))
  }

  const handleTime = () => { setTimeRange(masher.timeRange) }
  const handleTrack = () => {
    setAudibleTracks(mash.audio.length)
    setVisibleTracks(mash.video.length)
  }
  const handleAction = () => {
    console.log("handleAction")
    setCounter(current => current + 1)
  }

  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {
      canvas.removeEventListener(EventType.Action, handleAction)
      canvas.removeEventListener(EventType.Canvas, handleCanvas)
      canvas.removeEventListener(EventType.Duration, handleTime)
      canvas.removeEventListener(EventType.Pause, handlePaused)
      canvas.removeEventListener(EventType.Play, handlePaused)
      canvas.removeEventListener(EventType.Time, handleTime)
      canvas.removeEventListener(EventType.Track, handleTrack)
      canvas.removeEventListener(EventType.Volume, handleVolume)
      canvas.removeEventListener(EventType.Selection, handleSelection)
    }
    if (value) {
      value.addEventListener(EventType.Action, handleAction)
      value.addEventListener(EventType.Canvas, handleCanvas)
      value.addEventListener(EventType.Duration, handleTime)
      value.addEventListener(EventType.Pause, handlePaused)
      value.addEventListener(EventType.Play, handlePaused)
      value.addEventListener(EventType.Time, handleTime)
      value.addEventListener(EventType.Track, handleTrack)
      value.addEventListener(EventType.Volume, handleVolume)
      value.addEventListener(EventType.Selection, handleSelection)
      setCanvas(value)
    }
  }

  const context: AppContextInterface = {
    audioTracks,
    // clips: masher.clips.bind(masher),
    masher,
    paused,
    previewReference,
    quantize,
    setPaused: changePaused,
    setTime: changeTime,
    setVolume: changeVolume,
    timeRange,
    videoTracks,
    volume,
    selectedClipIdentifier,
    selectedEffectIdentifier,
    counter,
  }

  useEffect(() => {
    const { current: currentPreview } = previewReference || {}
    if (currentPreview) {
      listenCanvas(masher.canvas)
      masher.canvas = currentPreview
    }
    return () => { listenCanvas() }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContextProvider value={context} children={props.children} />
    </DndProvider>
  )
}
//<div>{counter}</div>

export { App }
