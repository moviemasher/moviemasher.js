export type TargetId = 'asset' | 'clip' | 'container' | 'content' | 'mash' 

export interface TargetIds extends Array<TargetId>{}

export type PropertyId = `${TargetId}.${string}`

export interface PropertyIds extends Array<PropertyId>{}

export type SelectorType = TargetId | PropertyId 

export interface SelectorTypes extends Array<SelectorType>{}

