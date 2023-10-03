import type { OutputOptions } from '@moviemasher/runtime-shared'

import { DOT, assertPopulatedString } from '@moviemasher/lib-shared'

export const outputFileName = (outputOptions: OutputOptions, encodingType: string, extension?: string): string => {
  const { format, extension: outputExtension } = outputOptions

  const ext = extension || outputExtension || format
  assertPopulatedString(ext, 'extension')

  return [encodingType, ext].join(DOT)
}
