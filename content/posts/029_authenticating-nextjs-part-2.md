+++
title = "Part 2: The Next.js Application"
slug = "authenticating-nextjs-part-2"
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

* [Part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}})
* [Part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
* [Part 3]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}})
* [Part 4]({{< ref "/posts/031_authenticating-nextjs-part-4.md" >}})
* [Part 5]({{< ref "/posts/032_authenticating-nextjs-part-5.md" >}})

## The Next.js app

We are going to be creating a Next.js application that will authenticate into to the RESTful API server we have built in [part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}}).

Our Next.js application will have the following three pages:

```bash
http://localhost:3000/          # home page
http://localhost:3000/login     # login page
http://localhost:3000/dashboard # protected page authed users only
```

As a reminder, the API we are working with has the following API:

```bash
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
```

The first thing that we need to do though is create the directory for our Next.js project, and initialize npm. We also need to create a **pages** directory for Next.js 

```bash
mkdir -p ./pages
cd web
npm init
```

### Install Next.js

After we've gone through the arduous `npm init`, we can install Next.js.

```bash
npm install --save next react react-dom
```

Since Next.js v9.0 has [built in zero config typescript support](https://nextjs.org/blog/next-9#built-in-zero-config-typescript-support) (and because we are not heathens), we will install and use TypeScript.

```bash
npm install --save-dev typescript @types/react @types/node
```

Add the following scripts to your `package.json` file.

```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

### Boot the development server

After we have the `./pages` directory, we can boot the Next.js application. 

```bash
mkdir pages
npm run dev
> ssr-web@1.0.0 dev /Users/jason/go/src/git.jasonraimondi.com/jason/nextjs-jwt-example
> next

[ wait ]  starting the development server ...
[ info ]  waiting on http://localhost:3000 ...
[ info ]  bundled successfully, waiting for typecheck results ...
[ wait ]  compiling ...
[ info ]  bundled successfully, waiting for typecheck results ...
[ ready ] compiled successfully - ready on http://localhost:3000
```

### Add Index page

First things first... I am going to make a reusable `<Links/>` component that we can include on each of our pages.

```jsx
// components/links.tsx

import React from "react";

export function Links() {
  return <ul>
    <li><a href={"/"}>Home</a></li>
    <li><a href={"/login"}>Login</a></li>
    <li><a href={"/dashboard"}>Dashboard (protected)</a></li>
  </ul>
}
```

Now we can add our main index page with two links, one home, and one to a not-yet-existing Login page.

```jsx
// pages/index.tsx

import React from "react";
import { Links } from "../components/links"

function Index() {
  return <Links />;
}

export default Index;
```

{{< image-pop src="/assets/posts/2019/08/only-index-page.gif" alt="Only index page" >}}

### Add Login Page

Now we can add the login form. First let's get a working form that updates our form fields, `inputs` via the React Hook `setInputs`. 

```jsx
// pages/login.tsx

import React, { useState } from "react";
import { Links } from "../components/links";
import { postLogin } from "../services/rest_service";

export type LoginInputs = {
  email: string
  password: string
}

function Login() {
  // these values are hardcoded since our main.go api only accepts this auth combo
  const initialValues: LoginInputs = { email: "rickety_cricket@example.com", password: "shhh!", };

  const [inputs, setInputs] = useState(initialValues);

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    alert(`TODO add login endpoint! ${JSON.stringify(inputs)}`)
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    e.persist();
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email"
               id="email"
               name="email"
               onChange={handleInputChange}
               value={inputs.email}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password"
               id="password"
               name="password"
               onChange={handleInputChange}
               value={inputs.password}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
```

We should be able to now enter our email and password into our login form located at `localhost:3000`

{{< image-pop src="/assets/posts/2019/08/todo-add-login-endpoint.gif" alt="Login Page Success" >}}

There was no actual request being made here, just an alert showing us the form fields we have filled out. The next step will be to make the login POST request and retrieve our Authorization token.

### Add Login API Call

Add a login api call with Axios. I am using axios over fetch because, well... I just havent found good enough documentation on Fetch for me to understand how to use it both in a Node, and Browser context. Axios I am certain works with both, and works well.

```typescript
// services/rest_service.ts

import axios, { AxiosRequestConfig } from "axios";
import { LoginInputs } from "../pages/login";
import { AuthToken } from "./auth_token";
import { catchAxiosError } from "./error";

type errorMessage = string

export const postLogin = async (inputs: LoginInputs): Promise<errorMessage | void> => {
  const data = new URLSearchParams(inputs);
  const res: any = await post("/api/login", data).catch(catchAxiosError);
  if (res.error) {
    return res.error;
  }
  if (res.data && res.data.token) {
    alert(`this is my token: (${res.data.token})`);
    return;
  }
  return "Something unexpected happened!";
};

const baseConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:1323",
};

const post = (url: string, data: URLSearchParams) => {
  return axios.post(url, data, baseConfig).catch(catchAxiosError);
};
```

{{< image-pop src="/assets/posts/2019/08/alert-with-token.gif" alt="Alert with token" >}}

### Create _AuthToken_ class to handle the JWT string

Our _AuthToken_ class will attempt to decode the JWT using the [jwt-decode](https://github.com/auth0/jwt-decode) library. We we will then have methods to check if the token is expired/valid, and what the expiration date is.

```typescript
// services/auth_token.ts

import jwtDecode from "jwt-decode";

export type DecodedToken = {
  readonly email: string;
  readonly exp: number;
}

export class AuthToken {
  readonly decodedToken: DecodedToken;

  constructor(readonly token?: string) {
    // we are going to default to an expired decodedToken and
    // then try and decode the jwt using the jwt-decode lib
    this.decodedToken = { email: "", exp: 0 };
    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
    }
  }

  get authorizationString() {
    return `Bearer ${this.token}`;
  }

  get expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }
}
```

### Store JWT string into cookies

Now that we have the _AuthToken_ class all set up, we need to add functionality to actually store the token into our cookies. 

```typescript
// services/auth_token.ts

