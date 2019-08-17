+++
title = "Add pre-rendered async rest api calls in getInitialProps()"
slug = "authenticating-nextjs-part-3"
date = "2019-08-16T05:30:00-0700"
description = "Part 3: Authenticating and securing a nextjs application"
tags = [
    "authenticating-nextjs",
    "nextjs",
    "ssr",
    "react",
]
categories = [
    "software",
    "frontend",
    "backend",
]
+++ 

## Overview

* In [the first part]({{< relref "/posts/028_authenticating-nextjs-part-1.md" >}}) we created the JWT secured REST API
* In [the previous part]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}}) we created the user facing Next.js application
* In [this part]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}}) we will be adding pre-render async api calls to our Next.js application

## Source Code

Everything we are working on can be found on GitHub at https://github.com/jasonraimondi/nextjs-jwt-example. For part 3, take a look in the [web](https://github.com/jasonraimondi/nextjs-jwt-example/tree/master/web) directory.

## Add pre-rendered async rest api calls in getInitialProps

We will be creating a Next.js application with an authentication flow, that will allow the an unauthorized user to view unprotected pages. Only logged in users will be able to view pages that will be using our **privateRoute** high order component (HOC).

Note: getInitialProps runs the `JSON.serialize` method.

The goal of this one is to show how ot make pre-rendered async.

## Add ApiCallout component

This is going to be just a dumb component with a message that makes it obvious this part is the api response. 

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

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/api-callout.png" alt="Show the ApiCallout component" portrait="true" >}}


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
  // see the catchAxiosError function here and in the next code section
  return await axios.get(url, baseConfig).catch(catchAxiosError) 
};

// here we will handle the response and return an appropriate message response
const messageFromResponse = (res: any) => {
  let message = "Something unexpected happened!";
  if (res.error) {
    message = res.error;
  } else if (res.data && res.data.message) {
    // this is the "message" returned from our api
    message = res.data.message 
  }
  return message;
};

// existing methods shortened for berevity
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

## Add a pre-render async API call to the index page

Now let's add the `fetchUnrestricted` API call to our [server's unrestricted endpoint]({{< relref "posts/028_authenticating-nextjs-part-1.md#add-the-unrestricted-open-endpoint" >}}) in the asynchronous `getInitialProps` method that is available on all Next.js pages. 

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
    <ApiCallout message={message}/>
    <p>The following is a result of a server side api call pre-render. If you right click and view source, the response from the API call will be visible in the source.</p>
    <p>This is different than say... Inspect Element, which shows the client side rendered content.</p>
    <p>This means that search engines can scrape this page, and immediately see the content, without trusting that the search engines can render SPA's.</p>
  </>;
}

Index.getInitialProps = async (ctx: NextPageContext) => {
  const message: string = await fetchUnrestricted();
  return { message };
};


export default Index;
```

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/show-echo-server-logs-with-frontend-api-call.gif" alt="Shows the echo server logs along side the Next.js application navigation" >}}

Our REST API [from previously]({{< relref "/posts/028_authenticating-nextjs-part-1.md" >}}) needs to be running in order to get a successful response. Neither the index page nor the server's unrestricted endpoint require authorization, so anyone should be able to visit the page successfully, including search engine bots.

## See the api response in the page rendered "View Source"

The following is a result of a server side api call happening in the [`getInitialProps` pre-render method](https://nextjs.org/docs#fetching-data-and-component-lifecycle). If you right click and view source, the response from the API call will be visible in the source. This means that search engines can scrape this page, and immediately see the page without a client side load. 

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/show-api-call-response-in-source.gif" alt="Shows the api call in the html delivered view-source" >}}

The inclusion of the response in **"View Source..."** is the the important part here. **View Source** shows the HTML as it was delivered from the web server to our browser; **Inspect Element** shows the current state of the DOM tree after DOM manipulation by JavaScript.<sup>[[0]](https://www.codebyamir.com/blog/view-source-vs-inspect-element)</sup>

**The difference between a traditional `create-react-app` and a `ssr` Next.js application is the HTML delivered from the web server to the browser.** In a traditional CRA, our HTML would be delivered from the web server to the browser with an identifier marking the entry point of the application such as `id="my-app"`. 

You'd use the `react-dom` library to attach to `#my-app`.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./component/App";

ReactDOM.render(<App />, document.getElementById("my-app"));
```

In this setup, React needs to boot on the client side, and then it can fetch the api response and give it to the browser. The HTML delivered to the browser would look something like:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Create React App - Client Rendered</title>
  </head>
  <body>
    <main id="my-app"></main>
  </body>
  <script src="vendor-bundles-here" ... />
  <script src="app-bundles-here" ... />
</html>
```
  
