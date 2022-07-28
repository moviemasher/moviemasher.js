import { PreviewClass } from "./PreviewClass";
import { TrackPreviews } from "./TrackPreview/TrackPreview";

export class NonePreview extends PreviewClass {
  protected get trackPreviewsInitialize(): TrackPreviews {
    return []
  }
}