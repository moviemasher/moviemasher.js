import { CommandOutput } from "@moviemasher/moviemasher.js";
import { CommandDescription } from "../Encode/Encode";

export interface StreamingDescription extends CommandDescription {
  commandOutput: CommandOutput
}
