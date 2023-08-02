import { POINT_KEYS, POINT_ZERO } from './PointConstants.js'
import { SIZE_KEYS, SIZE_ZERO } from './SizeConstants.js'

export const RECT_ZERO = { ...POINT_ZERO, ...SIZE_ZERO } as const

export const RECT_KEYS = [...POINT_KEYS, ...SIZE_KEYS] as const
