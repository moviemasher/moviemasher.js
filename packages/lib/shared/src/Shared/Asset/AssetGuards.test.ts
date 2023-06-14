
import { describe, test } from 'node:test'
import assert from 'assert'

import { SourceRaw, TypeImage } from '@moviemasher/runtime-shared'

import { isAssetObject } from '@moviemasher/runtime-shared'

describe('AssetGuards', () => {
  describe('isAssetObject', () => {
    test('returns true for object with type and id', () => {
      assert(isAssetObject({ type: TypeImage, id: 'test-image-id', source: SourceRaw }))

    })
  })
})