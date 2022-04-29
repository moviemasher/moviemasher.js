
export const Modes = [
  "normal",
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
