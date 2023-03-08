import /* type */ { Masher, MashIndex, Media, ScalarRecord } from '@moviemasher/moviemasher.js'
import /* type */ { Draggable } from '@moviemasher/client-core'

import { ElementRecord } from "../../Types/Element"

import { EmptyFunction } from '@moviemasher/moviemasher.js'
import { createContext } from '../../Framework/FrameworkFunctions'

export interface MasherContextInterface {
  current: ScalarRecord
  changeDefinition: (definition?: Media) => void
  drop: (draggable: Draggable, editorIndex?: MashIndex) => Promise<Media[]>
  masher?: Masher
  editorIndex: MashIndex
  icons: ElementRecord
}

export const MasherContextDefault: MasherContextInterface = {
  current: {},
  changeDefinition: EmptyFunction,
  drop: () => Promise.resolve([]),
  editorIndex: {},
  icons: {},
}

export const MasherContext = createContext(MasherContextDefault)
export default MasherContext
