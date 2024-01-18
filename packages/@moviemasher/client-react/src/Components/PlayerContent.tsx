import { createComponent } from '@lit/react'
import { PlayerContentElement, PlayerContentTag } from '@moviemasher/client-lib/player/player-content.js'
import React from 'react'
/** @category Components */
export const PlayerContent = createComponent({ tagName: PlayerContentTag, elementClass: PlayerContentElement, react: React })