import React from 'react'
import { UnknownRecord } from "@moviemasher/moviemasher.js"

import { UnknownElement, ReactResult } from "../declarations"

function ConstEmptyElementFunction(props: UnknownRecord): ReactResult { return null }

export const EmptyElement: UnknownElement = <ConstEmptyElementFunction key="empty" />


export const TweenInputKey = 'tween-input-key'
