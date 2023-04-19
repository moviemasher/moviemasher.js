// import type { Draggable } from '@moviemasher/client-core'
import type { Masher, MashIndex, Media, ScalarRecord } from '@moviemasher/lib-core'

import { createContext } from '@lit-labs/context'

export interface FormContext {
  current: ScalarRecord
  changeDefinition: (definition?: Media) => void
  // drop: (draggable: Draggable, editorIndex?: MashIndex) => Promise<Media[]>
  masher?: Masher
  editorIndex: MashIndex
}

export const formContext = createContext<FormContext>('moviemasher-form')