import Cookie from "js-cookie";
import Router from "next/router";

const TOKEN_STORAGE_KEY = "myApp.authToken";

export class AuthToken {
  // ...  
  static async storeToken(token: string) {
    Cookie.set(TOKEN_STORAGE_KEY, token);
    await Router.push("/dashboard");
  }
}
```

Remove the alert message and store the token into cookies using the [js-cookie](https://github.com/js-cookie/js-cookie) library.

**Note: You cannot save the _AuthToken_ class into cookie, only the JWT string**, this data is stored with `JSON.stringify()` and loaded with `JSON.parse()`. Therefore you cannot have complex objects in here. 

```javascript
// services/rest_service.ts

export const postLogin = async (inputs: LoginInputs): Promise<errorMessage | void> => {
  // ...
  if (res.data && res.data.token) {
-    alert(`this is my token: (${res.data.token})`);
+    await AuthToken.storeToken(res.data.token);

```

### Add a _privateRoute_ high order component (HOC)

In the `getInitialProps` method of our privateRoute HOC, 

and will immediately redirect the user to the login page. 

An unauthenticated user will NOT be able to access our dashboard pages. 

```jsx
import { NextPageContext } from "next";
import React, { Component } from "react";
import { AuthToken } from "../services/auth_token";
import { redirectToLogin } from "../services/redirect_service";

export type AuthProps = {
  token: string
}

export function privateRoute(WrappedComponent: any) {
  return class extends Component<AuthProps> {
    state = {
      auth: new AuthToken(this.props.token)
    };

    static async getInitialProps(ctx: NextPageContext) {
      // create AuthToken
      const auth = AuthToken.fromNext(ctx);
      const initialProps = { token: auth.token };
      if (auth.isExpired) console.log("hey! server says you shouldnt be here! you are not logged in!");
      if (WrappedComponent.getInitialProps) return WrappedComponent.getInitialProps(initialProps);
      return initialProps;
    }

    componentDidMount(): void {
      this.setState({ auth: new AuthToken(this.props.token) })
    }

    render() {
      return <WrappedComponent auth={this.state.auth} {...this.props} />;
    }
  };
}
```

### Add dashboard page protected by _privateRoute_


```jsx
// pages/dashboard.tsx

import React from "react"
import { Links } from "../components/links";
import { AuthProps, privateRoute } from "../components/private_route";
import { AuthToken } from "../services/auth_token";

type Props = AuthProps;

function Dashboard({ token, auth }: Props) {
  return (
    <Links />
    <p><strong>user</strong>: {auth.decodedToken.email}</p>
    <p><strong>isValid</strong>: {auth.isValid.toString()}</p>
    <p><strong>isExpired</strong>: {auth.isExpired.toString()}</p>
    <p><strong>authorizationString</strong>: {auth.authorizationString}</p>
    <p><strong>expiresAt</strong>: {auth.expiresAt.toString()}</p>
  );
}

export default privateRoute(Dashboard);
```

Remember, private route currently just console logging the auth status and **is not protecting the route yet**.

{{< image-pop src="/assets/posts/2019/08/you-are-not-logged-in.gif" alt="You are not logged in!" >}}

So now lets actually add some protection by creating a function that redirects the user to the login page if they are not already logged in.

### Add a _redirectToLogin_ function

Since Nextjs is a SSR framework, and React is a client side framework, sometimes there are different ways of doing things when you are on the server vs the client. Redirecting is one of those things. 

```typescript
// services/redirect_service.ts

import { ServerResponse } from "http";
import Router from "next/router";

export const redirectToLogin = (server?: ServerResponse) => {
  const login = "/login?redirected=true";
  if (server) {
    // @see https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
    // server rendered pages need to do a server redirect
    server.writeHead(302, {
      Location: login,
    });
    server.end();
  } else {
    // only client side pages have access to next/router
    Router.push(login);
  }
};
```


```typescript
// components/private_route.tsx

import { redirectToLogin } from "../services/redirect_service";

export function privateRoute(WrappedComponent: any) {
  return class extends Component<AuthProps> {
    // ...
    static async getInitialProps(ctx: NextPageContext) {
       // ...
-      if (auth.isExpired) console.log("hey! server says you shouldnt be here! you are not logged in!");
+      if (auth.isExpired) redirectToLogin(ctx.res);
```
Now users will be redirected on login. This redirect happened during the _getInitialProps_ setup, pre initial render. 

{{< image-pop src="/assets/posts/2019/08/redirect-to-login.gif" alt="Shows an unauthorized user attempting to view dashboard and being redirected to login." >}}

### Successful login to dashboard

{{< image-pop src="/assets/posts/2019/08/login-to-dashboard.gif" alt="Login to dashboard" >}}


### Add Logout function

```jsx
  logout = AuthToken.logout

  static async logout() {
    Cookie.remove(TOKEN_STORAGE_KEY);
    await redirectToLogin();
  };
```

```jsx
// pages/dashboard.tsx

import React from "react"
import { AuthProps, privateRoute } from "../components/private_route";

function Page(props: AuthProps) {
  const logout = async () => {
    Cookie.remove(COOKIES.authToken);
    alert("logout");
    await Router.push("/login");
  };

  return <>
    <p>Hello Dashboard</p>
    <p>{JSON.stringify(props.auth)}</p>
    <button onClick={logout}>Logout</button>
  </>
}

export default privateRoute(Page);
```

### Show protected page route
