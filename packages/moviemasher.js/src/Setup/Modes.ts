
export const ModeDefault = "normal"
export const Modes = [
  ModeDefault,
  "color-burn",
  "dodge",
  "darken",
  "difference",
  "exclusion",
  "hard-light",
  "lighten",
  "multiply",
  "overlay",
  "screen",
  "soft-light",
  "xor",
]

export const ModesFfmpeg = Modes.map(string => string.replaceAll('-', ''))
ModesFfmpeg[1] = 'burn'
