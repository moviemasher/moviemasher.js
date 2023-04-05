import type { Numbers } from '@moviemasher/lib-core'


export interface WithClassName { 
  className?: string
}

export type SliderChangeHandler = (value: string | number | Numbers) => void
