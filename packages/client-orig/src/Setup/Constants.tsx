import React from 'react'
import { UnknownRecord } from "@moviemasher/moviemasher.js"

import { JsxElement } from "../Framework/Framework"


function ConstEmptyElementFunction(props: UnknownRecord) { return null }

export const EmptyElement: JsxElement = <ConstEmptyElementFunction key="empty-element" />
