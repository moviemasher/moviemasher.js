import React, { useContext } from 'react'
import { EventType } from '@moviemasher/moviemasher.js'
import { Panel } from '../../declarations'

import { View } from '../../Utilities/View'
import { PlayerContext, PlayerContextInterface } from './PlayerContext'
import { EditorContext } from '../Editor/EditorContext'

const PlayerPanel: Panel = props => {

  const appContext = useContext(EditorContext)
  const { masher, previewReference } = appContext
  if (!masher) throw 'No Masher'

  const [paused, setPaused] = React.useState(masher.paused)
  const [volume, setVolume] = React.useState(masher.volume)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)

  const changePaused = (value: boolean) => { masher.paused = value }
  const changeVolume = (value: number) => { masher.volume = value }

  const handleVolume = () => { setVolume(masher.volume) }
  const handlePaused = () => { setPaused(masher.paused) }

  const listenCanvas = (value?: HTMLCanvasElement) => {
    if (canvas) {
      canvas.removeEventListener(EventType.Pause, handlePaused)
      canvas.removeEventListener(EventType.Play, handlePaused)
      canvas.removeEventListener(EventType.Volume, handleVolume)
    }
    if (value) {
      value.addEventListener(EventType.Pause, handlePaused)
      value.addEventListener(EventType.Play, handlePaused)
      value.addEventListener(EventType.Volume, handleVolume)
      setCanvas(value)
    }
  }

  React.useEffect(() => {
    const { current: currentPreview } = previewReference || {}
    if (currentPreview) listenCanvas(currentPreview)
    return () => { listenCanvas() }
  }, [])

  const playerContext: PlayerContextInterface = {
    paused,
    setPaused: changePaused,
    setVolume: changeVolume,
    volume,
  }

  return (
    <PlayerContext.Provider value={playerContext}>
      <View {...props}/>
    </PlayerContext.Provider>
  )
}

export { PlayerPanel }
