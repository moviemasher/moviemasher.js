import { createComponent } from '@lit/react'
import { PlayerHeaderElement, PlayerHeaderTag } from '@moviemasher/client-lib/player/player-header.js'
import React from 'react'
/** @category Components */
export const PlayerHeader = createComponent({ tagName: PlayerHeaderTag, elementClass: PlayerHeaderElement, react: React })