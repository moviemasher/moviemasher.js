import React from "react"
import { 
  assertTrue, ClassDropping, ClassSelected, eventStop 
} from "@moviemasher/moviemasher.js"

import { WithClassName, ReactResult, PropsAndChild } from "../../declarations"
import { View } from "../../Utilities/View"
import { BrowserContext } from "./BrowserContext"
import { DefinitionContext } from "../../Contexts/DefinitionContext"
import { dragTypes, TransferTypeFiles } from "../../Helpers/DragDrop"
import { EditorContext } from "../Masher/EditorContext"

export interface BrowserContentProps extends WithClassName, PropsAndChild {}

/**
 * @parents Browser
 * @children BrowserSource
 */
export function BrowserContent(props: BrowserContentProps): ReactResult {
  const [over, setOver] = React.useState(false)
  const { className, children, ...rest } = props
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))
  
  const editorContext = React.useContext(EditorContext)
  const browserContext = React.useContext(BrowserContext)
  const definitions = browserContext.definitions || []
  const { dropFiles } = editorContext



  const dragValid = (dataTransfer?: DataTransfer | null): boolean => {
    if (!dataTransfer) return false

    return dragTypes(dataTransfer).includes(TransferTypeFiles)
  }

  const onDrop = (event: DragEvent): void => {
    onDragLeave(event)
    const { dataTransfer } = event
    if (!(dataTransfer && dragValid(dataTransfer))) return 

    const { files } = dataTransfer
    dropFiles(files)
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
    const childProps = child.props
    return definitions.map(definition => {
      const cloneProps = { ...childProps, key: definition.id }
      const children = React.cloneElement(child, cloneProps)
      const contextProps = { children, value: { definition }, key: definition.id }
      const context = <DefinitionContext.Provider { ...contextProps } />
      return context
    })
  }

  const viewProps = {
    ...rest, 
    className: classes.join(' '),
    key: `browser-content`,
    children: childNodes(), 
    onDrop, onDragOver, onDragLeave,

  }
  return <View {...viewProps} />
}
