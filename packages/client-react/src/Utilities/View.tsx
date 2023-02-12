import React from 'react'
import { UnknownRecord } from '@moviemasher/moviemasher.js'

export const View = React.forwardRef<HTMLDivElement, UnknownRecord>((props, ref) =>
  <div ref={ref} {...props} />
)
