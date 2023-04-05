import React from 'react'

import type { PropsWithChildren } from "../../../Types/Props"

export default function SpanContainer(props: PropsWithChildren) {
  return <span className={props.className}>{props.children}</span>
}