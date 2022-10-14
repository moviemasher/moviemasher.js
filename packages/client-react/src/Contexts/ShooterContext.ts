import React from 'react'

export interface ShooterContextInterface {
  devices: MediaDeviceInfo[]
}

export const ShooterContextDefault: ShooterContextInterface = { devices: [] }

export const ShooterContext = React.createContext(ShooterContextDefault)
