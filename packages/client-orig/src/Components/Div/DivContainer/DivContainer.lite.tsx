import React from 'react'

import type { PropsWithChildren } from "../../../Types/Props"

export default function DivContainer(props: PropsWithChildren) {
  return <div className={props.className}>{props.children}</div>
}