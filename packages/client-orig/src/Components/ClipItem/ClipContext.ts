import { Clip } from '@moviemasher/moviemasher.js'
import { createContext } from '../../Framework/FrameworkFunctions'

export interface ClipContextInterface {
  prevClipEnd: number
  clip?: Clip
}

export const ClipContextDefault: ClipContextInterface = {
  prevClipEnd: 0
}

export const ClipContext = createContext(ClipContextDefault)
