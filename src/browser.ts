import { entropyToMnemonic } from "@ethersproject/hdnode"

import BaseHDKeyring from "./keyring"

export {
  normalizeHexAddress,
  normalizeMnemonic,
  toChecksumAddress,
  validateAndFormatMnemonic,
} from "./utils"

export * from "./keyring"

export default class BrowserHDKeyring extends BaseHDKeyring {
  protected static generateMnemonic(strength: number): string {
    const cryptoApi = globalThis.crypto

    if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
      throw new Error(
        "The Web Crypto API crypto.getRandomValues() is required to generate a mnemonic."
      )
    }

    const entropy = new Uint8Array(this.entropyByteLength(strength))
    cryptoApi.getRandomValues(entropy)
    return entropyToMnemonic(entropy)
  }
}
