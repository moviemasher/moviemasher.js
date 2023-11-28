import type { AlphaProbing, AudibleProbing, DurationProbing, ProbingTypes, SizeProbing } from './ProbingTypes.js'

export const ALPHA: AlphaProbing = 'alpha'
export const AUDIBLE: AudibleProbing = 'audible'
export const DURATION: DurationProbing = 'duration'
export const SIZE_PROBING: SizeProbing = 'size'

export const PROBING_TYPES: ProbingTypes = [ALPHA, AUDIBLE, DURATION, SIZE_PROBING]
