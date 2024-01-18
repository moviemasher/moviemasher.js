import { createComponent } from '@lit/react'
import { PlayerElement, PlayerTag } from '@moviemasher/client-lib/player/player.js'
import React from 'react'
/** @category Components */
export const Player = createComponent({ tagName: PlayerTag, elementClass: PlayerElement, react: React })