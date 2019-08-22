+++
title = "Secure a Next.js application with JWT and a private route higher order component"
slug = "secure-a-next-js-application-with-jwt-and-a-private-route-higher-order-component"
date = "2019-08-16T04:30:00-0700"
description = "Authenticating and securing a nextjs application"
aliases = [
    "/posts/authenticating-nextjs-part-2/",
]
tags = [
    "authenticating-nextjs",
    "nextjs",
    "ssr",
    "react",
]
categories = [
    "frontend",
    "backend",
    "software",
]
+++ 

## Overview

* In [the previous part]({{< relref "/posts/028_authenticating-nextjs-part-1.md" >}}) we created the JWT secured REST API
* In [this part]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}}) we will be creating the user facing Next.js application
* In [the next part]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}}) we will add pre-render async api calls to our Next.js application

## Source Code

Everything we are working on can be found on GitHub at https://github.com/jasonraimondi/nextjs-jwt-example. For this part, take a look in the [web](https://github.com/jasonraimondi/nextjs-jwt-example/tree/master/web) directory.

## The Next.js app

Here we will be creating a Next.js application with an authentication flow that will allow an unauthorized user to view only unprotected pages. Logged in users will be able to view pages that will be protected from unauthorized access by using our **privateRoute** higher order component (HOC).

The basic flow of the application contains three parts.

1. An unauthenticated user lands on the **home page**. This page is visible to _any_ user, authenticated or not.
2. The user then can navigate to the **login page**. And proceed to fill the form. 
3. After a successful login, the user will then be redirected to the **dashboard page**. This dashboard is only accessible by an authenticated user. Any unauthenticated user will be redirected back to the **login page**.  

The server has the following API:

```bash
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
```

Our Next.js application will have the following three pages:

```bash
http://localhost:3000/          # home page
http://localhost:3000/login     # login page
http://localhost:3000/dashboard # protected page authed users only
```

## Install Next.js with TypeScript

The first thing that we need to do though is create the directory for our Next.js project, and initialize npm. We are also going to need to create a **pages** directory for Next.js or it will freak out.

```bash
mkdir -p ./pages
npm init
```

After we've gone through the arduous `npm init`, we can install Next.js.

```bash
npm install --save next react react-dom
```

Since Next.js v9.0 has [built in zero config typescript support](https://nextjs.org/blog/next-9#built-in-zero-config-typescript-support) (and because we are not heathens), we will install and use TypeScript.

```bash
npm install --save-dev typescript @types/react @types/node
```

### Add the Development Scripts

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

### Boot the Next development server

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

I am going to make a reusable `<Links/>` component that we can include on each of our pages. This is going to be the navigation between our application.

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

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/only-index-page.gif" alt="Only index page" >}}

### Add Login Page

Now we can add the login form. First let's get a working form that updates our form fields.

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
  const initialValues: LoginInputs = { 
    email: "rickety_cricket@example.com", 
    password: "shhh!", 
  };

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

  return <>
    <Links />
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
  </>;
}

export default Login;
```

We should be able to now enter our email and password into our login form located at `http://localhost:3000`

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/todo-add-login-endpoint.gif" alt="Login Page Success" >}}

There was no actual request being made here, just an alert showing us the form fields we have filled out. The next step will be to make the login POST request and retrieve our Authorization token.

### Add Login API Call

I am using axios over fetch because, well... I just havent found good enough documentation on Fetch for me to understand how to use it both in a Node, and Browser context. Axios I am certain works with both, and works well.

Now let's create an _postLogin_ api call with [axios](https://github.com/axios/axios).

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

// a base configuration we can extend from
const baseConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:1323",
};

