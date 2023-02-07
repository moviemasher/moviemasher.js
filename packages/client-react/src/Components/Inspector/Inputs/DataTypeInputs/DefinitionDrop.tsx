import React from 'react'
import {
  assertMedia,
  Defined, isDefinitionType, assertPopulatedString, ClassDropping, DataType, 
  ContainerTypes, ContentTypes, assertTrue, eventStop, isContainerDefinition
} from '@moviemasher/moviemasher.js'

import { PropsAndChild, ReactResult, WithClassName } from '../../../../declarations'
import { View } from '../../../../Utilities/View'
import { InputContext } from '../InputContext'
import { DefinitionContext } from '../../../../Contexts/DefinitionContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'
import { DragDefinitionObject, dragType, dragTypes, dropType, TransferTypeFiles } from '../../../../Helpers/DragDrop'
import { DefinitionItem } from '../../../DefinitionItem/DefinitionItem'
import { propsDefinitionTypes } from '../../../../Utilities/Props'
import { MasherContext } from '../../../Masher/MasherContext'

export interface DefinitionDropProps extends WithClassName, PropsAndChild {
  type?: string
  types?: string | string[]
}

export function DefinitionDrop(props: DefinitionDropProps): ReactResult {
  const { type, types, children, className, ...rest } = props
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const [isOver, setIsOver] = React.useState(false)
  const inputContext = React.useContext(InputContext)
  const editorContext = React.useContext(MasherContext)
  const { drop } = editorContext
  const { changeHandler, value, name } = inputContext
  assertTrue(changeHandler)

  const definitionTypes = propsDefinitionTypes(type, types)

  const childNodes = (): React.ReactElement | null => {
    if (!value) return null

    assertPopulatedString(value)
    const definition = Defined.fromId(value)
    assertMedia(definition)

    const definitionProps = { definition, key: definition.id }
    const children = React.cloneElement(child, definitionProps)
    const contextProps = { children, value: { definition } }
    return <DefinitionContext.Provider {...contextProps} />
  }

  const dropAllowed = (event: DragEvent): boolean => {
    const { dataTransfer } = event
    assertTrue(dataTransfer)
    
    const types = dragTypes(dataTransfer)
    // any file can be dropped - we filter out invalid ones later
    if (types.includes(TransferTypeFiles)) return true

    const draggingType = dragType(dataTransfer)
    if (!isDefinitionType(draggingType)) return false

    return definitionTypes.includes(draggingType)
  }

  const onDragLeave = () => { setIsOver(false) }

  const onDragOver = (event: DragEvent) => {
    const allowed = dropAllowed(event)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDrop = async (event: DragEvent) => {
    eventStop(event)
    setIsOver(false)
    if (!dropAllowed(event)) return

    const { dataTransfer } = event
    assertTrue(dataTransfer)


    const types = dragTypes(dataTransfer)
    // any file can be dropped
    if (types.includes(TransferTypeFiles)) {
      await drop(dataTransfer.files).then(definitions => {
        if (!definitions.length) return

        const container = name === "containerId"
        const valid = container ? definitions.filter(isContainerDefinition) : definitions
        const [definition] = valid
        if (definition) {
          assertTrue(Defined.installed(definition.id), `${definition.type} installed`)
          // console.log("DefinitionDrop onDrop", definition.type, definition.label)
          changeHandler(name, definition.id)
        }
      })
      return
    }
    const type = dropType(dataTransfer)!
    const json = dataTransfer.getData(type)
    const data: DragDefinitionObject = JSON.parse(json)
    const { mediaObject } = data
    const [definition] = Defined.define(mediaObject)
    if (name === "containerId" && !isContainerDefinition(definition)) return

    changeHandler(name, mediaObject.id!)
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

DataTypeInputs[DataType.ContainerId] = (
  <DefinitionDrop types={ContainerTypes} className='definition-drop'>
    <DefinitionItem className='definition preview'/>
  </DefinitionDrop>
)

DataTypeInputs[DataType.ContentId] = (
  <DefinitionDrop types={ContentTypes} className='definition-drop'>
    <DefinitionItem className='definition preview' />
  </DefinitionDrop>
)
