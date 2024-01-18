import { IMAGE, RAW, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import assert from 'assert'
import { describe, test } from 'node:test'

describe('AssetGuards', () => {
  describe('isAssetObject', () => {
    test('returns true for object with type and id', () => {
      assert(isAssetObject({ type: IMAGE, id: 'test-image-id', source: RAW }))
    })
  })
})