import { createComponent } from '@lit/react'
import { MovieMasherElement, MovieMasherTag } from '@moviemasher/client-lib/movie-masher.js'
import React from 'react'
/** @category Components */
export const MovieMasher = createComponent({ tagName: MovieMasherTag, elementClass: MovieMasherElement, react: React })