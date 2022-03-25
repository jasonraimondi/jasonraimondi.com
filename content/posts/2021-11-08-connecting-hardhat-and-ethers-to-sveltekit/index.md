---
title: "Connecting Hardhat and Ethers.js to Sveltekit"
slug: "connecting-hardhat-and-ethersjs-to-sveltekit"
date: 2021-11-08T16:56:23-08:00
description: ""
images: 
- /covers/under-construction.jpg
categories: 
- frontend
tags: 
- dapp
- web3
- svelte
draft: true
---

We are going to create a monorepo with two projects:

* `dapp` -- The [Hardhat](https://hardhat.org/) project, containing our Solidity contracts and related deployment code. 
* `web` -- The [SvelteKit](https://kit.svelte.dev/) web gui that uses our Solidity contracts.

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
# pnpm-workspace.yaml
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

[Example Repository](https://github.com/jasonraimondi/my-dapp-monorepo/commit/b696c758ff8892f63ab0eec93c3ea138dbcd3c10)

Next let's move onto creating the hardhat application.

## Create the hardhat project

First, let's create the `dapp` directory to use for our hardhat project.

```bash
mkdir dapp
cd dapp
```

Then run the command `pnpx hardhat` and follow the instructions to create a sample project.

```md
$ pnpx hardhat

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
✔ Do you want to add a .gitignore? (Y/n) · Y
✔ Do you want to install this sample project's dependencies with npm (...)? (Y/n) · N
```
Note: **No** for the last selection about installing dependencies with npm

### Install hardhat dependencies with pnpm

Since we didn't use npm to install our hardhat dependencies with npm, we can add them with pnpm.

```bash
pnpm add -D hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-etherscan dotenv eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-prettier eslint-plugin-promise hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage @typechain/ethers-v5 @typechain/hardhat @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/chai @types/node @types/mocha ts-node typechain typescript
```

Now let's update our `package.json` and add a name, version, and a few scripts. The name and version are necessary so you can install this package into our SvelteKit app.

```json
// dapp/package.json
{
  "name": "my-hardhat-app",
  "version": "1.0.0",
  "scripts": {
    "compile": "hardhat compile",
    "node": "hardhat node",
    "deploy": "hardhat run scripts/deploy.ts --network localhost"
  }
}
```

### MetaMask quirk

When using the [hardhat network with metamask](https://hardhat.org/metamask-issue.html), we need to add the chainId to the hardhat network provider to our `hardhat.config.js` file.

If you see the error `Trying to send a raw transaction with an invalid chainId. The expected chainId is 31337.`, this is why.

```js
// dapp/hardhat.config.js
{
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
}
```

### Save your hardhat `dapp` project

Let's save our work.

```bash
git add .
git commit -m "init: add hardhat to /dapp"
```

[Example Repository](https://github.com/jasonraimondi/my-dapp-monorepo/tree/0f8300cfb4a938e6f78cbe01eceffd4c4cf1857e)

### Compile our contracts

We need to [compile our contracts](https://hardhat.org/guides/compile-contracts.html) into artifacts that we can use in our SvelteKit app.

```bash
pnpm compile
```

The compiled contracts can be found in the `dapp/artifacts/` directory, and are ignored by git.

### Boot a local hardhat node and deploy the contracts

In two separate terminals, run the following commands. The first command will start a local hardhat node. We'll leave these running for the remainder of the demo.

```bash
cd dapp
pnpm node
```

The second command will deploy our contracts to the local network.

```md
$ cd dapp
$ pnpm deploy

> my-hardhat-app@ deploy /Users/jason/Code/playground/hardhat-sveltekit-monorepo/dapp
> hardhat run scripts/deploy.ts --network localhost

No need to generate any newer typings.
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Take note of the contract address, we are going to need to use it in our SvelteKit project as `VITE_GREETER_ADDRESS` so we can use our contracts.


## Create the SvelteKit `web` project

Starting in the monorepo root, let's run the pnpm init command to create the SvelteKit project.

```md
$ cd my-dapp-monorepo
$ pnpm init svelte@next web

Welcome to SvelteKit!

This is beta software; expect bugs and missing features.

If you encounter a problem, open an issue on https://github.com/sveltejs/kit/issues if none exists already.

✔ Which Svelte app template? › Skeleton project
✔ Use TypeScript? Yes
✔ Add ESLint for code linting? Yes
✔ Add Prettier for code formatting? Yes
```

Feel free to choose whatever you want, it's up to you. My example will be using TypeScript.

```bash
cd web
pnpm install
```

Now we have an empty SvelteKit project, we can start by "installing" both our dapp project and ethers into the SvelteKit project.

## Connect our hardhat workspace to our SvelteKit project

```bash
pnpm add my-hardhat-app
```

This is going to add a workspace dependency in our `package.json` that will look like the following.

```json
// web/package.json
{
  "dependencies": {
    "my-hardhat-app": "workspace:^1.0.0",
    ...
  },
  ...
}
```

This will allow us to use our dapp project in our SvelteKit project as if it was any other installed node_module.

### Install ethers dependencies to sveltekit

```bash
pnpm add ethers @ethersproject/providers
```

Then let's just commit and push to git to save our progress so far.

```bash
cd my-dapp-monorepo
git add .
git commit -m "init: install sveltekit and ethers to web/"
```

### Identify and load user wallet and address

Let's update the `index.svelte` file in our routes and add an `onMount` event that checks if we have `window.ethereum` available. 

```svelte
<!-- web/src/routes/index.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let hasEth = false;
  let userAddress: string|undefined;

  onMount(() => {
    if (!window.ethereum) return;
    hasEth = true;
  });

  async function initializeWallet() {
    await setCurrentAddress();

    // check if the user switches wallets and update current address
    window.ethereum.on('accountsChanged', async ([userAddress]) => {
      await setCurrentAddress(userAddress);
    });
  }

  async function setCurrentAddress(address?: string) {
    // I am not convinced this is the best method to get the current address, but it works for now.
    if (!address) [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = typeof address === "string" ? address : undefined;
  }
</script>

{#if !hasEth}
  <p>You need to install <a href="https://metamask.io/">MetaMask!</a></p>
{:else if !userAddress}
  <p>Connect your wallet to get started.</p>
  <button type="button" on:click={initializeWallet}>Connect Wallet</button>
{:else}
  <p>Your address is {userAddress}</p>
{/if}
```

### Add types to `window.ethereum`

If you are using typescript you might need to give a typing to `window.ethereum`. 

```typescript
// web/src/global.d.ts
declare global {
  interface Window {
    ethereum: any;
  }
}
```

If you happen to know how to type `window.ethereum` better than `any`, please shoot me a tweet at {{< twitter >}} and let me know. I tried to find actual typings and was unsuccessful. 

### Save our client

Now that we have connected our Svelte application to metamask, let's save our work.

```bash
git add .
git commit -m "feat: connect client to metamask wallet"
```

### Load the Greeter contract into SvelteKit using Ethers

```svelte
<!-- web/src/routes/index.svelte -->
<script lang="ts">
  import { ethers } from 'ethers';
  import { onMount } from 'svelte';

  // this is where we are importing our contract artifacts from our dapp workspace
  import GreeterArtifact from 'my-hardhat-app/artifacts/contracts/Greeter.sol/Greeter.json';
  import type { Greeter } from 'my-hardhat-app/typechain';

  import Greeting from '$lib/components/Greeting.svelte';
  import SetGreeting from '$lib/components/SetGreeting.svelte';

  let hasEth = false;
  let userAddress: string|undefined;
  let greeter: Greeter;

  onMount(() => {
    if (!window.ethereum) return;
    
    hasEth = true;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    greeter = new ethers.Contract(
      import.meta.env.VITE_GREETER_ADDRESS,
      GreeterArtifact.abi,
      provider.getSigner(0),
    ) as Greeter;
  });

  async function initializeWallet() {
    await setCurrentAddress();

    // check if the user switches wallets and update current address
    window.ethereum.on('accountsChanged', async ([userAddress]) => {
      await setCurrentAddress(userAddress);
    });

    // check if the user switches network chain and update current address
    window.ethereum.on('chainChanged', async () => {
      await setCurrentAddress();
    });
  }

  async function setCurrentAddress(address?: string) {
    if (!address) [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = typeof address === "string" ? address : undefined;
  }
</script>

{#if !hasEth}
  <p>You need to install <a href="https://metamask.io/">MetaMask!</a></p>
{:else if userAddress && greeter}
  <GetGreeting contract={greeter} />
  <hr>
  <SetGreeting contract={greeter} />
{:else}
  <p>Connect your wallet to get started.</p>
  <button type="button" on:click={initializeWallet}>Connect Wallet</button>
{/if}
```

#### OnMount

```typescript
let hasEth = false;
let greeter: Greeter;

onMount(() => {
  if (!window.ethereum) return;

  hasEth = true;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  greeter = new ethers.Contract(
    import.meta.env.VITE_GREETER_ADDRESS,
    GreeterArtifact.abi,
    provider.getSigner(0),
  ) as Greeter;
});
```

In our `onMount` function, we are first checking to see if `window.ethereum` exists. This check makes sure the user has an ethereum wallet installed and available to use. In my case, I'm using MetaMask.

Once we know that we have a wallet installed, we then need to create a new contract `Greeter` that we are going to use in the `GetGreeting` and `SetGreeting` components.

#### Initialize Wallet

```typescript
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
  userAddress = typeof address === "string" ? address : undefined;
}
```

When we initialize our wallet, we are also going to add event listeners using the ethereum object to watch for either `accountsChanged` or `chainChanged`. These events are fired when the user changes their wallet address, or when the user changes the chain.

When either the `accountsChanged` or `chainChanged` event is fired, we are calling `setCurrentAddress` with the new address.

### GetGreeting

```svelte
<!-- web/src/lib/components/GetGreeting.svelte -->
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

This component [retrieves the current message](https://github.com/jasonraimondi/my-dapp-monorepo/blob/0f8300cfb4a938e6f78cbe01eceffd4c4cf1857e/dapp/contracts/Greeter.sol#L14-L16) in the contract.

### SetGreeting

```svelte
<!-- web/src/lib/components/SetGreeting.svelte -->
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

This component [sets the current message](https://github.com/jasonraimondi/my-dapp-monorepo/blob/0f8300cfb4a938e6f78cbe01eceffd4c4cf1857e/dapp/contracts/Greeter.sol#L18-L21) in the contract.

This is going to prompt a MetaMask transaction requiring you to pay a small gas fee. 

### Dotenv

```env
# web/src/.env
VITE_GREETER_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```
