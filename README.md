# hd-keyring

A class to manage [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) compatible [hierarchical deterministic (HD) wallets](https://learnmeabitcoin.com/technical/hd-wallets), popular across Bitcoin and Ethereum.

Built to power [Tally](https://tally.cash), the community owned and operated Web3 wallet.

## Node and browser usage

The package publishes separate Node and browser builds behind the same import.
Node uses the operating system's cryptographically secure random source, while
browser-aware bundlers select a build that generates mnemonic entropy with the
native Web Crypto API (`globalThis.crypto.getRandomValues`). No Node `crypto` or
`Buffer` shim is required by the browser entry.

```ts
import HDKeyring from "@tallyho/hd-keyring"

const keyring = new HDKeyring()
const [address] = await keyring.addAddresses()
```

Mnemonic generation requires Web Crypto. Loading an existing mnemonic does not:

```ts
const restored = new HDKeyring({ mnemonic: "..." })
```

The browser build supports environments with `crypto.getRandomValues`, including
Web Workers. Node and browser builds expose the same keyring API and serialized
format.

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
- `yarn`: [Instructions](https://classic.yarnpkg.com/lang/en/docs/install/)

### Quickstart

```sh
$ nvm use
$ npm install -g yarn # if you don't have yarn globally installed
$ yarn install # install all dependencies; rerun with --ignore-scripts if
               # scrypt node-gyp failures prevent the install from completing
$ yarn test --watch # start a continuous test that will auto-run with changes
```

To verify both package builds and execute the browser bundle against a Web
Crypto-only runtime, run `yarn test:browser`.

Once the continuous test build is running, you can make whatever changes to
the code and make sure tests continue to pass.
