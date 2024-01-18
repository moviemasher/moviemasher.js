import { createComponent } from '@lit/react'
import { PlayerTimeElement, PlayerTimeTag } from '@moviemasher/client-lib/player/player-time.js'
import React from 'react'
/** @category Components */
export const PlayerTime = createComponent({ tagName: PlayerTimeTag, elementClass: PlayerTimeElement, react: React })