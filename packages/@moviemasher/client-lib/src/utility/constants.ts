import type { ManageType } from '@moviemasher/shared-lib/types.js';


export const $WILL = 'will' as const;

export const $REFERENCE: ManageType = 'reference';
export const $SELECTED = 'selected';
export const $REMOVE = 'remove';
export const $INSERT = 'insert';


export const ADD_TRACK = 'add-track';
export const MOVE_CLIP = 'move-clip';
export const REDO = 'redo';
export const REMOVE_CLIP = 'remove-clip';
export const UNDO = 'undo';

export const ROW = 'row';
export const DROPPING = 'dropping';
export const LAYER = 'layer';
export const OUTLINE = 'outline';
export const OUTLINES = 'outlines';
export const BOUNDS = 'bounds';
export const BACK = 'back';
export const LINE = 'line';
export const HANDLE = 'handle';
export const FORE = 'fore';
export const ANIMATE = 'animate';
export const X_MOVIEMASHER = '/x-moviemasher';

export const INDEX_LAST = -1;
export const INDEX_CURRENT = -2;
export const INDEX_NEXT = -3;
