export type TargetId = 'asset' | 'clip' | 'container' | 'content' | 'mash' 

export type TargetIds = TargetId[]

export type PropertyId = `${TargetId}.${string}`
export type PropertyIds = PropertyId[]

export type SelectorType = TargetId | PropertyId 

export type SelectorTypes = SelectorType[]

