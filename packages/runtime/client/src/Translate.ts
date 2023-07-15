import type { DataOrError, Identified, ValueRecord } from '@moviemasher/runtime-shared'

export interface Translation {
  text?: Text
  string?: string
}

export interface TranslateArgs extends Identified {
  values?: ValueRecord
}

export type TranslationDataOrError = DataOrError<Translation>

export interface TranslationEventDetail extends TranslateArgs {
  promise?: Promise<TranslationDataOrError>
}

export type TranslationEvent = CustomEvent<TranslationEventDetail>
