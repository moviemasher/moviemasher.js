
export type Timing = CustomTiming | ContentTiming | ContainerTiming
export type CustomTiming = 'custom'
export type ContentTiming = 'content'

/**
 * Something about the container itself changed.
 * @category Timings 
 */
export type ContainerTiming = 'container'
