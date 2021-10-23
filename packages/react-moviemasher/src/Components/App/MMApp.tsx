import React from 'react'

import {
  Time,
  EventType,
  Mash,
  Masher,
  MovieMasher,
} from '@moviemasher/moviemasher.js'

import { MMContext, MMContextInterface } from './MMContext'
import { MasherContextInterface, MasherContextProvider } from './MasherContext'

const MMApp: React.FC = (props) => {
  const previewReference = React.useRef<HTMLCanvasElement>()
  const [mash, setMash] = React.useState((): Mash => {
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
      id: 'mash-id', video: [
        { clips: clips1 }, { clips: clips2 }, { clips: clips3 }]
    })
  })
  const [quantize, setQuantize] = React.useState(mash.quantize)

  const [masher] = React.useState((): Masher => MovieMasher.masher.instance({ mash }))


  const [paused, setPaused] = React.useState(masher.paused)
  const [volume, setVolume] = React.useState(masher.volume)
  const [frame, setFrame] = React.useState(masher.mash.frame)
  const [frames, setFrames] = React.useState(masher.mash.frames)

  const [selectedClipIdentifier, setSelectedClipIdentifier] = React.useState('')
  const [selectedEffectIdentifier, setSelectedEffectIdentifier] = React.useState('')


  const [audioTracks, setAudibleTracks] = React.useState(mash.audio.length)
  const [videoTracks, setVisibleTracks] = React.useState(mash.video.length)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>(masher.canvas)


  const changeFrame = (value: number) => { masher.time = Time.fromArgs(value, quantize) } //masher.time.withFrame(value) }
  const changePaused = (value: boolean) => { masher.paused = value }
  const changeVolume = (value: number) => { masher.volume = value }


  const handleCanvas = () => { listenCanvas(masher.canvas) }
  const handleVolume = () => { setVolume(masher.volume) }
  const handlePaused = () => { setPaused(masher.paused) }

  const handleSelection = () => {
    setSelectedClipIdentifier(String(masher.selectedClip.identifier))
    setSelectedEffectIdentifier(String(masher.selectedEffect.identifier))
  }

  const handleTime = () => {
    setFrame(masher.mash.frame)
  }

  const handleDuration = () => {
    console.log("MMApp.handleDuration frames", masher.mash.frames)
    setFrames(masher.mash.frames)
  }

  const handleTrack = () => {
    setAudibleTracks(mash.audio.length)
    setVisibleTracks(mash.video.length)
  }


  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {
      canvas.removeEventListener(EventType.Canvas, handleCanvas)
      canvas.removeEventListener(EventType.Duration, handleDuration)
      canvas.removeEventListener(EventType.Pause, handlePaused)
      canvas.removeEventListener(EventType.Play, handlePaused)
      canvas.removeEventListener(EventType.Time, handleTime)
      canvas.removeEventListener(EventType.Track, handleTrack)
      canvas.removeEventListener(EventType.Volume, handleVolume)
      canvas.removeEventListener(EventType.Selection, handleSelection)
    }
    if (value) {
      value.addEventListener(EventType.Canvas, handleCanvas)
      value.addEventListener(EventType.Duration, handleDuration)
      value.addEventListener(EventType.Pause, handlePaused)
      value.addEventListener(EventType.Play, handlePaused)
      value.addEventListener(EventType.Time, handleTime)
      value.addEventListener(EventType.Track, handleTrack)
      value.addEventListener(EventType.Volume, handleVolume)
      value.addEventListener(EventType.Selection, handleSelection)
      setCanvas(value)
    }
  }

  const appContext: MMContextInterface = {
    // canvas,
    audioTracks,
    masher,
    paused,
    previewReference,
    quantize,
    setPaused: changePaused,
    setVolume: changeVolume,
    videoTracks,
    volume,
  }

  const masherContext : MasherContextInterface = {
    frame,
    frames,
    setFrame: changeFrame,
    selectedClipIdentifier,
    selectedEffectIdentifier,
  }

  React.useEffect(() => {
    const { current: currentPreview } = previewReference || {}
    if (currentPreview) {
      listenCanvas(canvas)
      masher.canvas = currentPreview
    } else console.log("MMApp.useEffect", previewReference)
    return () => { listenCanvas() }
  }, [])

  return (
    <MMContext.Provider value={appContext}>
      <MasherContextProvider value={masherContext} children={props.children} />
    </MMContext.Provider>
  )
}

export { MMApp }
