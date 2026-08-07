# hd-keyring

A class to manage [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) compatible [hierarchical deterministic (HD) wallets](https://learnmeabitcoin.com/technical/hd-wallets), popular across Bitcoin and Ethereum.

Built to power [Tally](https://tally.cash), the community owned and operated Web3 wallet.

## Building and Developing

### Development Setup

If you’re on macOS, install Homebrew and run `scripts/macos-setup.sh`. Note
that if you don’t have Homebrew or you’re not on macOS, the below information
details what you’ll need. The script additionally sets up pre-commit hooks.

```
$ ./scripts/macos-setup.sh
```

#### Required Software

If you can't use the macOS setup script, here is the software you'll need to
install:

- `nvm`: [Instructions](https://github.com/nvm-sh/nvm#installing-and-updating)
- `Corepack`: installed with Node.js and used to activate the repository's
  pinned pnpm version

### Quickstart

```sh
$ nvm use
$ npm install --global corepack@latest
$ corepack enable pnpm
$ pnpm install --frozen-lockfile
$ pnpm test --watch # start a continuous test that will auto-run with changes
```

Once the continuous test build is running, you can make whatever changes to
the code and make sure tests continue to pass.
