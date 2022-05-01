import React from 'react'
import { Definition, UnknownObject, urlForEndpoint } from "@moviemasher/moviemasher.js"
import { BrowserContext } from '../../Contexts/BrowserContext'
import { DragSuffix } from '../../Setup/Constants'
import { PropsAndChild, ReactResult, WithClassName } from '../../declarations'
import { useMashEditor } from '../../Hooks'


export interface BrowserDefinitionProps extends WithClassName, PropsAndChild {
  definition: Definition
  selectClass?: string
  label?: string
  icon?: string
}


/**
 * @parents BrowserContent
 */
export function BrowserDefinition(props: BrowserDefinitionProps): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const browserContext = React.useContext(BrowserContext)
  const mashEditor = useMashEditor()
  const [clickOffset, setClickOffset] = React.useState(0)

  const { icon: iconVar, label: labelVar, children, selectClass, definition, ...rest } = props
  const { definitionId, setDefinitionId } = browserContext
  const { id, label, icon } = definition
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
    dataTransfer.setData(definition.type + DragSuffix, json)
  }

  const style: UnknownObject = {}
  if (labelVar) style[labelVar] = `'${labelOrId.replaceAll("'", "\\'")}'`
  if (iconVar && icon) {
    const { preloader } = mashEditor
    const url = urlForEndpoint(preloader.endpoint, icon)
    style[iconVar] = `url('${url}')`
  }

  const clipProps = {
    ...kid.props,
    style,
    className: classNamesState(),
    onDragStart,
    onMouseDown,
    // onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
    ref,
  }
  return React.cloneElement(kid, clipProps)
}
