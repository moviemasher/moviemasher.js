import React from "react"
import { 
  assertTrue, ClassDropping, eventStop
} from "@moviemasher/moviemasher.js"


import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { View } from "../../Utilities/View"
import { BrowserContext } from "./BrowserContext"
import { DefinitionContext } from "../../Contexts/DefinitionContext"
import MasherContext from "../Masher/MasherContext"
import { dragTypes, TransferTypeFiles } from "@moviemasher/client-core"
import { DefinitionItem } from "../DefinitionItem/DefinitionItem"
import { useContext } from "../../Framework/FrameworkFunctions"

export interface BrowserContentProps extends WithClassName, PropsWithoutChild {}

/**
 * @parents Browser
 * @children BrowserSource
 */
export function BrowserContent(props: BrowserContentProps) {
  const [over, setOver] = React.useState(false)
  const { className, ...rest } = props

  const masherContext = useContext(MasherContext)
  const browserContext = useContext(BrowserContext)
  const definitions = browserContext.definitions || []
  const { drop } = masherContext

  const dragValid = (dataTransfer?: DataTransfer | null): dataTransfer is DataTransfer => {
    if (!dataTransfer) return false

    return dragTypes(dataTransfer).includes(TransferTypeFiles)
  }

  const onDrop = (event: DragEvent): void => {
    onDragLeave(event)
    const { dataTransfer } = event
    if (dragValid(dataTransfer)) drop(dataTransfer.files)
  } 

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    setOver(dragValid(event.dataTransfer))
  }

  const onDragLeave = (event: DragEvent): void => {
    eventStop(event)
    setOver(false)
  }

  const classes: string[] = []
  if (className) classes.push(className)
  if (over) classes.push(ClassDropping)
  
  
  const childNodes = () => {
    return definitions.map(definition => {
      const clone = <DefinitionItem draggable={true} key={definition.id} className='definition preview' />

      const contextProps = { 
        children: clone, value: { definition }, key: definition.id 
      }
      const context = <DefinitionContext.Provider { ...contextProps } />
      return context
    })
  }

  const viewProps = {

    
    onDrop, onDragOver, onDragLeave,
  }
  return <View key='browser-content'
    className={classes.join(' ')}
  
  >{childNodes()}</View>
}
