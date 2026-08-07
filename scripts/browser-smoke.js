#!/usr/bin/env node

const fs = require("fs")
const os = require("os")
const path = require("path")
const vm = require("vm")
const { buildSync } = require("esbuild")

const projectRoot = path.resolve(__dirname, "..")
const outputPath = fs.mkdtempSync(
  path.join(os.tmpdir(), "hd-keyring-browser-smoke-")
)
const entryPath = path.join(outputPath, "entry.js")

fs.writeFileSync(
  entryPath,
  `module.exports = require(${JSON.stringify(projectRoot)})\n`,
  "utf8"
)

function removeOutputDirectory(directory) {
  fs.readdirSync(directory).forEach((filename) => {
    fs.unlinkSync(path.join(directory, filename))
  })
  fs.rmdirSync(directory)
}

try {
  const result = buildSync({
    bundle: true,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    entryPoints: [entryPath],
    format: "iife",
    globalName: "HDKeyringPackage",
    metafile: true,
    outfile: path.join(outputPath, "bundle.js"),
    platform: "browser",
  })

  const nodePolyfills = Object.keys(result.metafile.inputs).filter((name) =>
    /(?:crypto-browserify|node-libs-browser|randombytes|\/bip39\/)/.test(name)
  )

  if (nodePolyfills.length > 0) {
    throw new Error(
      `Browser bundle contains Node compatibility modules:\n${nodePolyfills.join(
        "\n"
      )}`
    )
  }

  let randomValueCalls = 0
  const context = {
    ArrayBuffer,
    BigInt,
    DataView,
    Promise,
    TextDecoder,
    TextEncoder,
    Uint8Array,
    clearTimeout,
    console,
    crypto: {
      getRandomValues(bytes) {
        randomValueCalls += 1
        bytes.fill(7)
        return bytes
      },
    },
    setTimeout,
  }
  context.globalThis = context
  context.self = context
  context.window = context

  vm.runInNewContext(
    fs.readFileSync(path.join(outputPath, "bundle.js"), "utf8"),
    context
  )

  const BrowserHDKeyring = context.HDKeyringPackage.default
  const keyring = new BrowserHDKeyring()
  const addresses = keyring.addAddressesSync()

  if (randomValueCalls !== 1) {
    throw new Error("Browser keyring did not use crypto.getRandomValues().")
  }
  if (!/^0x[0-9a-f]{40}$/.test(addresses[0])) {
    throw new Error("Browser keyring did not derive a valid address.")
  }

  process.stdout.write(
    "Browser bundle built without Node crypto shims and executed with Web Crypto.\n"
  )
} finally {
  removeOutputDirectory(outputPath)
}
