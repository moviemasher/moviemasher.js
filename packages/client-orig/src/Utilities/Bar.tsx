import { isArray } from "@moviemasher/moviemasher.js"
import React from "react"
import { JsxChildren, JsxChilds, JsxElements } from "../Types/Element"
import { PropsWithoutChild } from "../Types/Props"
import { View, ViewProps } from "./View"

export interface BarOptions {
  props?: ViewProps
  before?: JsxElements
  after?: JsxElements
  content?: JsxElements
}

export interface BarProps extends BarOptions, PropsWithoutChild {}

export function Bar(props: BarProps) {
  const { before, content, after, props: viewProps = {} } = props
  if (!(before || content || after)) return null

  const children: JsxChildren = []
  if (before) children.push(...before)
  if (content) {
    if (isArray(content)) children.push(...content)
    else children.push(content)
  }
  if (after) children.push(...after)

  return <View {...viewProps}>
    {children}
  </View>
}
