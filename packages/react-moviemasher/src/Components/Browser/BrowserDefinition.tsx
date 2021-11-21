import React from 'react'
import { Definition, UnknownObject } from "@moviemasher/moviemasher.js"
import { BrowserContext } from './BrowserContext'
import { DragTypeSuffix } from '../../Setup/Constants'


interface BrowserDefinitionProps extends UnknownObject {
  definition: Definition
  children: React.ReactElement
  selectClass?: string
  label? : string
}

const BrowserDefinition: React.FunctionComponent<BrowserDefinitionProps> = props => {
  const ref = React.useRef<HTMLDivElement>(null)
  const browserContext = React.useContext(BrowserContext)
  const [clickOffset, setClickOffset] = React.useState(0)

  const { label: labelVar, children, selectClass, definition, ...rest } = props
  const { definitionId, setDefinitionId } = browserContext
  const { id, label } = definition
  const labelOrId = label || id

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `BrowserDefinition expects single child element`

  const classNamesState = () => {
    const classes = []
    const { className } = kid.props
    if (className) classes.push(className)
    if (selectClass && definitionId === id) classes.push(selectClass)
    return classes.join(' ')
  }

  const onMouseDown = (event: React.MouseEvent) => {
    // console.log("onMouseDown")
    const { current } = ref
    if (!current) return

    const rect = current.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    setClickOffset(clientX - left)
    setDefinitionId(id)
  }

  const onDragStart: React.DragEventHandler = event => {
    // console.log("onDragStart")
    onMouseDown(event)
    const data = { offset: clickOffset, definition }
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    dataTransfer.effectAllowed = 'copy'
    dataTransfer.setData(definition.type + DragTypeSuffix, json)
  }

  const style: UnknownObject = {}
  if (labelVar) style[labelVar] = `'${labelOrId.replace("'", "\\'")}'`

  const clipProps = {
    ...kid.props,
    style,
    className: classNamesState(),
    onDragStart,
    onMouseDown,
    draggable: true,
    ref,
  }
  return React.cloneElement(kid, clipProps)
}

export { BrowserDefinition }
