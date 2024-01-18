import { createComponent } from '@lit/react'
import { PlayerButtonElement, PlayerButtonTag } from '@moviemasher/client-lib/player/player-button.js'
import React from 'react'
/** @category Components */
export const PlayerButton = createComponent({ tagName: PlayerButtonTag, elementClass: PlayerButtonElement, react: React })