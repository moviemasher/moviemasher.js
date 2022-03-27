import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'

const View = React.forwardRef<HTMLDivElement, UnknownObject>((props, ref) =>
  <div ref={ref} {...props} />
)

export { View }
