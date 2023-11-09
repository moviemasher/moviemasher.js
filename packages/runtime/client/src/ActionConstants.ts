import type { ClientAction, ServerAction } from "./ClientEvents.js"

export const ClientActionAdd: ClientAction = 'add'
export const ClientActionAddTrack: ClientAction = 'add-track'
export const ClientActionFlip: ClientAction = 'flip'
export const ClientActionRedo: ClientAction = 'redo'
export const ClientActionRemove: ClientAction = 'remove'
export const ClientActionTogglePaused: ClientAction = 'toggle-paused'
export const ClientActionUndo: ClientAction = 'undo'
export const ClientActionView: ClientAction = 'view'

export const ServerActionSave: ServerAction = 'save'
export const ServerActionEncode: ServerAction = 'encode'
export const ServerActionDecode: ServerAction = 'decode'
export const ServerActionTranscode: ServerAction = 'transcode'
