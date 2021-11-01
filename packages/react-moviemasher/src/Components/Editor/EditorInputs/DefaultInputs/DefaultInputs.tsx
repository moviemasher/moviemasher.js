import React from 'react'
import { DataType } from '@moviemasher/moviemasher.js'

import { EditorInputs } from '../../../../declarations'
import { DefaultTextInput } from './DefaultTextInput'

const DefaultInputs : EditorInputs = {
  [DataType.Boolean]: <DefaultTextInput key='input' />,
  [DataType.Direction4]: <DefaultTextInput key='input' />,
  [DataType.Direction8]: <DefaultTextInput key='input' />,
  [DataType.Font]: <DefaultTextInput key='input' />,
  [DataType.Fontsize]: <DefaultTextInput key='input' />,
  [DataType.Integer]: <DefaultTextInput key='input' />,
  [DataType.Mode]: <DefaultTextInput key='input' />,
  [DataType.Number]: <DefaultTextInput key='input' />,
  [DataType.Pixel]: <DefaultTextInput key='input' />,
  [DataType.Rgb]: <DefaultTextInput key='input' />,
  [DataType.Rgba]: <DefaultTextInput key='input' />,
  [DataType.String]: <DefaultTextInput key='input' />,
  [DataType.Text]: <DefaultTextInput key='input' />,

}

export { DefaultInputs }
