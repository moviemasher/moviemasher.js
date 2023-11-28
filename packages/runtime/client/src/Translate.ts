import type { Identified, ValueRecord } from '@moviemasher/runtime-shared'

export interface TranslateArgs extends Identified {
  values?: ValueRecord
}
