import type { EditorSelectionObject } from '../../EditorSelection/EditorSelection.js';
import type { MashMedia } from '../../../../Media/Mash/Mash.js';
import { assertMashMedia, isMashMedia } from '../../../../Media/Mash/Mash.js';
import { errorThrow } from '../../../../Helpers/Error/ErrorFunctions.js';
import { ErrorName } from '../../../../Helpers/Error/ErrorName.js';
import { Action, ActionObject } from './Action.js';


export class ActionClass implements Action {
  constructor(object: ActionObject) {
    const { redoSelection, type, undoSelection } = object;
    this.redoSelection = redoSelection;
    this.type = type;
    this.undoSelection = undoSelection;
  }

  done = false;

  protected get mash(): MashMedia {
    const { mash } = this.redoSelection;
    if (isMashMedia(mash))
      return mash;

    const { mash: undoMash } = this.undoSelection;
    assertMashMedia(undoMash);
    return undoMash;
  }

  redo(): void {
    this.redoAction();
    this.done = true;
  }

  protected redoAction(): void {
    return errorThrow(ErrorName.Unimplemented);
  }

  protected redoSelection: EditorSelectionObject;

  get selection(): EditorSelectionObject {
    if (this.done)
      return this.redoSelection;

    return this.undoSelection;
  }

  type: string;

  undo(): void {
    this.undoAction();
    this.done = false;
  }

  protected undoAction(): void {
    return errorThrow(ErrorName.Unimplemented);
  }

  protected undoSelection: EditorSelectionObject;
}