const post = (url: string, data: URLSearchParams) => {
  return axios.post(url, data, baseConfig).catch(catchAxiosError);
};
```

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/alert-with-token.gif" alt="Alert with token" >}}

### Create **AuthToken** class to handle the JWT string

Our **AuthToken** class will attempt to decode the JWT using the [jwt-decode](https://github.com/auth0/jwt-decode) library. We we will then have methods to check if the token is expired/valid, and what the expiration date is.

The decoded JWT will contain the authenticated users _email_ and _expiresAt_ timestamp.  

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
    // we are going to default to an expired decodedToken
    this.decodedToken = { email: "", exp: 0 };

    // then try and decode the jwt using jwt-decode
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

We store our token into cookies instead of localstorage or sessionstorage because we want the token to be available to both the client and the server. Only on the client, in the browser, is local and session storage available.

Now that we have the **AuthToken** class all set up, we need to add functionality to actually store the token into our cookies. 

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

Remove the alert message and store the JWT string into cookies using the [js-cookie](https://github.com/js-cookie/js-cookie) library.

**Note: You should save the JWT string and not the entire AuthToken class into cookies,** as it will be flattened into a JSON string, and returned as a standard object when retrieved. This means that any functions (such as our `isValid` getter methods) will not be available until reinitialized as an AuthToken.

```typescript
// services/rest_service.ts

export const postLogin = async (inputs: LoginInputs): Promise<errorMessage | void> => {
  // ...
  if (res.data && res.data.token) {
     // ...
-    alert(`this is my token: (${res.data.token})`);
+    await AuthToken.storeToken(res.data.token);
  }
  // ...
}
```

### Add a _privateRoute_ higher order component (HOC) to secure the app from unauthorized access

A HOC is effectively a [decorator](https://en.wikipedia.org/wiki/Decorator_pattern) on a React component. 

{{< quote author="React Docs" link="https://reactjs.org/docs/higher-order-components.html" >}}
Concretely, a **higher-order component** is a function that takes a component and returns a new component.
{{< /quote >}}

Now we are going to add a **privateRoute** [high order component](https://reactjs.org/docs/higher-order-components.html) that will handle the authorization check in the pre-render method `async getInitialProps`.

Our **privateRoute** function will be decorating any React component with some authorization checks. It is attaching to the Next.js/React lifecycle methods and and updating accordingly.  

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
      const initialProps = { auth };
      // if the token is expired, that means the user is no longer (or never was) authenticated
      // and if we allow the request to continue, they will reach a page they should not be at.
      if (auth.isExpired) console.log("hey! server says you shouldnt be here! you are not logged in!");
      if (WrappedComponent.getInitialProps) {
        const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
        // make sure our `auth: AuthToken` is always returned
        return { ...wrappedProps, auth };
      }
      return initialProps;
    }

    componentDidMount(): void {
      // since getInitialProps returns our props after they've JSON.stringify
      // we need to reinitialize it as an AuthToken to have the full class
      // with all instance methods available
      this.setState({ auth: new AuthToken(this.props.token) })
    }

    render() {
      // we want to hydrate the WrappedComponent with a full instance method of
      // AuthToken, the existing props.auth is a flattened auth, we want to use
      // the state instance of auth that has been rehydrated in browser after mount
      const { auth, ...propsWithoutAuth } = this.props;
      return <WrappedComponent auth={this.state.auth} {...propsWithoutAuth} />;
    }
  };
}
```

In the **getInitialProps** method of our _privateRoute_ HOC, we are going to create a new **AuthToken** that will be initialized from the **NextPageContext**.

If the token is expired, the user is not authorized to view this page, and will (eventually be) redirected to the login page. For now, we are going to `console.log` yell at our user. These logs will appear in your Next.js server side log output. This check is happening pre-browser render, and therefore the console log will not be visible in the browser.

Now, for any page that we want to protect, all we need to do is wrap the component in a **privateRoute**. We'll see an example in the following section.

In addition to authorization checks, one more thing that this HOC does is make the **AuthToken** class available to the wrapped component.

This will allow **WrappedComponent** to access the **AuthToken** class as a prop of key **auth** that is "magically" available.

### Add dashboard page protected by _privateRoute_

We are going to be creating a dashboard page that is only going to be visible to our authenticated users. All we need to do do make this happen is pass our **Dashboard** component through the **privateRoute** as it is being exported. 

We are able to access the key **auth** off of the props passed into the **Dashboard** component kind of magically. 

