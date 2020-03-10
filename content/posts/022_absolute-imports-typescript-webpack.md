+++
slug = "absolute-imports-with-typescript-and-webpack"
title = "Absolute imports with TypeScript and Webpack"
description = "Absolute Imports in TypeScript using the tsconfig path resolver."
date = 2019-02-23
lastmod = 2019-10-01
aliases = [
    "/posts/fully-qualified-name-in-typescript-absolute-imports/",
]
tags = [
  "typescript", 
  "webpack",
  "tsconfig.json"
]
categories = [
    "frontend",
    "backend",
]
comments = true
image = "https://assets.jasonraimondi.com/posts/_covers/graphic-node-TAHXyTpQBck-unsplash.jpg"
+++

Fully Qualified Namespaces allow you to use absolute import paths instead of the relative hell that typically exists.

```javascript
- import { Something } from '../../../models/something';
+ import { Something } from '@/models/something';
```

Normally when using imports, we would reference the path from the relative location of the file you are importing to.

Import syntax

```javascript
import Language from '@/app/components/Language';
import { LanguagePicker, ListType } from '@/app/components/LanguagePicker';

// or require
const iconAll = require('@/icons/infinity.svg');

// or await import
async function infinityIcon() {
    return await import('@/icons/infinity.svg');
}
```

## Configuring the `tsconfig.json` file

You just need to add the **paths** section to the compiler options of the TypeScript configuration file.


// tsconfig.json

```json
{
  "compilerOptions": {
  "paths": {
    "@/*": [
      "*"
    ]
  },
  ...
}
```


### Notice for Webpack users

If you are using Webpack to bundle, you are going to need to add the following to your configuration

// webpack.conf

```javascript
module.export = {
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  }
}
```
