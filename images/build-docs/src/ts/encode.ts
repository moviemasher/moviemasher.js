
import type { MashAssetObject } from '@moviemasher/shared-lib/types.js'

import { encode } from '@moviemasher/server-lib'
import { IMAGE, MASH, SHAPE, VIDEO, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'

const object: MashAssetObject = {
  type: VIDEO, source: MASH, id: 'mash',
  assets: [{
    type: IMAGE, source: SHAPE, id: SHAPE,
    
  }],
  tracks: [{ clips: [

  ]}],
}

const encoded = await encode(object)
if (!isDefiniteError(encoded)) {
  const { data: filePath } = encoded
  console.log('encoded to', filePath)
}
