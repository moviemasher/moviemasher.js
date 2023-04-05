// search includes '?' prefix
// protocol includes ':' suffix

export interface Endpoint {
  protocol?: string
  pathname?: string
  hostname?: string
  search?: string
  port?: number
}
