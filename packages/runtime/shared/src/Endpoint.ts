/**
 * Supports a subset of the standard URL interface
 */
export interface Endpoint {
  /**
   * includes ':' suffix if defined
   */
  protocol?: string
  /**
   * relative or absolute path if defined
   */
  pathname?: string
  /**
   * full domain name if defined
   */
  hostname?: string

  /**
   * includes '?' prefix if defined
   */
  search?: string
  /**
   * does not include ':' prefix
   */
  port?: number
}
