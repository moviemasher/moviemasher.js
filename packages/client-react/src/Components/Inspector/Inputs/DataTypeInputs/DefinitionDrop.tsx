import React from 'react'
import {
  assertDefinition,
  Defined, isDefinitionType, assertPopulatedString, ClassDropping, DataType, 
  ContainerTypes, ContentTypes, assertTrue, eventStop
} from '@moviemasher/moviemasher.js'

import { PropsAndChild, ReactResult, WithClassName } from '../../../../declarations'
import { View } from '../../../../Utilities/View'
import { InputContext } from '../InputContext'
import { DefinitionContext } from '../../../../Contexts/DefinitionContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'
import { DragDefinitionObject, dragType, dragTypes, dropType, TransferTypeFiles } from '../../../../Helpers/DragDrop'
import { BrowserDefinition } from '../../../Browser/BrowserDefinition'
import { propsDefinitionTypes } from '../../../../Utilities/Props'
import { EditorContext } from '../../../../Contexts/EditorContext'

export interface DefinitionDropProps extends WithClassName, PropsAndChild {
  type?: string
  types?: string | string[]
}

export function DefinitionDrop(props: DefinitionDropProps): ReactResult {
  const { type, types, children, className, ...rest } = props
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const inputContext = React.useContext(InputContext)
  const editorContext = React.useContext(EditorContext)
  const { dropFiles } = editorContext
  const [isOver, setIsOver] = React.useState(false)
  const { changeHandler, value, name } = inputContext
  assertTrue(changeHandler)

  const definitionTypes = propsDefinitionTypes(type, types)

  const childNodes = (): React.ReactElement | null => {
    if (!value) return null

    assertPopulatedString(value)
    const definition = Defined.fromId(value)
    assertDefinition(definition)

    const definitionProps = { definition, key: definition.id }
    const children = React.cloneElement(child, definitionProps)
    const contextProps = { children, value: { definition } }
    return <DefinitionContext.Provider {...contextProps} />
  }

  const dropAllowed = (event: DragEvent): boolean => {
    const { dataTransfer } = event
    assertTrue(dataTransfer)
    
    const types = dragTypes(dataTransfer)
    // any file can be dropped
    if (types.includes(TransferTypeFiles)) {
      // console.log("DefinitionDrop dropAllowed FILE", name)
      return true
    }

    const draggingType = dragType(dataTransfer)
    if (!isDefinitionType(draggingType)) return false


    // console.log("DefinitionDrop dropAllowed", name, draggingType, definitionTypes)
    return definitionTypes.includes(draggingType)

  }

  const onDragLeave = () => { setIsOver(false) }

  const onDragOver = (event: DragEvent) => {
    const allowed = dropAllowed(event)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDrop = (event: DragEvent) => {
    eventStop(event)
    setIsOver(false)
    if (!dropAllowed(event)) return

    const { dataTransfer } = event
    assertTrue(dataTransfer)

    const types = dragTypes(dataTransfer)
    // any file can be dropped
    if (types.includes(TransferTypeFiles)) {
      const { files } = dataTransfer
      // console.log("DefinitionDrop onDrop dropped files", name, files)
      dropFiles(files).then(definitions => {
        const [definition] = definitions
        if (!definition) return
        // console.log("DefinitionDrop dropped file", name, definition.type, definition.id)
        changeHandler(name, definition.id)
      })
      return
    }
    const type = dropType(dataTransfer)!
    const json = dataTransfer.getData(type)
    const data: DragDefinitionObject = JSON.parse(json)
    const { definitionObject } = data
    Defined.define(definitionObject)
    changeHandler(name, definitionObject.id!)
  }

  const calculateClassName = (): string => {
    const classes = []
    if (className) classes.push(className)
    if (isOver) classes.push(ClassDropping)
    return classes.join(' ')
  }

  const memoClassName = React.useMemo(calculateClassName, [isOver])

  const viewProps = {
    ...rest,
    className: memoClassName,
    children: childNodes(),
    onDragLeave,
    onDragOver,
    onDrop,
    value: String(value),
    key: `${name}-drop`,
  }
  return <View {...viewProps} />
}

DataTypeInputs[DataType.ContainerId] = <DefinitionDrop types={ContainerTypes} className='definition-drop'>
  <BrowserDefinition className='definition' icon="--clip-icon" />
</DefinitionDrop>

DataTypeInputs[DataType.ContentId] = <DefinitionDrop types={ContentTypes} className='definition-drop'>
  <BrowserDefinition className='definition' icon="--clip-icon" />
</DefinitionDrop>
