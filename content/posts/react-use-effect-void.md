---
title: Single line async React.useEffect statements using the void operator
description: Use JavaScript's void operator to create single line async useEffect functions.
slug: return-promises-to-react-use-effect-with-javascript-void
date: 2021-05-11T09:25:00-0700
categories:
- software
- frontend
tags:
- react
- hooks
---

If you are wondering how you can return promises to `useEffect` without React throwing an error, you can use the [`void` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void) in your response.

```ts
useEffect(() => void fetchApi(), []);
```

This allows you to create really compact `useEffect` functions while dealing with promises or async functions.

## Example useEffect with void fetch

Here we compose our async function called `fetchApi` where we handle all of our asynchronous data handling. We can then combine useEffect and void to call the function in a single line. 

```ts
import { useEffect, useState } from "react";

export default function App() {
  const [state, setState] = useState();

  useEffect(() => void fetchApi(), []);

  async function fetchApi() {
    const response = await fetch("https://swapi.dev/api/people/1");
    const data = await response.json();
    setState(data);
  }

  return <p>{state ? state.name : "Loading..."}</p>;
}
```
