import React from "react"
import { PropsWithoutChild, ReactResult } from "../declarations"
import { View } from "./View"

interface BarOptions {
  className?: string
  before?: React.ReactChild
  after?: React.ReactChild
  content?: React.ReactChild | React.ReactChild[]
}

interface BarProps extends BarOptions, PropsWithoutChild {}

function Bar(props: BarProps): ReactResult {

  const { before, content, after, ...rest } = props
  if (!(before || content || after)) return null

  const children = [before, content, after].filter(Boolean)

  const viewProps = { ...rest, children }
  return <View {...viewProps}/>
}

export { Bar, BarProps, BarOptions }
