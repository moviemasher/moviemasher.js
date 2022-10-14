import React from "react"
import { AndId, assertTrue, ClassSelected } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { Problems } from "../../Setup/Problems"
import { ActivityContext, assertActivityGroup } from "./ActivityContext"

export interface ActivityPickerProps extends PropsAndChild, WithClassName, AndId {}
/**
 * @parents ActivityContent
 */
 export function ActivityPicker(props: ActivityPickerProps): ReactResult {
  const { id, className, children, ...rest } = props
  assertActivityGroup(id)

  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child), Problems.child)

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