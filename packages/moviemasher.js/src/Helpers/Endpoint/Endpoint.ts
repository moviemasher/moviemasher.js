import { isObject } from "../../Utility/Is";

// search includes '?' prefix
// protocol includes ':' suffix

export interface Endpoint {
  protocol?: string;
  pathname?: string;
  hostname?: string;
  search?: string;
  port?: number;
}
export const isEndpoint = (value: any): value is Endpoint => {
  return isObject(value);
};