Now for a server rendered react application, the HTML is delivered from the web server to the browser using the pre-render technique:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Next.js App - Server Rendered</title>
</head>
<body>
<div id="__next">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/dashboard">Dashboard (protected)</a></li>
    </ul>
    <h2><small style="color:grey">API Call:</small> Success! The status is 200</h2>
    <p>The following is a result of a server side api call pre-render. If you right click and view source, the response
        from the API call will be visible in the source.</p>
    <p>This is different than say... Inspect Element, which shows the client side rendered content.</p>
    <p>This means that search engines can scrape this page, and immediately see the content, without trusting that the
        search engines can render SPA&#x27;s.</p></div>
</body>
<script src="vendor-handoff-bundles-here" ... />
<script src="app-handoff-bundles-here" ... />
</html>
```

The exact snapshot of the application is delivered to the browser as HTML content, and then the browser side JavaScript can take it from there, leaving you with a normal React application you've come to know and love.

In this example, this endpoint is a really basic. Imagine if your Next.js application homepage needs to display a list of recipes, or travel destinations. All of your recipe or travel information will be delivered from the webserver directly to the browser. This really helps search engine and other bots scrape your react application and help with SEO.

This can all be done before the initial render, giving the user (or bot) a fully loaded page right from the get-go. Search engine bots will be able to scrape this page and see the entire content available on the first render, without having to put your trust in their client side rendering abilities.

## Add rest call with authorization header

Let's add a function to make a rest call to the restricted route with the proper Authorization header containing the JWT bearer token

```typescript
// services/rest_service.ts

export const fetchRestricted = async (auth: AuthToken) => {
  // add the Authorization header
  const headers: any = { Authorization: auth.authorizationString };
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

Now let's add the `fetchRestricted` method to our asynchronous `getInitialProps` function available on all Next.js pages. We need to pass the required AuthToken to the `fetchRestricted` method so the call will have the proper credentials to view the response.

```jsx
// pages/dashboard.tsx

import React  from "react"
import { ApiCallout } from "../components/api_callout";
import { Links } from "../components/links";
import { AuthProps, privateRoute } from "../components/private_route";
import { AuthToken } from "../services/auth_token";
import { fetchRestricted } from "../services/rest_service";

type Props = AuthProps & {
  message: string
}

function Dashboard({ message, auth }: Props) {
  return <>
    <Links isAuth={auth.isValid}/>
    <ApiCallout message={message} />
    <p><strong>user</strong>: {auth.decodedToken.email}</p>
    <p><strong>isValid</strong>: {auth.isValid.toString()}</p>
    <p><strong>isExpired</strong>: {auth.isExpired.toString()}</p>
    <p><strong>authorizationString</strong>: {auth.authorizationString}</p>
    <p><strong>expiresAt</strong>: {auth.expiresAt.toString()}</p>
    <hr />
  </>
}

// add the fetchRestricted async call to the getInitialProps method
// wait for the response before returning to the browser.
Dashboard.getInitialProps = async ({ auth }: AuthProps) => {
  const message = await fetchRestricted(auth);
  return { message };
};

export default privateRoute(Dashboard);
```

Let's check out the dashboard page responding to us with our full 

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/show-login-and-protected-route-with-api.gif" alt="Show the login and protected route with ssr prerender api call" >}}

And just for good measure, let's show you the HTML source of this page:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Next.js App - Authenticated user viewing server rendered protected page</title>
</head>
<body>
<div id="__next">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/dashboard">Dashboard (protected)</a></li>
        <li><a href="/logout">Logout (protected)</a></li>
    </ul>
    <h2><small style="color:grey">API Call:</small> hello email address: rickety_cricket@example.com</h2>
    <p><strong>user</strong>: rickety_cricket@example.com</p>
    <p><strong>isValid</strong>: true</p>
    <p><strong>isExpired</strong>: false</p>
    <p><strong>authorizationString</strong>: Bearer
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjYyNTkyOTd9.pG6KshrfFPxU27J4zXcjHMlvBoWirTXdoijPXPZ4gLA
    </p>
    <p><strong>expiresAt</strong>: Mon Aug 19 2019 17:01:37 GMT-0700 (Pacific Daylight Time)</p>
    <hr/>
</div>
</body>
</html>
```

## Fin

Code examples can be found on GitHub at https://github.com/jasonraimondi/nextjs-jwt-example.
