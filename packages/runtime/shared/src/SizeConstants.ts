import type { Size } from './Size.js'

import { HEIGHT, WIDTH } from './Constants.js'

export const SIZE_ZERO = { width: 0, height: 0 } as const
export const SIZE_OUTPUT: Size = { width: 1920, height: 1080 } as const
export const SIZE_KEYS = [WIDTH, HEIGHT] as const
