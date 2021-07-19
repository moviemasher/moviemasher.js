import React, { useEffect, useRef, ReactElement } from 'react'
import { View } from '../View'
import { CanvasView } from '../CanvasView'
import { SliderChangeHandler } from "../declarations"

interface PlayerNodesPaused {
  play: ReactElement
  pause: ReactElement
  control : ReactElement
}

interface PlayerNodesVolume {
  volume : ReactElement
  mute : ReactElement
  control : ReactElement
}

interface PlayerNodesFrame {
  control : ReactElement
}

interface PlayerObject {
  changeCanvas : (value? : HTMLCanvasElement) => void
  controls? : {
    paused? : {
      value : boolean
      setter: (value : boolean) => void
      nodes: PlayerNodesPaused
    }
    frame? : {
      value : number
      fps : number
      frames : number
      setter : (value : number) => void
      nodes : PlayerNodesFrame
    }
    volume? : {
      value : number
      setter : (value : number) => void
      nodes : PlayerNodesVolume
    }
  }
}

const Player : React.FC<PlayerObject> = (props) => {

  const { controls, changeCanvas } = props
  const reference = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (reference.current) changeCanvas(reference.current)
    else console.error("Player canvas reference not current")
  }, [])
  const nodes : ReactElement[] = []
  nodes.push(<CanvasView key='canvas' ref={reference} />)
  if (controls) {
    const { paused, frame, volume } = controls
    const controlNodes = []
    if (paused) {
      const handleChangePaused = () => {
        paused.setter(!paused.value)
      }
      const pausedOptions = {
        key: 'paused',
        className: 'moviemasher-paused moviemasher-button',
        onClick: handleChangePaused,
        children: paused.value ? paused.nodes.play : paused.nodes.pause
      }
      controlNodes.push(React.cloneElement(paused.nodes.control, pausedOptions))
    }
    if (frame) {
      const handleChangeFrame : SliderChangeHandler = (_event, value) => {
        const number = typeof value === "number" ? value : value[0]
        frame.setter(number)
      }
      const frameOptions = {
        key: 'frame',
        value: frame.value,
        min: 0,
        max: frame.frames,
        className: 'moviemasher-frame moviemasher-slider',
        step: 1,
        onChange: handleChangeFrame,
      }
      controlNodes.push(React.cloneElement(frame.nodes.control, frameOptions))
    }
    if (volume) {

    }
    nodes.push(<View key='controls' className='moviemasher-controls' children={controlNodes} />)
  }
  return <View className='moviemasher-panel moviemasher-player' children={nodes} />
}

export { Player, PlayerObject, PlayerNodesPaused, PlayerNodesVolume, PlayerNodesFrame }
