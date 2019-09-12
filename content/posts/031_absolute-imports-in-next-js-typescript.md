+++
title = "Absolute Imports in NextJS"
slug = "absolute-imports-in-next-js-typescript"
date = "2019-09-11T05:30:00-0700"
description = ""
draft = true
tags = [
    "nextjs",
    "node",
]
categories = [
    "software",
    "frontend",
]
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
      "@/*": ["*"]
    }
  }
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