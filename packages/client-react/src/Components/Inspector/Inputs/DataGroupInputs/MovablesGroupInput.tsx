import { 
  ClassDropping, SelectedMovable, DataGroup, Movable, 
  assertPopulatedObject, assertDefined, ScalarRecord
} from '@moviemasher/moviemasher.js'
import React from 'react'

import { PropsWithoutChild, ReactResult } from "../../../../declarations"
import { dropType } from '@moviemasher/client-core'
import { useEditor } from '../../../../Hooks/useEditor'
import { View } from '../../../../Utilities/View'
import { InspectorMovable, InspectorMovableProps } from '../../InspectorMovable'
import { InspectorProperties, InspectorPropertiesProps } from '../../InspectorProperties'
import { MasherContext } from '../../../Masher/MasherContext'
import { DataGroupInputs } from './DataGroupInputs'
import { Button } from '../../../../Utilities/Button'

export interface MovablesGroupInputProps extends PropsWithoutChild {
  selectedMovable?: SelectedMovable
  movableGenerator?: (object: ScalarRecord) => Movable
  property: string
}
/**
 *
 * @children InspectorEffect
 */
export function MovablesGroupInput(props: MovablesGroupInputProps): ReactResult {
  const { movableGenerator, selectedMovable, property, ...rest } = props
  assertPopulatedObject(selectedMovable)

  const editor = useEditor()
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

  const onClick: React.MouseEventHandler = () => { setSelected(null) }

  const childNodes = (): React.ReactElement[] => {
    return value.map((movable, index) => {
      const clipProps: InspectorMovableProps = {
        key: movable.id,
        selected: includedMovable, 
        select: setSelected,
        movable,
        index, removeHandler, property
      }
      return <InspectorMovable {...clipProps} />
    })
  }

  const listViewProps = {
    children: childNodes(),
    ref,
    onDragLeave,
    onDragOver,
    onDrop,
    onClick,
    key: 'view',
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
    <View { ...listViewProps } />, 
  ],
  }
  const listView = <View { ...viewProps } />
  if (!includedMovable) return listView

  const inspectorProps: InspectorPropertiesProps = {
    selectedItems: includedMovable.selectedItems(editor.actions),
    key: 'movable-properties',
  }
  return <>
    {listView}
    <InspectorProperties { ...inspectorProps }/>
  </>
}

DataGroupInputs[DataGroup.Effects] = <MovablesGroupInput property="effect" key="effects-group-input" />
// DataGroupInputs[DataGroup.Controls] = <MovablesGroupInput movableGenerator={controlInstance} property="control" key="controls-group-input" />