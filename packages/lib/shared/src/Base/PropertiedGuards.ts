import type { Propertied } from '@moviemasher/runtime-shared'

import { PropertiedClass } from './PropertiedClass.js'

export const isPropertied = (value: any): value is Propertied => (
  value instanceof PropertiedClass
)
