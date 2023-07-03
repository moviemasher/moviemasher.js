
export type ClientAction = RedoClientAction | RemoveClientAction | RenderClientAction | SaveClientAction | UndoClientAction

export type RedoClientAction = 'redo'
export type RemoveClientAction = 'remove'
export type RenderClientAction = 'render'
export type SaveClientAction = 'save'
export type UndoClientAction = 'undo'
