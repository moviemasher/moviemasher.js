import React from 'react'
import { Definition, UnknownObject, urlForEndpoint } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from '../../declarations'
import { EditorContext } from '../../Contexts/EditorContext'
import { BrowserContext } from '../../Contexts/BrowserContext'
import { Problems } from '../../Setup/Problems'
import { DragSuffix, DragType } from '../../Helpers/DragDrop'

export interface BrowserDefinitionProps extends WithClassName, PropsAndChild {
  definition: Definition
  label?: string
  icon?: string
}

/**
 * @parents BrowserContent
 */
export function BrowserDefinition(props: BrowserDefinitionProps): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const browserContext = React.useContext(BrowserContext)
  const editorContext = React.useContext(EditorContext)
  const { editor, selectedClass } = editorContext
  if (!editor) return null

  const { icon: iconVar, label: labelVar, children, definition } = props
  const { definitionId, setDefinitionId } = browserContext
  const { id, label, icon } = definition
  const labelOrId = label || id

  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

  const classNamesState = () => {
    const classes = []
    const { className } = child.props
    if (className) classes.push(className)
    if (definitionId === id) classes.push(selectedClass)
    return classes.join(' ')
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
  if (labelVar) style[labelVar] = `'${labelOrId.replaceAll("'", "\\'")}'`
  if (iconVar && icon) {
    const { preloader } = editor
    const url = urlForEndpoint(preloader.endpoint, icon)
    style[iconVar] = `url('${url}')`
  }

  const className = React.useMemo(classNamesState, [definitionId])
  const clipProps = {
    ...child.props,
    style,
    className,
    onDragStart,
    onMouseDown,
    draggable: true,
    ref,
  }
  return React.cloneElement(child, clipProps)
}
