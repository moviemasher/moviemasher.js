import { EndpointRequest } from '@moviemasher/runtime-shared';
import { isEndpoint } from '../Endpoint/EndpointFunctions.js';
import { isObject, isPopulatedString } from '../../Shared/SharedGuards.js';
import { errorThrow } from '../Error/ErrorFunctions.js';


export const isRequest = (value: any): value is EndpointRequest => {
  return (
    isObject(value)
    && (
      (
        'endpoint' in value
        && (isPopulatedString(value.endpoint) || isEndpoint(value.endpoint))
      )
      || ('response' in value && isObject(value.response))
    )
  );
};
export function assertRequest(value: any, name?: string): asserts value is EndpointRequest {
  if (!isRequest(value))
    errorThrow(value, 'Request', name);
}
