import { 
  ClassDropping, SelectedMovable, DataGroup, Movable, 
  assertPopulatedObject, assertDefined, ScalarRecord, DataGroupEffects
} from '@moviemasher/lib-core'
import React from 'react'

import { JsxElements } from "../../../../Types/Element"
import { dropType } from '@moviemasher/client-core'
import { useMasher } from '../../../../Hooks/useMasher'
import { View } from '../../../../Utilities/View'
import { InspectorMovable, InspectorMovableProps } from '../../InspectorMovable'
import { InspectorProperties, InspectorPropertiesProps } from '../../InspectorProperties'
import MasherContext from '../../../Masher/MasherContext'
import { DataGroupInputs } from './DataGroupInputs'
import Button from '../../../Button/Button'
import { PropsWithoutChild } from '../../../../Types/Props'

export interface MovablesGroupInputProps extends PropsWithoutChild {
  selectedMovable?: SelectedMovable
  movableGenerator?: (object: ScalarRecord) => Movable
  property: string
}
/**
 *
 * @children InspectorEffect
 */
export function MovablesGroupInput(props: MovablesGroupInputProps) {
  const { movableGenerator, selectedMovable, property, ...rest } = props
  assertPopulatedObject(selectedMovable)

  const editor = useMasher()
  const masherContext = React.useContext(MasherContext)
  const [isOver, setIsOver] = React.useState(false)
  const [selected, setSelected] = React.useState<Movable | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)

  const memoClassName = React.useMemo((): string => {
    const classes = ['list']
    if (isOver) classes.push(ClassDropping)
    return classes.join(' ')
  }, [isOver])

  const { icons } = masherContext
  const { value, addHandler, removeHandler, moveHandler } = selectedMovable
  const includedMovable = (selected && value.includes(selected)) ? selected : null
  if (includedMovable !== selected) setSelected(includedMovable)

  const dropIndex = (event: DragEvent): number => {
    const { target } = event
    if (target && target instanceof HTMLDivElement) {
      const index = target.getAttribute('index')
      if (index) return Number(index)
    }
    return value.length
  }

  const dropAllowed = (event: DragEvent): boolean => (
    !!dropType(event.dataTransfer)?.startsWith(property)
  )

  const onDragLeave = () => { setIsOver(false) }

  const onDragOver = (event: DragEvent) => {
    const allowed = dropAllowed(event)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDrop = (event: DragEvent) => {
    setIsOver(false)
    if (!dropAllowed(event)) return

    event.preventDefault()
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    const type = dropType(dataTransfer)!
    const json = dataTransfer.getData(type)
    const data = JSON.parse(json)
    const { index } = data
    const droppedIndex = dropIndex(event)

    if (droppedIndex === index) return

    assertDefined(includedMovable)
    moveHandler(includedMovable, droppedIndex)
  }

  const onClick = () => { setSelected(null) }

  const childNodes = (): JsxElements => {
    return value.map((movable, index) => {
      const clipProps: InspectorMovableProps = {
        selected: includedMovable, 
        select: setSelected,
        movable,
        index, removeHandler, property
      }
      return <InspectorMovable key={movable.id} {...clipProps} />
    })
  }

  const listViewProps = {
    children: childNodes(),
    ref,
    onDragLeave,
    onDragOver,
    onDrop,
    onClick,
    className: memoClassName,
  }

  const removeProps = {
    disabled: !includedMovable,
    onClick: () => { removeHandler(includedMovable!) },
    key: "remove-button",
    children: icons.remove,
  }
  const viewChildren = [
    icons[property],
    <Button { ...removeProps } />,
  ]
  if (movableGenerator) {
    const addProps = {
      key: "add-button",
      children: icons.add,
      onClick: () => { addHandler(movableGenerator({})) }
    }
    viewChildren.push(<Button { ...addProps } />)
  }

  const iconsViewProps = {
    className: 'icons',
    children: viewChildren,
    key: 'icons',
  }

  const viewProps = {
    ...rest,
    key: `${property}s-view`,
    className: "row",
    children: [
    <View { ...iconsViewProps } />, 
    <View key='view' { ...listViewProps } />, 
  ],
  }
  const listView = <View { ...viewProps } />
  if (!includedMovable) return listView

  const inspectorProps: InspectorPropertiesProps = {
    selectedItems: includedMovable.selectedItems(editor.actions),
    
  }
  return <>
    {listView}
    <InspectorProperties key='movable-properties' { ...inspectorProps }/>
  </>
}

DataGroupInputs[DataGroupEffects] = <MovablesGroupInput property="effect" key="effects-group-input" />
// DataGroupInputs[DataGroupControls] = <MovablesGroupInput movableGenerator={controlInstance} property="control" key="controls-group-input" />