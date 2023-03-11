/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import /* type */ { MediaArray, MediaType } from "@moviemasher/moviemasher.js"

import { EventType } from "@moviemasher/moviemasher.js"

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


  useListeners({ [EventType.Added]: refresh, [EventType.Resize]: refresh })
  
  const mediaArray = React.useMemo(getMedia, [getMedia])
  return mediaArray
}