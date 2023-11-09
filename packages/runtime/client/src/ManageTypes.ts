import { ManageType } from "@moviemasher/runtime-shared"

export const FETCH: ManageType = 'fetch'
export const IMPORT: ManageType = 'import'
export const REFERENCE: ManageType = 'reference'

export const MANAGE_TYPES = [FETCH, IMPORT, REFERENCE] 

export const isManageType = (value: any): value is ManageType => (
  MANAGE_TYPES.includes(value as ManageType)
)