import React from 'react'

// TODO: determine if we really need to repeat this
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

export type UnknownChangeEvent = React.ChangeEvent<{}>
export type SliderChangeHandler = (event: UnknownChangeEvent, value: number | number[]) => void
export type NodeObject = Exclude<React.ReactNode, boolean | null | undefined>
export type NodesArray = Array<NodeObject>

export type UnknownElement = React.ReactElement<Record<string, unknown>>

export interface ElementRecord extends Record<string, UnknownElement> {}

export interface EditorIcons {
  [key: string]: UnknownElement
}

export interface SourceCallbackOptions extends Record<string, unknown> {
  page?: number
  perPage?: number
  terms?: string
}

export type ReactStateSetter<T = string> = React.Dispatch<React.SetStateAction<T>>

export interface ListenerCallback { (event: Event): void }


export interface PropsAndChild extends Record<string, unknown> {
  children: React.ReactElement<Record<string, unknown>>
}

export interface PropsWithoutChild extends Record<string, unknown> {
  children?: never
}

export interface PropsWithChildren extends Record<string, unknown> {
  children?: React.ReactNode
}

export interface PropsAndChildren extends Record<string, unknown> {
  children: React.ReactNode
}

export type ReactResult = React.ReactElement<any, any> | null

export type PropsMethod<I, O> = (input: I) => O

export interface WithClassName extends Record<string, unknown> {
  className?: string
}
