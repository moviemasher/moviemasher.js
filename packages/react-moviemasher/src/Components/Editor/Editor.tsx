import React from 'react'
import {
  Time,
  EventType,
  Mash,
  Masher,
  MovieMasher,
  UnknownObject,
} from '@moviemasher/moviemasher.js'

import { EditorContext, EditorContextInterface } from './EditorContext'
import { View } from '../../Utilities/View'

const Editor: React.FC<React.PropsWithChildren<UnknownObject>> = (props) => {
  const previewReference = React.useRef<HTMLCanvasElement>()
  const [actionNonce, setActionNonce] = React.useState(0)
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

  const [frame, setFrame] = React.useState(masher.mash.frame)
  const [frames, setFrames] = React.useState(masher.mash.frames)

  const [selectedClipIdentifier, setSelectedClipIdentifier] = React.useState('')
  const [selectedEffectIdentifier, setSelectedEffectIdentifier] = React.useState('')

  const [audioTracks, setAudibleTracks] = React.useState(mash.audio.length)
  const [videoTracks, setVisibleTracks] = React.useState(mash.video.length)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>(masher.canvas)


  const changeFrame = (value: number) => { masher.time = Time.fromArgs(value, quantize) } //masher.time.withFrame(value) }

  const handleCanvas = () => { listenCanvas(masher.canvas) }

  const handleSelection = () => {
    setSelectedClipIdentifier(String(masher.selectedClip.identifier))
    setSelectedEffectIdentifier(String(masher.selectedEffect.identifier))
  }

  const handleTime = () => {
    setFrame(masher.mash.frame)
  }

  const handleDuration = () => {
    console.log("Editor.handleDuration frames", masher.mash.frames)
    setFrames(masher.mash.frames)
  }

  const handleTrack = () => {
    setAudibleTracks(mash.audio.length)
    setVisibleTracks(mash.video.length)
  }

  const handleAction = () => { setActionNonce(nonce => nonce + 1) }

  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {
      canvas.removeEventListener(EventType.Canvas, handleCanvas)
      canvas.removeEventListener(EventType.Duration, handleDuration)
      canvas.removeEventListener(EventType.Time, handleTime)
      canvas.removeEventListener(EventType.Track, handleTrack)
      canvas.removeEventListener(EventType.Selection, handleSelection)
      canvas.removeEventListener(EventType.Action, handleAction)
    }
    if (value) {
      value.addEventListener(EventType.Canvas, handleCanvas)
      value.addEventListener(EventType.Duration, handleDuration)
      value.addEventListener(EventType.Time, handleTime)
      value.addEventListener(EventType.Track, handleTrack)
      value.addEventListener(EventType.Selection, handleSelection)
      value.addEventListener(EventType.Action, handleAction)
      setCanvas(value)
    }
  }

  const editorContext: EditorContextInterface = {
    audioTracks,
    masher,
    previewReference,
    quantize,
    videoTracks,
    frame,
    frames,
    setFrame: changeFrame,
    selectedClipIdentifier,
    selectedEffectIdentifier,
    actionNonce,
  }

  React.useEffect(() => {
    const { current } = previewReference || {}
    if (current) {
      listenCanvas(canvas)
      masher.canvas = current
    }
    return () => { listenCanvas() }
  }, [])

  return (
    <EditorContext.Provider value={editorContext}>
      <View {...props} />
    </EditorContext.Provider>
  )
}

export { Editor }
