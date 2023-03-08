import { JsxElement } from "../Framework/Framework"


export type JsxElements = JsxElement[]

export type JsxChild = JsxElement
export type JsxChilds = JsxElement
export type JsxAndChildren = JsxElement
export type JsxChildren =  JsxElement | JsxElements | string

// export type JsxChild = string | JsxElement
// export type JsxChilds = JsxChild[]
// export type JsxAndChildren = JsxChild | JsxChilds | JsxElements 
// export type JsxChildren =  undefined |null | JsxAndChildren





export type ElementRecord = Record<string, JsxElement>

