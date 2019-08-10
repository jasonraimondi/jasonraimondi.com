+++
title = "Part 2: The Next.js Application"
slug = "authenticating-nextjs-part-2"
date = 2019-08-02
description = "Authenticating and securing a nextjs application"
tags = [
    "nextjs",
    "react",
]
categories = [
    "frontend",
    "Backend",
]
toc = false
+++ 

## The Next.js app

We are going to be creating a Next.js application that will authenticate into to the RESTful API server. For a refresher on what this API is all about, you can check out [part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}}) of the series. 

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

### Set up Next with TypeScript

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

{{< image/pop src="/assets/posts/2019/08/only-index-page.gif" alt="Only index page" >}}

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

We should be able to now enter our email and password into our login form located at `localhost:3000`

{{< image/pop src="/assets/posts/2019/08/todo-add-login-endpoint.gif" alt="Login Page Success" >}}

There was no actual request being made here, just an alert showing us the form fields we have filled out. The next step will be to make the login POST request and retrieve our Authorization token.

### Add Login API Call

I am using axios over fetch because, well... I just havent found good enough documentation on Fetch for me to understand how to use it both in a Node, and Browser context. Axios I am certain works with both, and works well.

Now let's create an _postLogin_ api call with Axios.

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

const post = (url: string, data: URLSearchParams) => {
  const baseConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:1323",
  };
  return axios.post(url, data, baseConfig).catch(catchAxiosError);
};
```

{{< image/pop src="/assets/posts/2019/08/alert-with-token.gif" alt="Alert with token" >}}

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

Remove the alert message and store the JWT string into cookies using the [js-cookie](https://github.com/js-cookie/js-cookie) library.

**Note: You should not save the _AuthToken_ class into cookies** as it will be flattened into a JSON string, and returned as a standard object when retrieved.

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

### Add a _privateRoute_ high order component (HOC)

A HOC is effectively a [decorator](https://en.wikipedia.org/wiki/Decorator_pattern) on a React component. 

> Concretely, a **higher-order component** is a function that takes a component and returns a new component.

Now we are going to add a `privateRoute` [high order component](https://reactjs.org/docs/higher-order-components.html) that will handle the authorization check in the pre-render method `async getInitialProps`.

Our `privateRoute` function will be decorating any React component with some authorization checks. It is attaching to the Next.js/React lifecycle methods and and updating accordingly.  

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
      // if the token is expired, that means the user is no longer (or never was) authenticated
      // and if we allow the request to continue, they will reach a page they should not be at.
      if (auth.isExpired) console.log("hey! server says you shouldnt be here! you are not logged in!");
      if (WrappedComponent.getInitialProps) return WrappedComponent.getInitialProps(initialProps);
      return initialProps;
    }

    componentDidMount(): void {
      // since getInitialProps returns our props after they've
      // JSON.stringify we need to reinitialize it as an 
      // AuthToken to have the full class method suite be available to you
      this.setState({ auth: new AuthToken(this.props.token) })
    }

    render() {
      return <WrappedComponent auth={this.state.auth} {...this.props} />;
    }
  };
}
```

In the `getInitialProps` method of our _privateRoute_ HOC, we are going to create a new _AuthToken_ that will be initialized from the `NextPageContext`.

If the token is expired, the user is not authorized to view this page, and will (eventually be) redirected to the login page. For now, we are going to `console.log` yell at our user. These logs will appear in your Next.js server side log output. This check is happening pre-browser render, and therefore the console log will not be visible in the browser.

Now, for any page that we want to protect, all we need to do is wrap the component in a `privateRoute`. We'll see an example in the following section.

In addition to authorization checks, one more thing that this HOC does is make the _AuthToken_ class available to the wrapped component.

```jsx
<WrappedComponent auth={this.state.auth} {...this.props} />;
```

This will allow `WrappedComponents` to access the _AuthToken_ class as a prop of key `auth` that is "magically" available.

### Add dashboard page protected by _privateRoute_

We are going to be creating a dashboard page that is only going to be visible to our authenticated users. All we need to do do make this happen is pass our `Dashboard` component through the `privateRoute` as it is being exported. 

We are able to access the key `auth` off of the props passed into the `Dashboard` component kind of magically. 

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

Remember, private route currently just console logging the auth status and **is not protecting the route yet**. What is happening is that we are noticing the token is void, running a `console.log`, and letting the unauthorized user access the page. Note the values of our _AuthToken_ in the following screen are all indicating that the email of the authenticated user is an empty string, the token is expired, and is not authenticated. This is because I am accessing this page as a user that has not logged in.

{{< image/pop src="/assets/posts/2019/08/you-are-not-logged-in.gif" alt="You are not logged in!" >}}

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

So let's go ahead and update our `privateRoute` function to `redirectToLogin` instead of 

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

{{< image/pop src="/assets/posts/2019/08/redirect-to-login.gif" alt="Shows an unauthorized user attempting to view dashboard and being redirected to login." >}}

### Successful login to dashboard

So now after a successful login attempt, we will see our dashboard with the full _AuthToken_ details spread out. The authenticated user's email is "rickety_cricket@example.com", their session is valid, which means the token is not expired. You can also see the token itself, as well as the expiration date. In our case, the token expiration is set from our [RESTful server defined in part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}})

{{< image/pop src="/assets/posts/2019/08/login-to-dashboard.gif" alt="Login to dashboard" >}}

### Add Logout function

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

So now that we've added the logout method to _AuthToken_, we can go ahead and access it off of our handy-dandy `auth` prop.

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

{{< image/pop src="/assets/posts/2019/08/show-logout.gif" alt="Demonstrate a user logout" >}}

You can see that immediately on logout the user is redirected to the login page. The user no longer has access to the restricted dashboard page after logging out.  

### Continue to [part 3 - adding pre-render asynchronous calls using `getInitialProps`.]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}})

The source code can be found here: https://github.com/jasonraimondi/nextjs-jwt-example

* [Part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}})
* [Part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
