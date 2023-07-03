import type {
  AddClipActionType, AddTrackActionType, ChangeActionType,
  ChangeFrameActionType, ChangeMultipleActionType, MoveClipActionType,
  RemoveClipActionType
} from '@moviemasher/runtime-client';


export const ActionTypeAddClip: AddClipActionType = 'add-clip';
export const ActionTypeAddTrack: AddTrackActionType = 'add-track';
export const ActionTypeChange: ChangeActionType = 'change';
export const ActionTypeChangeFrame: ChangeFrameActionType = 'change-frame';
export const ActionTypeChangeMultiple: ChangeMultipleActionType = 'change-multiple';
export const ActionTypeMoveClip: MoveClipActionType = 'move-clip';
export const ActionTypeRemoveClip: RemoveClipActionType = 'remove-clip';
