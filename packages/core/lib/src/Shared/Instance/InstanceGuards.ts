import type { Instance } from './Instance.js'

import { isObject } from '../SharedGuards.js'

export const isInstance = (value?: any): value is Instance => {
  return isObject(value) && 'assetIds' in value;
}
