import type { ClientAction } from "./ClientAction.js"

export const ClientActionSave: ClientAction = 'save'


export const ClientActionRedo: ClientAction = 'redo'
export const ClientActionUndo: ClientAction = 'undo'

export const ClientActionRender: ClientAction = 'render'

export const ClientActionRemove: ClientAction = 'remove'
export const ClientActionAdd: ClientAction = 'add'

export const ClientActionAddTrack: ClientAction = 'add-track'
export const ClientActionFlip: ClientAction = 'flip'
export const ClientActionTogglePaused: ClientAction = 'toggle-paused'
