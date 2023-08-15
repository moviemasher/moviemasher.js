import type { ClientClips } from '@moviemasher/runtime-client'

import { MashPreviewClass } from './MashPreviewClass.js'

export class NonePreview extends MashPreviewClass {
  protected override get clips(): ClientClips { return [] }
}