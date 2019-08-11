+++
title = "Part 3: Add pre-rendered async rest api calls in getInitialProps()"
slug = "authenticating-nextjs-part-3"
date = 2019-08-02
draft = true
description = "Authenticating and securing a nextjs application"
tags = [
    "nextjs",
    "react",
]
categories = [
    "frontend",
    "Backend",
]
+++ 
## Overview

We will be creating a Next.js application with an authentication flow, that will allow the an unauthorized user to view unprotected pages. Only logged in users will be able to view pages that will be using our **privateRoute** high order component (HOC).

1. In [part 1]({{< relref "/posts/028_authenticating-nextjs-part-1.md" >}}) we will be creating the REST API
2. In [part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}}) we will be creating the Next.js application
3. In [this part]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}}) we will add pre-render async api calls to our Next.js application

## Add pre-rendered async rest api calls in getInitialProps

Note: getInitialProps runs the `JSON.serialize` method.

The goal of this one is to show how ot make pre-rendered async.

## Add ApiCallout component

```jsx
// components/api_callout.tsx

import React from "react";

export function ApiCallout({ message }: any) {
  const smallStyle = { color: "grey" };
  return <h2>
    <small style={smallStyle}>API Call:</small> {message}
  </h2>
}
```

## Add rest call go unprotected page

If you open up your `services/rest_services.ts` file, you should have the _login_ **POST** method set up from [part 2]({{< relref "/posts/029_authenticating-nextjs-part-2#add-login-api-call" >}}), so now we need to go ahead and make a _fetchUnrestricted_ **GET** method.

```typescript
// services/rest_service.ts
import axios, { AxiosRequestConfig } from "axios";
import { LoginInputs } from "../pages/login";
import { catchAxiosError } from "./error";

// this method hits our unrestricted api endpoint at
// http://localhost:1323/api/unrestricted
export const fetchUnrestricted = async () => {
  const res: any = await get("/api/unrestricted");
  return messageFromResponse(res);
};

// we will create a method that can be shared for multiple consuming endpoints
// this endpoint handles the axios failure, and since we are sharing this, our 
// consumers dont need to keep catching failures up the chain
const get = async (url: string) => {
  return await axios.get(url, baseConfig).catch(catchAxiosError)
};

// here we will handle the response and return an appropriate message response
const messageFromResponse = (res: any) => {
  let message = "Something unexpected happened!";
  if (res.error) {
    message = res.error;
  } else if (res.data && res.data.message) {
    message = res.data.message
  }
  return message;
};

// existing methods folded for berevity
type errorMessage = string;
const baseConfig: AxiosRequestConfig = { baseURL: "http://localhost:1323" };
export const postLogin = async (inputs: LoginInputs): Promise<errorMessage | void> => {...};
const post = (url: string, data: URLSearchParams) => {...};
```

Build resilient code, embrace failures and deal with them, this means we need to handle any Axios errors that may appear, and deal with them accordingly. In this demo application's case, that means just returning an object with error string key.

```typescript
// services/error.ts

import { AxiosError } from "axios";

export type ErrorResponse = {
  error: string
}

export function catchAxiosError(err: AxiosError): ErrorResponse {
  let message = "Something happened in setting up the request that triggered an Error";

  if (err.response) {
    message = err.response.data.message;
  } else if (err.request) {
    message = "The request was made, but no response was received";
  }
  return { error: message };
}
```

## Add to the index page

```jsx
// pages/index.tsx

import { NextPageContext } from "next";
import React from "react";
import { ApiCallout } from "../components/api_callout";
import { Links } from "../components/links";
import { fetchUnrestricted } from "../services/rest_service";

type Props = {
  message: string;
}

function Index({ message }: Props) {
  return <>
    <Links/>
    <p>The following is a result of a server side api call pre-render. If you right click and view source, the response from the API call will be visible in the source.</p>
    <ApiCallout message={message}/>
    <p>This is different than say... Inspect Element, which shows the client side rendered content.</p>
    <p>This means that search engines can scrape this page, and immediately see the content, without trusting that the search engines can render SPA's.</p>
  </>;
}

Index.getInitialProps = async (ctx: NextPageContext) => {
  // await redirectIfAuthenticated(ctx);
  const message: string = await fetchUnrestricted();
  return { message };
};


export default Index;
```
## Add rest call with authorization header

```typescript
// services/rest_service.ts

export const fetchRestricted = async (auth?: AuthToken) => {
  const headers: any = {};
  if (auth) headers.Authorization = auth.authorizationString;
  const res: any = await get("/api/restricted", { headers });
  return messageFromResponse(res);
};

// we need to update our shared get method to receive the config 
// and merge it with our base config before making the request
// which will allow us to pass our Authorization header
const get = async (url: string, config: AxiosRequestConfig = {}) => {
  config = { ...baseConfig, ...config };
  return await axios.get(url, config).catch(catchAxiosError);
};
```

## Add to the dashboard page

## Show view source


### Continue to [part 4.]({{< ref "/posts/031_authenticating-nextjs-part-4.md" >}})

The source code can be found here: https://github.com/jasonraimondi/nextjs-jwt-example

* [Part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}})
* [Part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
* [Part 3]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}})
* [Part 4]({{< ref "/posts/031_authenticating-nextjs-part-4.md" >}})
* [Part 5]({{< ref "/posts/032_authenticating-nextjs-part-5.md" >}})
