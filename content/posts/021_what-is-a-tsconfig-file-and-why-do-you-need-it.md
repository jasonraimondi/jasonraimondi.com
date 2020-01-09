+++
slug = "what-is-a-tsconfig-file-and-why-do-you-need-it"
title = "What is a tsconfig.json file and why do I need it?"
description = "Adding this file will give you some control on the compilation of TypeScript into JavaScript."
date = 2019-02-21
tags = [
    "typescript",
    "tsconfig.json",
    "tsc",
]
categories = [
    "frontend",
    "backend",
]
comments = true
image = "https://d265ybhz09ikd5.cloudfront.net/posts/_covers/sam-loyd-qy27JnsH9sU-unsplash.jpg"
+++

The `tsconfig.json` file is the main configuration file for TypeScript. Similar to how the `package.json` file in a directory identifies the presence of a Node.js project (or at least node modules), the `tsconfig.json` file identifies the presence of TypeScript files in the project. 

Adding this file will give you some control on the compilation of TypeScript into JavaScript.

You can generate a new `tsconfig.json` file by using the flag `--init`.

```bash
$ tsc --init
message TS6071: Successfully created a tsconfig.json file.
```


* **target** - JavaScript syntax output ()
* **rootDir** - Project source directory directory 
* **outDir** - Output directory for your built JavaScript files, this directory would typically be added to the gitignore.
* **module** - Don't really worry about the depths of this one just yet, for now, we'll use "commonjs"

If you open up the `tsconfig.json`, that is going to be a pretty big and intimidating file. There are a lot of options and configurations you can make for the `tsc` compiler, but you dont need to worry about most of these right now. 

A simple `tsconfig.json` file to get started with that will take the TypeScript files in a directory `src` and output them into a directory `dist`. It will compile your JavaScript for the most backwards compatibility.

```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src"
    }
}
```

### Example

```bash
$ ls
tsconfig.json
$ cat tsconfig.json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src"
    }
}
```

```bash
$ mkdir {src,dist}
$ echo 'console.log("Hello World!");' > src/main.ts
$ cat src/main.ts
console.log("Hello World!");
```

```bash
$ ls -alR
./:
dist
src
tsconfig.json

./dist:

./src:
main.ts
```

```bash
$ tsc
$ ls -alR
./:
dist
src
tsconfig.json

./dist:
main.js

./src:
main.ts
```

```bash
$ cat dist/main.js
console.log("Hello World!");
```

A full settings and configuration can be seen on the [offical typescriptlang docs](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or the more [detailed configuration options](https://www.typescriptlang.org/docs/handbook/compiler-options.html).
