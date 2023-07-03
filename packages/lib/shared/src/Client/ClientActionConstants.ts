import type {
  RedoClientAction, RemoveClientAction, RenderClientAction,
  SaveClientAction, UndoClientAction
} from '@moviemasher/runtime-client';


export const ClientActionRedo: RedoClientAction = 'redo';
export const ClientActionRemove: RemoveClientAction = 'remove';
export const ClientActionRender: RenderClientAction = 'render';
export const ClientActionSave: SaveClientAction = 'save';
export const ClientActionUndo: UndoClientAction = 'undo';
