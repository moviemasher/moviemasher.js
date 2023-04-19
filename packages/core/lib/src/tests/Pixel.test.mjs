import { describe, test } from 'node:test'
import assert from 'assert'

import { pixelToFrame } from '@moviemasher/lib-core'

describe('pixelToFrame', () => {
 
  test('converts properly between fromFrame', () => {
    const pixel = 10
    const perFrame = 0.2
    assert.equal(pixelToFrame(pixel, perFrame), 50)
  })

})
