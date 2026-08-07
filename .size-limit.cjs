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
]
