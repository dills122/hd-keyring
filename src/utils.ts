import { Bytes, hexlify } from "@ethersproject/bytes"
import { isValidMnemonic } from "@ethersproject/hdnode"
import { keccak256 } from "@ethersproject/keccak256"
import { toUtf8Bytes } from "@ethersproject/strings"
import { Wordlist } from "@ethersproject/wordlists"

class ArrayWordlist extends Wordlist {
  readonly #words: string[]

  readonly #indices: Map<string, number>

  constructor(words: string[]) {
    super("custom")
    this.#words = words
    this.#indices = new Map(words.map((word, index) => [word, index]))
  }

  getWord(index: number): string {
    return this.#words[index]
  }

  getWordIndex(word: string): number {
    return this.#indices.get(word) ?? -1
  }
}

export function normalizeMnemonic(mnemonic: string): string {
  return mnemonic.trim().toLowerCase().replace(/\r/, " ").replace(/ +/, " ")
}

export function validateAndFormatMnemonic(
  mnemonic: string,
  wordlist?: string[]
): string | null {
  const normalized = normalizeMnemonic(mnemonic)

  const ethersWordlist = wordlist ? new ArrayWordlist(wordlist) : undefined

  if (isValidMnemonic(normalized, ethersWordlist)) {
    return normalized
  }
  return null
}

export function normalizeHexAddress(address: string | Bytes): string {
  const addressString = typeof address === "string" ? address : hexlify(address)
  const noPrefix = addressString.replace(/^0x/, "")
  const even = noPrefix.length % 2 === 0 ? noPrefix : `0${noPrefix}`
  return hexlify(`0x${even}`).toLowerCase()
}

export function toChecksumAddress(address: string, chainId?: number): string {
  const whitelistedChainIds = [30, 31]
  const addressWithOutPrefix = normalizeHexAddress(address)
    .replace("0x", "")
    .toLowerCase()
  const prefix =
    chainId && whitelistedChainIds.includes(chainId) ? `${chainId}0x` : ""
  const hash = keccak256(
    toUtf8Bytes(`${prefix}${addressWithOutPrefix}`)
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
