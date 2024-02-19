import type { DataOrError, ListenersFunction, Transcoding } from '@moviemasher/shared-lib/types.js';
import { ERROR, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js';
import { isTranscoding } from '@moviemasher/shared-lib/utility/guards.js';
import { EventServerTranscodeStatus } from '../utility/events.js';
import { $TRANSCODING } from "../utility/job.js";
import { jobGetStatus } from '../utility/job.js';
import { isDate } from '@moviemasher/shared-lib/utility/guard.js';

const statusPromise = async (id: string): Promise<DataOrError<Transcoding | Date>> => {
  const orError = await jobGetStatus(id);
  if (isDefiniteError(orError)) return orError;

  const { data } = orError;
  if (isDate(data) || isTranscoding(data)) return { data };

  return namedError(ERROR.Syntax, { ...data, name: $TRANSCODING });
};
const statusHandler = (event: EventServerTranscodeStatus) => {
  const { detail } = event;
  const { id } = detail;
  detail.promise = statusPromise(id);
  event.stopImmediatePropagation();
};

export const ServerTranscodeStatusListeners: ListenersFunction = () => ({
  [EventServerTranscodeStatus.Type]: statusHandler,
});
