import React, { useState, ReactElement } from 'react'
import { Definition, Definitions, DefinitionType } from '@moviemasher/moviemasher.js'
import { View } from '../View'
import { DefinitionView } from '../DefinitionView';

type BrowserSourceObject = Partial <Record<DefinitionType, Definition[]>>
interface BrowserNodesType {
  audio? : ReactElement
  effect? : ReactElement
  image? : ReactElement
  theme? : ReactElement
  transition? : ReactElement
  video? : ReactElement
}

interface BrowserObject {
  controls : {
    type?: BrowserNodesType
  }
  selected? : DefinitionType
  sources? : BrowserSourceObject
}

const Browser : React.FC<BrowserObject> = (props) => {
  const nodes = []

  const { controls, sources } = props
  const { type } = controls
  const sourcesByType = sources || {} as BrowserSourceObject
  const selected = props.selected || (type ? Object.keys(type)[0] as DefinitionType : DefinitionType.Theme)
  const [selectedElement, setSelectedElement] = useState(selected)
  const source = sourcesByType[selectedElement] || Definitions.byType(selectedElement)

  if (type) {
    const className = (type : DefinitionType) : string => {
      const classes = [`moviemasher-${type}`, 'moviemasher-button']
      if (type === selectedElement) classes.push('moviemasher-selected')
      return classes.join(' ')
    }
    const handleClick = (type : DefinitionType)  => () => setSelectedElement(type)

    const controlNodes = []
    const { audio, effect, image, theme, transition, video } = type

      const controlNode = (type : DefinitionType, element : ReactElement) => {
        const options = {
          className: className(type),
          onClick: handleClick(type),
          key: String(type),
        }
        return React.cloneElement(element, options)
      }

    if (audio) controlNodes.push(controlNode(DefinitionType.Audio, audio))
    if (effect) controlNodes.push(controlNode(DefinitionType.Effect, effect))
    if (image) controlNodes.push(controlNode(DefinitionType.Image, image))
    if (theme) controlNodes.push(controlNode(DefinitionType.Theme, theme))
    if (transition) controlNodes.push(controlNode(DefinitionType.Transition, transition))
    if (video) controlNodes.push(controlNode(DefinitionType.Video, video))

    nodes.push(<View key='controls' className='moviemasher-controls' children={controlNodes}/>)
  }

  const definitionNodes = source.map(definition => <DefinitionView key={definition.id} definition={definition} />)
  nodes.push(<View key='content' className='moviemasher-content' children={definitionNodes} />)
  return <View className='moviemasher-panel moviemasher-browser' children={nodes} />
}

export { Browser, BrowserObject, BrowserNodesType }
