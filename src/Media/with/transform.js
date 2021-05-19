import { filters } from "./filters"
import { html } from "./html"
import { modular } from "./modular"
import { urlsFromFilters } from "./urlsFromFilters"

export const transform = {
  ...filters,
  ...urlsFromFilters,
  ...html,
  ...modular,
}