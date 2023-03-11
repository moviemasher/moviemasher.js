import /* type */ { Numbers } from '@moviemasher/moviemasher.js'


export interface WithClassName { 
  className?: string
}

export type SliderChangeHandler = (value: string | number | Numbers) => void
