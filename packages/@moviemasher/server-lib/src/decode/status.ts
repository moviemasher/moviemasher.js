import type { DataOrError, Decoding, ListenersFunction } from '@moviemasher/shared-lib/types.js';
import { ERROR, isDecoding, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js';
import { isDate } from '@moviemasher/shared-lib/utility/guard.js';
import { $DECODING } from "../utility/job.js";
import { jobGetStatus } from '../utility/job.js';
import { EventServerDecodeStatus } from '../utility/events.js';

const statusPromise = async (id: string): Promise<DataOrError<Decoding | Date>> => {
  const orError = await jobGetStatus(id);
  if (isDefiniteError(orError)) return orError;

  const { data } = orError;
  if (isDate(data) || isDecoding(data)) return { data };

  return namedError(ERROR.Syntax, { ...data, name: $DECODING });
};
const statusHandler = (event: EventServerDecodeStatus) => {
  const { detail } = event;
  const { id } = detail;
  detail.promise = statusPromise(id);
  event.stopImmediatePropagation();
};

export const ServerDecodeStatusListeners: ListenersFunction = () => ({
  [EventServerDecodeStatus.Type]: statusHandler,
});
