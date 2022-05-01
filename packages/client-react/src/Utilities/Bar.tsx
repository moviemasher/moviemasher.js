import React from "react"
import { PropsWithoutChild, ReactResult, WithClassName } from "../declarations"
import { View } from "./View"

export interface BarOptions {
  props?: WithClassName
  before?: React.ReactChild[]
  after?: React.ReactChild[]
  content?: React.ReactChild | React.ReactChild[]
}

export interface BarProps extends BarOptions, PropsWithoutChild {}

export function Bar(props: BarProps): ReactResult {

  const { before, content, after, props: viewProps = {} } = props
  if (!(before || content || after)) return null

  const children = [before, content, after].filter(Boolean)

  viewProps.children = children
  return <View {...viewProps}/>
}
