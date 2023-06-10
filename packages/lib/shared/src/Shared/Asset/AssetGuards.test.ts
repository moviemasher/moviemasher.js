
import { describe, test } from 'node:test'
import assert from 'assert'

import { TypeImage } from '@moviemasher/runtime-shared'

import { isAssetObject } from './AssetGuards.js'

describe('AssetGuards', () => {
  describe('isAssetObject', () => {
    test('returns true for object with type and id', () => {
      assert(isAssetObject({ type: TypeImage, id: 'test-image-id' }))

    })
  })
})