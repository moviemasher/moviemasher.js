import React from "react"
import { Identified, assertTrue, ClassSelected } from "@moviemasher/lib-core"


import { WithClassName } from "../../Types/Core"
import { PropsAndChild } from "../../Types/Props"
import { ActivityContext, assertActivityGroup } from "./ActivityContext"

export interface ActivityPickerProps extends PropsAndChild, WithClassName, Identified {}
/**
 * @parents ActivityContent
 */
 export function ActivityPicker(props: ActivityPickerProps) {
  const { id, className, children, ...rest } = props
  assertActivityGroup(id)

  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const activityContext = React.useContext(ActivityContext)
  const { picked, pick } = activityContext

  const classes: string[] = []
  if (className) classes.push(className)
  if (id === picked) classes.push(ClassSelected)

  const viewProps = {
    ...rest,
    className: classes.join(' '),
    key: `activity-picker-${id}`,
    onClick: () => pick(id)
  }

  return React.cloneElement(child, viewProps)
 }