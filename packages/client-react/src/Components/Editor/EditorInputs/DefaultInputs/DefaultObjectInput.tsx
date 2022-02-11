import { DataType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { ReactResult } from "../../../../declarations"
import { DataTypeInputs } from './DataTypeInputs'

function DefaultObjectInput(): ReactResult {
  return <div>DefaultObjectInput</div>
}

DataTypeInputs[DataType.Object] = <DefaultObjectInput />


export { DefaultObjectInput }
