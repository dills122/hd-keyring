import BrowserHDKeyring from "../src/browser"

const validMnemonic =
  "square time hurdle gospel crash uncle flash tomorrow city space shine sad fence ski harsh salt need edit name fold corn chuckle resource else"

describe("BrowserHDKeyring", () => {
  const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, "crypto")

  afterEach(() => {
    if (originalCrypto) {
      Object.defineProperty(globalThis, "crypto", originalCrypto)
    } else {
      Reflect.deleteProperty(globalThis, "crypto")
    }
  })

  it("uses Web Crypto to generate mnemonic entropy", () => {
    const getRandomValues = jest.fn(
      <T extends ArrayBufferView>(array: T): T => {
        new Uint8Array(array.buffer, array.byteOffset, array.byteLength).fill(7)
        return array
      }
    )
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: { getRandomValues },
    })

    const keyring = new BrowserHDKeyring()

    expect(getRandomValues).toHaveBeenCalledTimes(1)
    expect(getRandomValues.mock.calls[0][0]).toHaveLength(32)
    expect(keyring.addAddressesSync()[0]).toMatch(/^0x[0-9a-f]{40}$/)
  })

  it("does not require Web Crypto when restoring a mnemonic", () => {
    Reflect.deleteProperty(globalThis, "crypto")

    const keyring = new BrowserHDKeyring({ mnemonic: validMnemonic })

    expect(keyring.addAddressesSync()).toEqual([
      "0xca19be978a1d2456d16bde3efb0a5b8946f4a1ce",
    ])
  })

  it("fails clearly when Web Crypto is unavailable for generation", () => {
    Reflect.deleteProperty(globalThis, "crypto")

    expect(() => new BrowserHDKeyring()).toThrow(
      "The Web Crypto API crypto.getRandomValues() is required to generate a mnemonic."
    )
  })
})
