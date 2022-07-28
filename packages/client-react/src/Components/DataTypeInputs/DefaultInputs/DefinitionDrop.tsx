import React from 'react'
import {
  Defined, isDefinitionType, assertPopulatedString, ClassDropping, DataType, ContainerTypes, ContentTypes, assertTrue
} from '@moviemasher/moviemasher.js'
import { PropsAndChild, ReactResult, WithClassName } from '../../../declarations'
import { Problems } from '../../../Setup/Problems'
import { View } from '../../../Utilities/View'
import { InputContext } from '../../../Contexts/InputContext'
import { DefinitionContext } from '../../../Contexts/DefinitionContext'
import { DataTypeInputs } from '../DataTypeInputs'
import { DragDefinitionObject, dragType, dropType } from '../../../Helpers/DragDrop'
import { BrowserDefinition } from '../../Browser/BrowserDefinition'
import { propsDefinitionTypes } from '../../../Utilities/Props'

export interface DefinitionDropProps extends WithClassName, PropsAndChild {
  type?: string
  types?: string | string[]
}

export function DefinitionDrop(props: DefinitionDropProps): ReactResult {
  const { type, types, children, className, ...rest } = props
  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

  const inputContext = React.useContext(InputContext)

  const [isOver, setIsOver] = React.useState(false)

  const { changeHandler, value, name } = inputContext
  assertTrue(changeHandler)

  const definitionTypes = propsDefinitionTypes(type, types)

  const childNodes = (): React.ReactElement | null => {
    if (!value) return null

    assertPopulatedString(value)
    const definition = Defined.fromId(value)
    if (!definition) {
      console.trace("DefinitionDrop childNodes could not find definition", value)
    }
    const definitionProps = { definition, key: definition.id }
    const children = React.cloneElement(child, definitionProps)
    const contextProps = { children, value: { definition } }
    const context = <DefinitionContext.Provider {...contextProps} />
    return context
  }

  const dropAllowed = (event: React.DragEvent): boolean => {
    const { dataTransfer } = event
    const draggingType = dragType(dataTransfer)
    if (!isDefinitionType(draggingType)) return false

    return definitionTypes.includes(draggingType)

  }

  const onDragLeave: React.DragEventHandler = () => { setIsOver(false) }

  const onDragOver: React.DragEventHandler = event => {
    const allowed = dropAllowed(event)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDrop: React.DragEventHandler = event => {
    event.preventDefault()
    setIsOver(false)
    if (!dropAllowed(event)) return

    const { dataTransfer } = event
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
    key: `${name}-select`,
  }
  return <View {...viewProps} />
}

DataTypeInputs[DataType.ContainerId] = <DefinitionDrop types={ContainerTypes} className='definition-drop'>
  <BrowserDefinition className='definition' />
</DefinitionDrop>

DataTypeInputs[DataType.ContentId] = <DefinitionDrop types={ContentTypes} className='definition-drop'>
  <BrowserDefinition className='definition' />
</DefinitionDrop>
