import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'

interface ViewProps extends UnknownObject {
  className?: string
  key? : string
  onClick? : (event : React.MouseEvent<HTMLDivElement>) => void
  children?: React.ReactNode
}

const View = React.forwardRef<HTMLDivElement, ViewProps>((props, ref) =>
  <div ref={ref} {...props} />
)

export { View, ViewProps }
