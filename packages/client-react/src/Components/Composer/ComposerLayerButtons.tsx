
import React from "react"
import { isMoveAction, eventStop, EventType, isActionEvent, isChangeAction, isLayerMash, LayerType, Control, isControl, ClassButton, UnknownObject, ClassDisabled } from "@moviemasher/moviemasher.js"

import { ListenerCallback, PropsAndChildren, ReactResult } from "../../declarations"
import { useLayer } from "../../Hooks/useLayer"
import { MasherContext } from "../Masher/MasherContext"
import { View } from "../../Utilities/View"
import { Button, ButtonProps } from "../../Utilities/Button"
import { useListeners } from "../../Hooks/useListeners"
import { useEditor } from "../../Hooks/useEditor"
import { ComposerContext } from "./ComposerContext"
import { useRefresh } from "../../Hooks/useRefresh"

export interface ComposerLayerButtonsProps {

}
/**
 * @parents ComposerContent
 * @children ComposerLayerFolder, ComposerLayerMash, ComposerFolderClose, ComposerFolderOpen, ComposerDepth, ComposerLayerLabel
 */
 export function ComposerLayerButtons(props: ComposerLayerButtonsProps): ReactResult {
  
  const composerContext = React.useContext(ComposerContext)
  const masherContext = React.useContext(MasherContext)

  const { icons, streaming } = masherContext
  const { compose } = composerContext
  const [refresh] = useRefresh()

  
  const layer = useLayer()
  const isMash = isLayerMash(layer)
  const controls = isMash ? layer.mash.controls : []

  const handleAction: ListenerCallback = event => {
    if (!isActionEvent(event)) return

    const { action } = event.detail
    if (isChangeAction(action)) {
      const { target } = action
      if (isControl(target) && controls.includes(target)) refresh()
    } else if (isMoveAction(action)) {
      const { objects } = action
      if (objects === controls) refresh()
    } 
  }

  useListeners({ [EventType.Action]: handleAction })

  const viewChildren = []

  if (isMash) {
    viewChildren.push(...controls.map(control => {
      const { frame, frames, icon, label } = control
      const iconElement = icons[icon]
      const buttonChildren = []
      if (label) buttonChildren.push(label)
      if (iconElement) buttonChildren.push(iconElement)
          
      const buttonProps: ButtonProps = {
        key: `${icon}-button-${label}`,
        children: buttonChildren, 
      }
      
      buttonProps.onPointerDown = (event: React.PointerEvent): void => {
        event.stopPropagation()
        // eventStop(event.nativeEvent)
        compose(layer, frame, frames)
      }
      return <Button { ...buttonProps } />
    }))
  }
  if (layer.cached) {
    viewChildren.push(icons.streamCached)
  } else {
    const cacheClasses = [ClassButton]
    const cacheProps: UnknownObject = {
      key: 'cache-button',
      children: icons.streamUncached,
    }
  
    if (streaming) {
      cacheProps.onPointerDown = (event: React.PointerEvent): void => {
        event.stopPropagation()
        // TODO: call a method in Composer instead
        layer.cache() 
      }
    } else cacheClasses.push(ClassDisabled)
    cacheProps.className = cacheClasses.join(' ')
    viewChildren.push(<View { ...cacheProps } />)
  }
  const viewProps = {
    className: 'controls',
    children: viewChildren
  }
  return <View { ...viewProps } />

 }