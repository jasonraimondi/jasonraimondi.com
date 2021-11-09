---
title: "Connecting Hardhat and Ethers.js to Sveltekit"
slug: "connecting-hardhat-and-ethersjs-to-sveltekit"
date: 2021-11-08T16:56:23-08:00
description: ""
images: 
- /posts/_covers/under-construction.jpg
imageAlt: under construction crane
imageCredit: '@hojipago https://unsplash.com/photos/D46mXLsQRJw'
categories: 
- frontend
tags: 
- dapp
- web3
- svelte
draft: true
toc: false
---

We are going to create a monorepo with two projects:

* `dapp` -- A [hardhat](https://hardhat.org/) project, containing our Solidity contracts and related deployment code. 
* `web` -- A [sveltekit](https://kit.svelte.dev/) application that connects to our hardhat project to use the deployed contracts.

## Install PNPM

PNPM has great workspaces support, and it is my preferred way to manage monorepos. Feel free to use whatever tool you want, the ideas here remain the same across `npm`, `pnpm`, `yarn`, etc.

If you do not already have [PNPM](https://pnpm.io) installed, you can see the proper installation guide [here](https://pnpm.io/installation). A quick way to get going with PNPM is to use `npm install -g pnpm`.

## Create the monorepo

First, let's create a new directory and set up our monorepo.

```bash
mkdir my-dapp-monorepo
cd my-dapp-monorepo
pnpm init -y
touch pnpm-workspace.yaml
echo "node_modules/" > .gitignore
echo ".idea/" >> .gitignore
```

Let's populate our `pnpm-workspace.yaml` file with the following content:

```yaml
workspaces:
  - dapp
  - web
```
Let's save our work in git as an initial commit.

```bash
git init
git add .
git commit -m "init: pnpm init -y"
```

Next let's move onto creating the hardhat application.

## Create the hardhat project

First, let's create the `dapp` directory to use for our hardhat project.

```bash
mkdir dapp
cd dapp
```

Then run the command `pnpx hardhat` and follow the instructions.

```bash
pnpx hardhat

888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.6.8 👷‍

✔ What do you want to do? · Create an advanced sample project that uses TypeScript
✔ Hardhat project root: · hardhat-sveltekit-monorepo/dapp
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-etherscan dotenv eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-prettier eslint-plugin-promise hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage @typechain/ethers-v5 @typechain/hardhat @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/chai @types/node @types/mocha ts-node typechain typescript)? (Y/n) · n
```

The options chosen when creating our hardhat project are the following:

* Create an _advanced sample project that uses TypeScript_
* Create the hardhat _project root at my-dapp-monorepo/dapp_
* _Yes add a .gitignore_
* _No do not install the sample dependencies_ with npm (we will use pnpm instead)

### Install hardhat dependencies with pnpm

Since we didn't use npm to install our hardhat dependencies, now is the time to install then with pnpm.

```bash
pnpm import
rm -f package-lock.json
```

If you are ocd like me and you want to flush our node_modules and have pnpm reinstall from scratch:

```bash
rm -rf node_modules
pnpm install
```

Now let's update our `package.json` and add a name, version, and a few scripts.

```json
{
  "name": "my-hardhat-app",
  "version": "1.0.0",
  "scripts": {
    "node": "hardhat node",
    "deploy": "hardhat run scripts/deploy.ts --network localhost"
  }
}
```

When using the hardhat network with metamask, we need to add the chainId to the hardhat network provider to our `hardhat.config.js` file. If you don't do this, you will run into the error: _Trying to send a raw transaction with an invalid chainId. The expected chainId is 31337._

```json
{
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    }
    ...
}
```

### Boot a local hardhat node and deploy the contracts

In two separate terminals, run the following commands. The first command will start a local hardhat node. We'll leave these running for the remainder of the demo.

```bash
cd dapp
pnpm node
```

The second command will deploy our contracts to the local network.

```bash
cd dapp
pnpm deploy

> my-hardhat-app@ deploy /Users/jason/Code/playground/hardhat-sveltekit-monorepo/dapp
> hardhat run scripts/deploy.ts --network localhost

No need to generate any newer typings.
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Take note of the contract address, we are going to need to use it in our sveltekit project so we can use our contracts.

### Save your hardhat `dapp` project

Let's save our work.

```bash
git add .
git commit -m "init: add hardhat to /dapp"
```

## Create the sveltekit `web` project

Starting in the monorepo root, let's run the pnpm init command to create the sveltekit project.

```bash
cd my-dapp-monorepo
pnpm init svelte@next web

Welcome to SvelteKit!

This is beta software; expect bugs and missing features.

If you encounter a problem, open an issue on https://github.com/sveltejs/kit/issues if none exists already.

✔ Which Svelte app template? › Skeleton project
✔ Use TypeScript? Yes
✔ Add ESLint for code linting? Yes
✔ Add Prettier for code formatting? Yes
```

The options I chose when creating my sveltekit project are the following:

* Create a _Skeleton project_
* _Yes, use TypeScript_
* _Yes, use ESLint_
* _Yes, use Prettier_

Feel free to choose whatever you want, it's up to you.

```bash
cd web
pnpm install
```

Now we have an empty sveltekit project, we can start by "installing" both our dapp project and ethers into the sveltekit project.

## Connect our hardhat workspace to our sveltekit project

```bash
pnpm add my-hardhat-app
```

This is going to add a workspace dependency in our `package.json` that will look like the following.

```json
{
  "dependencies": {
    "my-hardhat-app": "workspace:^1.0.0",
    ...
  },
  ...
}
```

This will allow us to use our dapp project in our sveltekit project as if it was any other installed node_module.

### Install ethers dependencies to sveltekit

```bash
pnpm add ethers @ethersproject/providers
```

### Load ethers and the Greeter contract into svelte

```svelte
<!-- src/routes/index.svelte -->
<script lang="ts">
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';

  // this is where we are importing our contract artifacts from our dapp workspace
  import GreeterArtifact from 'my-hardhat-app/artifacts/contracts/Greeter.sol/Greeter.json';
  import type { Greeter } from 'my-hardhat-app/typechain';

  import Greeting from '$lib/components/Greeting.svelte';
  import SetGreeting from '$lib/components/SetGreeting.svelte';

  let hasEth = false;
  let userAddress: string;
  let contract: Greeter;

  onMount(() => {
    // @see https://docs.metamask.io/guide/mobile-best-practices.html#provider-availability
    if (window.ethereum) {
      initializeEthereum();
    } else {
      window.addEventListener('ethereum#initialized', initializeEthereum, { once: true });
      setTimeout(initializeEthereum, 3000);
    }
  });

  function initializeEthereum() {
    if (window.ethereum?.isMetaMask) {
      hasEth = true;

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      contract = new ethers.Contract(
        import.meta.env.VITE_GREETER_ADDRESS,
        GreeterArtifact.abi,
        provider.getSigner(0)
      ) as Greeter;
    }
  }

  async function initializeWallet() {
    await setCurrentAddress();

    window.ethereum.on('accountsChanged', async ([userAddress]) => {
      await setCurrentAddress(userAddress);
    });

    window.ethereum.on('chainChanged', async () => {
      await setCurrentAddress();
    });
  }

  async function setCurrentAddress(address?: string) {
    if (!address) [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (typeof address === 'string') {
      userAddress = address;
    } else {
      userAddress = undefined;
    }
  }
</script>

{#if !hasEth}
  <p>You need to install <a href="https://metamask.io/">MetaMask!</a></p>
{:else if userAddress && contract}
  <Greeting contract={contract} />
  <hr>
  <SetGreeting contract={contract} />
{:else}
  <p>Connect your wallet to get started.</p>
  <button type="button" on:click={initializeWallet}>Connect Wallet</button>
{/if}
```

```svelte
<!-- Greeting.svelte -->
<script lang="ts">
  import type { Greeter } from 'my-hardhat-app/typechain';

  export let contract: Greeter;
  let greeting: string;

  async function greet() {
    greeting = await contract.greet();
  }
</script>

<div>
  <p>Greeting: {greeting}</p>
  <button type="button" on:click={greet}>Fetch Greeting</button>
</div>
```

```svelte
<!-- SetGreeting.svelte -->
<script lang="ts">
  import type { Greeter } from 'my-hardhat-app/typechain';

  export let contract: Greeter;
  let setGreetingValue: string;

  async function setGreeting() {
    await contract.setGreeting(setGreetingValue);
    setGreetingValue = "";
  }
</script>

<div>
  <p>Update Greeting</p>
  <input type="text" bind:value={setGreetingValue} />
  <button type="button" on:click={setGreeting}>Set Greeting</button>
</div>
```