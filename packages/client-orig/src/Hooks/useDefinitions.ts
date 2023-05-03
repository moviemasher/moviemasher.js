/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import { EventTypeAdded, EventTypeResize, MediaArray, MediaType } from "@moviemasher/lib-core"

import { useListeners } from "./useListeners"
import { useMasher } from "./useMasher"
import { useRefresh } from "./useRefresh"

export const useDefinitions = (types: MediaType[] = []): MediaArray => {
  const masher = useMasher()
  const { media } = masher
  const [refresh, refreshed] = useRefresh()
  const getMedia = React.useCallback(() => {
    const mediaArray = types.flatMap(type => media.byType(type))
    console.log('getMedia', types, mediaArray)
    return mediaArray
  }, [media, types, refreshed])


  useListeners({ [EventTypeAdded]: refresh, [EventTypeResize]: refresh })
  
  const mediaArray = React.useMemo(getMedia, [getMedia])
  return mediaArray
}