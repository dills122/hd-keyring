import { validateMnemonic } from "bip39"
import { Bytes, hexlify, isHexString } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"

export function normalizeMnemonic(mnemonic: string): string {
  return mnemonic.trim().toLowerCase().replace(/\s+/g, " ")
}

export function validateAndFormatMnemonic(
  mnemonic: string,
  wordlist?: string[]
): string | null {
  const normalized = normalizeMnemonic(mnemonic)

  if (validateMnemonic(normalized, wordlist)) {
    return normalized
  }
  return null
}

/**
 * @deprecated Use normalizeEVMAddress for values that represent EVM addresses.
 * This helper preserves variable-length hex normalization for existing callers.
 */
export function normalizeHexAddress(address: string | Buffer): string {
  const addressString =
    typeof address === "string" ? address : address.toString("hex")
  const noPrefix = addressString.replace(/^0x/i, "")
  const even = noPrefix.length % 2 === 0 ? noPrefix : `0${noPrefix}`
  return `0x${Buffer.from(even, "hex").toString("hex")}`
}

export function normalizeEVMAddress(address: string | Bytes): string {
  let prefixedAddress: string

  try {
    prefixedAddress =
      typeof address === "string"
        ? `0x${address.replace(/^0x/i, "")}`
        : hexlify(address)
  } catch {
    throw new Error("Invalid EVM address")
  }

  if (!isHexString(prefixedAddress, 20)) {
    throw new Error("Invalid EVM address")
  }

  return hexlify(prefixedAddress)
}

export function toChecksumAddress(address: string, chainId?: number): string {
  const whitelistedChainIds = [30, 31]
  const addressWithOutPrefix = normalizeEVMAddress(address)
    .replace("0x", "")
    .toLowerCase()
  const prefix =
    chainId && whitelistedChainIds.includes(chainId) ? `${chainId}0x` : ""
  const hash = keccak256(
    Buffer.from(`${prefix}${addressWithOutPrefix}`, "ascii")
  ).replace("0x", "")

  const checkSum = Array.from(addressWithOutPrefix)
    .map((_, index): string => {
      if (parseInt(hash[index], 16) >= 8) {
        return addressWithOutPrefix[index].toUpperCase()
      }
      return addressWithOutPrefix[index]
    })
    .join("")

  return `0x${checkSum}`
}

export function isValidChecksumAddress(
  address: string,
  chainId?: number
): boolean {
  return toChecksumAddress(address, chainId) === address
}
