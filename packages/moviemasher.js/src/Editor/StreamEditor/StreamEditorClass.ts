
import {
  Any, Size, VisibleContextData
} from "../../declarations"

import { Emitter } from "../../Helpers/Emitter"
import { SelectionValue } from "../../Base/Propertied"
import { StreamEditor, StreamEditorObject } from "./StreamEditor"

import { EditType, EventType } from "../../Setup/Enums"
import { EditorClass } from "../EditorClass"
import { Stream } from "../../Edited/Stream/Stream"
import { StreamFactory } from "../../Edited/Stream/StreamFactory"

class StreamEditorClass extends EditorClass implements StreamEditor {
  // [index : string] : unknown
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { } = <StreamEditorObject> object
  }

  change(_property: string, _value?: SelectionValue): void {
    // ...
  }

  editType = EditType.Stream

  eventTarget = new Emitter()

  get imageData() : VisibleContextData { return this.stream.imageData }

  get imageSize() : Size { return this.stream.imageSize }

  set imageSize(value : Size) {this.stream.imageSize = value }

  private _stream? : Stream

  get stream() : Stream {
    if (this._stream) return this._stream

    const instance = StreamFactory.instance()
    this.stream =instance
    return instance
  }

  set stream(object: Stream) {
    if (this._stream === object) return

    // if (this._stream) this._stream.destroy()

    this._stream = object
    this._stream.emitter = this.eventTarget
    // if (this._actions) {
    //   this._actions.destroy()
    //   this._actions.stream = this._stream
    // }

    this.eventTarget.emit(EventType.Stream)

    this.eventTarget.emit(EventType.Action)

  }

  streamUrl = ''
}

export { StreamEditorClass }
