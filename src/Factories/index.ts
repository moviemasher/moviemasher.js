import { effectInitialize } from "../Mash/Effect/EffectFactory"
import { filterInitialize } from "../Mash/Filter/FilterFactory"
import { fontInitialize } from "../Mash/Font/FontFactory"
import { mergerInitialize } from "../Mash/Merger/MergerFactory"
import { scalerInitialize } from "../Mash/Scaler/ScalerFactory"
import { themeInitialize } from "../Mash/Theme/ThemeFactory"
import { transitionInitialize } from "../Mash/Transition/TransitionFactory"

mergerInitialize()
scalerInitialize()
fontInitialize()
transitionInitialize()
effectInitialize()
filterInitialize()
themeInitialize()
