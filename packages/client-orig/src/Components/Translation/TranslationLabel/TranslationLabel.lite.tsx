import { TranslateArgs } from "@moviemasher/moviemasher.js"
import React from "react"
import { PropsContained } from "../../../Types/Props"


import TranslationText from "../TranslationText/TranslationText.lite"
export interface TranslationLabelProps extends PropsContained {
  label: TranslateArgs
}


export default function TranslationLabel(props: TranslationLabelProps) {
  return <TranslationText 
    id={ props.label.id } 
    values={ props.label.values }
    locale={ props.label.locale }
  />
}