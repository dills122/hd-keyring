#!/usr/bin/env node

const fs = require("fs")
const os = require("os")
const path = require("path")
const { spawnSync } = require("child_process")

const projectRoot = path.resolve(__dirname, "..")
const distDirectory = path.join(projectRoot, "dist")
const temporaryDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "hd-keyring-browser-build-")
)
const dtsCli = require.resolve("dts-cli/dist/index.js")

function build(entry, target) {
  const result = spawnSync(
    process.execPath,
    [dtsCli, "build", "--entry", entry, "--target", target],
    {
      cwd: projectRoot,
      stdio: "inherit",
    }
  )

  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

function browserFilename(filename) {
  return filename.replace("hd-keyring.", "hd-keyring.browser.")
}

function rewriteSourceMapReference(contents, filename) {
  return contents.replace(
    /hd-keyring\.(cjs\.(?:development|production\.min)|esm)\.js/g,
    browserFilename(filename).replace(/\.map$/, "")
  )
}

function removeTemporaryDirectory(directory) {
  fs.readdirSync(directory).forEach((filename) => {
    fs.unlinkSync(path.join(directory, filename))
  })
  fs.rmdirSync(directory)
}

try {
  build("./src/browser.ts", "browser")

  fs.readdirSync(distDirectory)
    .filter((filename) => /^hd-keyring\..*\.js(?:\.map)?$/.test(filename))
    .forEach((filename) => {
      fs.copyFileSync(
        path.join(distDirectory, filename),
        path.join(temporaryDirectory, filename)
      )
    })

  build("./src/index.ts", "node")

  fs.readdirSync(temporaryDirectory).forEach((filename) => {
    const targetFilename = browserFilename(filename)
    const sourcePath = path.join(temporaryDirectory, filename)
    const targetPath = path.join(distDirectory, targetFilename)
    const contents = fs.readFileSync(sourcePath, "utf8")

    fs.writeFileSync(
      targetPath,
      rewriteSourceMapReference(contents, filename),
      "utf8"
    )
  })

  fs.writeFileSync(
    path.join(distDirectory, "browser.js"),
    `'use strict'\n\nif (process.env.NODE_ENV === 'production') {\n  module.exports = require('./hd-keyring.browser.cjs.production.min.js')\n} else {\n  module.exports = require('./hd-keyring.browser.cjs.development.js')\n}\n`,
    "utf8"
  )
} finally {
  removeTemporaryDirectory(temporaryDirectory)
}
