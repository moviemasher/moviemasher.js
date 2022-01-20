import React from 'react'
import { DataType } from '@moviemasher/moviemasher.js'

import { EditorInputs } from '../../../../declarations'
import { DefaultTextInput } from './DefaultTextInput'
import { DefaultRgbaInput } from './DefaultRgbaInput'
import { DefaultRgbInput } from './DefaultRgbInput'
import { DefaultFontInput } from './DefaultFontInput'
import { DefaultScalerInput } from './DefaultScalerInput'
import { DefaultMergerInput } from './DefaultMergerInput'
import { DefaultDirection8Input } from './DefaultDirection8Input'
import { DefaultDirection4Input } from './DefaultDirection4Input'
import { DefaultModeInput } from './DefaultModeInput'
import { DefaultObjectInput } from './DefaultObjectInput'

const DefaultInputs : EditorInputs = {
  [DataType.Font]: <DefaultFontInput />,
  [DataType.Frame]: <DefaultTextInput />,
  [DataType.Number]: <DefaultTextInput />,
  [DataType.Rgb]: <DefaultRgbInput />,
  [DataType.Rgba]: <DefaultRgbaInput />,
  [DataType.String]: <DefaultTextInput />,
  [DataType.Numbers]: <DefaultTextInput />,
  [DataType.Track]: <DefaultTextInput />,
  [DataType.Boolean]: <DefaultTextInput />,

  [DataType.Merger]: <DefaultMergerInput />,
  [DataType.Scaler]: <DefaultScalerInput />,

  [DataType.Effects]: <DefaultTextInput />,
  [DataType.Mode]: <DefaultModeInput />,
  [DataType.Direction4]: <DefaultDirection4Input />,
  [DataType.Direction8]: <DefaultDirection8Input />,
  [DataType.Object]: <DefaultObjectInput />,
}

export { DefaultInputs }
