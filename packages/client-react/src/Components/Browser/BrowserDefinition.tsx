import React from 'react'
import { ClassSelected, UnknownObject, urlForEndpoint } from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { BrowserContext } from './BrowserContext'
import { DragSuffix } from '../../Helpers/DragDrop'
import { useEditor } from '../../Hooks/useEditor'
import { useDefinition } from '../../Hooks/useDefinition'
import { View } from '../../Utilities/View'

export interface BrowserDefinitionProps extends WithClassName, PropsWithoutChild {
  label?: string
  icon?: string
}

/**
 * @parents BrowserContent, DefinitionDrop
 */
export function BrowserDefinition(props: BrowserDefinitionProps): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const browserContext = React.useContext(BrowserContext)
  const editor = useEditor()

  const definition = useDefinition()

  const { icon: iconVar, className } = props
  const { definitionId, changeDefinitionId: setDefinitionId } = browserContext
  const { id, label, icon } = definition

  const children = () => {
    return <label>{label}</label>
  }

  const onMouseDown = () => { setDefinitionId(id) }

  const onDragStart: React.DragEventHandler = event => {
    onMouseDown()
    const rect = ref.current!.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    const data = { offset: clientX - left, definitionObject: definition }
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    dataTransfer.effectAllowed = 'copy'
    dataTransfer.setData(definition.type + DragSuffix, json)
  }

  const style: UnknownObject = {}
  if (iconVar && icon) {
    const { preloader } = editor
    const url = urlForEndpoint(preloader.endpoint, icon)
    style[iconVar] = `url('${url}')`
  }

  const calculateClassName = () => {
    const classes = []
    if (className) classes.push(className)
    if (definitionId === id) classes.push(ClassSelected)
    return classes.join(' ')
  }

  const memoClassName = React.useMemo(calculateClassName, [definitionId])

  const clipProps = {
    children: children(),
    style,
    className: memoClassName,
    onDragStart,
    onMouseDown,
    draggable: true,
    ref,
    key: id,
  }
  return <View {...clipProps}/>
}
