import { StringRecord } from "../../Types/Core"
import { Endpoint } from "../Endpoint/Endpoint"
import { isObject } from "../../Utility/Is"
import { errorThrow } from "../Error/ErrorFunctions"
import { isEndpoint } from "../Endpoint/EndpointFunctions"



export interface Request {
  response?: any | undefined
  endpoint?: Endpoint
  init?: RequestInit
}
export type Requests = Request[]

export const isRequest = (value: any): value is Request => {
  return isObject(value) && (
    ("endpoint" in value && isEndpoint(value.endpoint) || 
    ("response" in value && isObject(value.response))
  ))
}
export function assertRequest(value: any, name?: string): asserts value is Request {
  if (!isRequest(value)) errorThrow(value, 'Request', name)
}

export interface RequestInit {
  body?: any
  headers?: StringRecord
  method?: string
}

export interface RequestRecord extends Record<string, Request> { }


export type GetMethod = 'GET'
export type PostMethod = 'POST'
export type PutMethod = 'PUT'
export type ListMethod = 'LIST'


export const GetMethod: GetMethod = 'GET'
export const PostMethod: PostMethod = 'POST'
export const PutMethod: PutMethod = 'PUT'
export const ListMethod: ListMethod = 'LIST'

export type Method = GetMethod | PostMethod | PutMethod | ListMethod
export type Methods = Method[]
export const Methods: Methods = [GetMethod, PostMethod, PutMethod, ListMethod]
export const isMethod = (value: any): value is Method => {
  return Methods.includes(value)
}
export function assertMethod(value: any, name?: string): asserts value is Method {
  if (!isMethod(value)) errorThrow(value, 'Method', name)
}
