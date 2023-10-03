
import { describe, test } from 'node:test'
import assert from 'assert'

import { RAW, IMAGE } from '@moviemasher/runtime-shared'

import { isAssetObject } from '@moviemasher/runtime-shared'

describe('AssetGuards', () => {
  describe('isAssetObject', () => {
    test('returns true for object with type and id', () => {
      assert(isAssetObject({ type: IMAGE, id: 'test-image-id', source: RAW }))

    })
  })
})