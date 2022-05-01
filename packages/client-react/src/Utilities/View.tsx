import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'

export const View = React.forwardRef<HTMLDivElement, UnknownObject>((props, ref) =>
  <div ref={ref} {...props} />
)
