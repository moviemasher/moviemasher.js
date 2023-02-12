
export const mediaTypeFromMime = (mime?: string): string =>( 
  mime?.split('/').shift() || ''
)
