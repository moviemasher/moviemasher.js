import type { DataOrError, Encoding, ListenersFunction } from '@moviemasher/shared-lib/types.js';
import { ERROR, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js';
import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js';
import { EventServerEncodeStatus } from '../utility/events.js';
import { $ENCODING } from "../utility/job.js";
import { jobGetStatus } from '../utility/job.js';
import { isDate } from '@moviemasher/shared-lib/utility/guard.js';

// const audioHandler = (event: EventServerEncode) => {
//   const { detail } = event
//   const { mashAssetObject, encodeOptions, encodingType, user, id } = detail
//   const type = encodingType || mashAssetObject.type 
//   if (type !== $AUDIO) return
//   detail.promise = encode(mashAssetObject, encodeOptions, type, id, user)
//   event.stopImmediatePropagation()
// }
// const imageHandler = (event: EventServerEncode) => {
//   const { detail } = event
//   const { mashAssetObject, encodeOptions, encodingType, user, id } = detail
//   const type = encodingType || mashAssetObject.type 
//   if (type !== $IMAGE) return
//   detail.promise = encode(mashAssetObject, encodeOptions, type, id, user)
//   event.stopImmediatePropagation()
// }
// const videoHandler = (event: EventServerEncode) => {
//   const { detail } = event
//   const { mashAssetObject, encodeOptions, encodingType, user, id } = detail
//   const type = encodingType || mashAssetObject.type 
//   if (type !== $VIDEO) return
//   detail.promise = encode(mashAssetObject, encodeOptions, type, id, user)
//   event.stopImmediatePropagation()
// }
// export const ServerEncodeAudioListeners: ListenersFunction = () => ({
//   [EventServerEncode.Type]: audioHandler,
// })
// export const ServerEncodeImageListeners: ListenersFunction = () => ({
//   [EventServerEncode.Type]: imageHandler,
// })
// export const ServerEncodeVideoListeners: ListenersFunction = () => ({
//   [EventServerEncode.Type]: videoHandler,
// })
const statusPromise = async (id: string): Promise<DataOrError<Encoding | Date>> => {
  const orError = await jobGetStatus(id);
  if (isDefiniteError(orError)) return orError;

  const { data } = orError;
  if (isDate(data) || isEncoding(data)) return { data };

  return namedError(ERROR.Syntax, { ...data, name: $ENCODING });
};
const statusHandler = (event: EventServerEncodeStatus) => {
  const { detail } = event;
  const { id } = detail;
  detail.promise = statusPromise(id);
  event.stopImmediatePropagation();
};

export const ServerEncodeStatusListeners: ListenersFunction = () => ({
  [EventServerEncodeStatus.Type]: statusHandler,
});
