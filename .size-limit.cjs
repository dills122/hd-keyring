function nodeBundle(path) {
  return {
    path,
    limit: "250 KB",
    modifyEsbuildConfig(config) {
      return {
        ...config,
        platform: "node",
      }
    },
  }
}

module.exports = [
  nodeBundle("dist/hd-keyring.cjs.production.min.js"),
  nodeBundle("dist/hd-keyring.esm.js"),
  {
    path: "dist/hd-keyring.browser.cjs.production.min.js",
    limit: "250 KB",
  },
  {
    path: "dist/hd-keyring.browser.esm.js",
    limit: "250 KB",
  },
]
