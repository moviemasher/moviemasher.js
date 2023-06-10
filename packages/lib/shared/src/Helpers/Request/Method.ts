import { errorThrow } from '../Error/ErrorFunctions.js'


export type Method = GetMethod | PostMethod | PutMethod | ListMethod

export type GetMethod = 'GET'
export type PostMethod = 'POST'
export type PutMethod = 'PUT'
export type ListMethod = 'LIST'



export const GetMethod: GetMethod = 'GET'
export const PostMethod: PostMethod = 'POST'
export const PutMethod: PutMethod = 'PUT'
export const ListMethod: ListMethod = 'LIST'


export type Methods = Method[]
export const Methods: Methods = [GetMethod, PostMethod, PutMethod, ListMethod]
export const isMethod = (value: any): value is Method => {
  return Methods.includes(value)
}
export function assertMethod(value: any, name?: string): asserts value is Method {
  if (!isMethod(value))
    errorThrow(value, 'Method', name)
}