```jsx
// pages/dashboard.tsx

import React from "react"
import { Links } from "../components/links";
import { AuthProps, privateRoute } from "../components/private_route";
import { AuthToken } from "../services/auth_token";

type Props = AuthProps;

function Dashboard({ auth }: Props) {
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

Remember, private route **is not yet protecting the route**; currently it is just emitting a `console.log` function with the current auth status. What is happening is that we are noticing the token is void, running a `console.log`, and letting the unauthorized user access the page. 


{{< 
  image/pop 
  src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/you-are-not-logged-in.gif" 
  alt="Shows a non-authenticated user visiting the dashboard page, and the AuthToken contents are all saying the token is not valid and is expired." 
>}}

Note the values of our **AuthToken** in are all indicating that the email of the authenticated user is an empty string, the token is expired, and is not authenticated. This is because I am accessing this page as a user that has not logged in.

So now lets actually add some protection by creating a function that redirects the user to the login page if they are not already logged in.

### Add a _redirectToLogin_ function

Since Next.js is a SSR framework, and React is a client side framework, sometimes there are different ways of doing things when you are on the server vs the client. Redirecting is one of those things.

Next will yell at you via the console if you are trying to access the `import Router from "next/router"` while the code is still executing on the server.

Let's add a function that can handle a redirect to a login page from both the client and the server.

```typescript
// services/redirect_service.ts

import { ServerResponse } from "http";
import Router from "next/router";

export const redirectToLogin = (server?: ServerResponse) => {
  // add the redirected query param for debugging
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

I went ahead and added the `?redirected=true` param to our redirect destination. This is more for debugging and demonstration and doesnt really serve another purpose.

So let's go ahead and update our **privateRoute** function to **redirectToLogin** instead of 

```typescript
// components/private_route.tsx

import { redirectToLogin } from "../services/redirect_service";

export function privateRoute(WrappedComponent: any) {
  return class extends Component<AuthProps> {
    // ...
    static async getInitialProps(ctx: NextPageContext) {
       // ...
-      if (auth.isExpired) console.log("hey! server says you shouldnt be here! you are not logged in!");
       // passing in a copy of the ServerResponse tells the redirect this server side
+      if (auth.isExpired) redirectToLogin(ctx.res); 
```
Now users will actually be redirected on login, thus protecting our dashboard. The redirect happens during the _getInitialProps_ setup, pre initial render, meaning no flash of unauthorized content (or any content) will occur. 

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/redirect-to-login.gif" alt="Shows an unauthorized user attempting to view dashboard and being redirected to login." >}}

### Successful login to dashboard

So now after a successful login attempt, we will see our dashboard with the full **AuthToken** details spread out. The authenticated user's email is _rickety\_cricket@example.com_, their session is valid, which means the token is not expired. You can also see the token itself, as well as the expiration date. In our case, the token expiration is set from our [RESTful server defined previously]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}}).

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/login-to-dashboard.gif" alt="Login to dashboard" >}}

### Add logout function

```jsx
  static async logout() {
    alert("get outta here!");
    Cookie.remove(TOKEN_STORAGE_KEY);
    await redirectToLogin();
  };
  // this just makes the logout method available 
  // as an instance method as well as a static method
  logout = AuthToken.logout
```

So now that we've added the logout method to **AuthToken**, we can go ahead and access it off of our handy-dandy **auth** prop.

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
    <p><button onClick={auth.logout}>Logout</button></p>
    <p><strong>user</strong>: {auth.decodedToken.email}</p>
    <p><strong>isValid</strong>: {auth.isValid.toString()}</p>
    <p><strong>isExpired</strong>: {auth.isExpired.toString()}</p>
    <p><strong>authorizationString</strong>: {auth.authorizationString}</p>
    <p><strong>expiresAt</strong>: {auth.expiresAt.toString()}</p>
  );
}

export default privateRoute(Dashboard);
```

{{< image/pop src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2019/08/show-logout.gif" alt="Demonstrate a user logout" >}}

You can see that immediately on logout the user is redirected to the login page. The user no longer has access to the restricted dashboard page after logging out.  

### Bonus: Add a logout page

```jsx
// pages/logout.tsx

import { Component } from "react";
import { AuthProps, privateRoute } from "../components/private_route";

class Logout extends Component<AuthProps> {
  componentDidMount(): void {
    this.props.auth.logout();
  }

  render() {
    return "Logging Out...";
  }
}

export default privateRoute(Logout);
```

You can add a simple logout page which would allow users to navigate to `/logout` to be logged out which would be a much more typical use case.

### Continue to [part 3 - adding pre-render asynchronous calls using **getInitialProps**.]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}})
