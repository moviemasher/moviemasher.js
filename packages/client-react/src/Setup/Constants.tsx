import React from 'react'
import { UnknownObject } from "@moviemasher/moviemasher.js"

import { UnknownElement, ReactResult } from "../declarations"

function ConstEmptyElementFunction(props: UnknownObject): ReactResult { return null }
export const EmptyElement: UnknownElement = <ConstEmptyElementFunction/>
