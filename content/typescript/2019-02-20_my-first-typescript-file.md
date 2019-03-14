+++
slug = "my-first-typescript-file"
title = "My first TypeScript file"
description = "I am a typescript file"
tags = [
    "typescript",
    "tsc",
]
date = 2019-02-20
+++

Now that you [have Node.js](/posts/installing-nodejs/) and [TypeScript installed](/posts/installing-typescript-from-nodejs/), we can actually get started with TypeScript.

### Creating a function with some TypeScript sprinkled on top.

![File open in visual studio code](/posts/2019/01/my-first-typescript-file.png)

Let's create our first TypeScript file `main.ts` with the following contents:

```javascript
function output(words: string) {
    console.log(words);
}

output("Hello World");
```

This should look really familiar and comfortable to JS developers. Really, the only TypeScript specific markup in this file is just the method argument type defined as `string`;

### Compiling TypeScript into JavaScript with `tsc`

Let's convert it into JavaScript so it can be run in the browser (or with Node.js).

```bash
~/my-first-typescript-file ❯❯❯ ls
main.ts
~/my-first-typescript-file ❯❯❯ tsc main.ts
~/my-first-typescript-file ❯❯❯ ls
main.js main.ts
```

The `tsc` command is taking the content from the `main.ts` file and compiling it into a `main.js` file. 

![File open in visual studio code](/2019/01/my-first-compiled-typescript-file.png)

JavaScript Output:

```javascript
function output(words) { // notice no more `string` type
    console.log(words);
}
output("Hello World");

// output: "Hello World"
```

The `main.js` file looks very similar to it's TypeScript equivalent. The difference is the removal of the arugument type `: string` in `output(words: string)`.
