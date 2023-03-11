import { DragFunction } from '@moviemasher/client-core'
import { UnknownFunction, UnknownRecord, EmptyFunctionType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { PropsWithChildren } from '../Types/Props'

export interface ViewProps extends PropsWithChildren, UnknownRecord {
  // onClick?: UnknownFunction
  // onDragLeave?: DragFunction
  // onDragOver?: DragFunction
  // onDrop?: DragFunction
  // draggable?: boolean
}

export const View = React.forwardRef<HTMLDivElement, ViewProps>((props, ref) =>
  <div 

    ref={ref}  
    className={props.className}
    { ...props }
  >{props.children}</div>
)
