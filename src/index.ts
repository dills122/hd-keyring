import { entropyToMnemonic } from "@ethersproject/hdnode"
import { randomBytes } from "crypto"

import BaseHDKeyring from "./keyring"

export {
  normalizeHexAddress,
  normalizeMnemonic,
  toChecksumAddress,
  validateAndFormatMnemonic,
} from "./utils"

export * from "./keyring"

export default class HDKeyring extends BaseHDKeyring {
  protected static generateMnemonic(strength: number): string {
    return entropyToMnemonic(randomBytes(this.entropyByteLength(strength)))
  }
}
