


export enum ActivityType {
  Analyze = 'analyze',
  Complete = 'complete',
  Error = "error",
  Load = 'load',
  Render = 'render',
}

export interface ActivityInfo {
  id: string
  type: ActivityType
  label?: string
  steps?: number
  step?: number
  error?: string
  value?: string
}
