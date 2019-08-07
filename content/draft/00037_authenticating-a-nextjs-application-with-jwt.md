+++
title = "Authenticating and secure Next.js with a RESTful API using JWT"
slug = "authenticating-a-nextjs-application-with-jwt"
date = 2019-08-01
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
toc = true
+++ 

## Overview

First of all the source code for everything we are working on is located here: [source code repository](https://github.com/jasonraimondi/nextjs-jwt-example).

We are going to be creating a Next.js application that will connect to a RESTful API server. 


Our Next.js application will have the following three pages:

```bash
http://localhost:3000/          # home page
http://localhost:3000/login     # login page
http://localhost:3000/dashboard # protected page authed users only
```

Our Server will have the following API

```bash
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
``` 

The flow of the application is simple. 

1. An unauthenticated user lands on the **home page**. This page is visible to _any_ user, authenticated or not.
2. The user then can navigate to the **login page**. And proceed to fill the form. 
3. After a successful login, the user will then be redirected to the **dashboard page**. This dashboard is only accessible by an authenticated user. Any unauthenticated user will be redirected back to the **login page**.

Now we are going to replicate the flow in our Next.js application by creating a **login page**, an unrestricted **home page**, and a restricted **dashboard page**.  

## Part 2: The Next.js Application

The firs thing that we need to do though is create the directory for our Next.js project, and initialize npm. We also need to create a **pages** directory for Next.js 

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

### Boot Next.js

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

  const handleSubmit = async (e: any) => {
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

### Create _AuthToken_ class and validate the JWT string

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
    this.decodedToken = { email: "", exp: 0 };
    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {
    }
  }
}
```

```jsx
// services/auth_token.ts

export class AuthToken {
  readonly decodedToken: DecodedToken;

  constructor(readonly token?: string) { // ... }

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


### Store JWT String into Cookies

First we need to add a storeToken method to the _AuthToken_ class.

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

Now lets remove the alert message, and store the token into cookies.

```javascript
// services/rest_service.ts

export const postLogin = async (inputs: LoginInputs): Promise<errorMessage | void> => {
  // ...
  if (res.data && res.data.token) {
-    alert(`this is my token: (${res.data.token})`);
+    await AuthToken.storeToken(res.data.token);

```

### Add _privateRoute_ high order component (HOC)

This the `getInitialProps` method of our privateRoute HOC, and will immediately redirect the user to the login page. An unauthenticated user will NOT be able to access our dashboard pages. 

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

import React  from "react"
import { Links } from "../components/links";
import { AuthProps, privateRoute } from "../components/private_route";
import { AuthToken } from "../services/auth_token";

type Props = AuthProps;

function Dashboard({ token }: Props) {
  const auth = new AuthToken(token);

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

### SHOW FORCE REDIRECT TO DASHBOARD NEXT

Now users will be redirected on login. This redirect happened during the _getInitialProps_ setup, pre initial render. 

{{< image-pop src="/assets/posts/2019/08/redirect-to-login.gif" alt="show a unauthorized user attempting to view dashboard and being redirected to login" >}}

### Successful login to dashboard

{{< image-pop src="/assets/posts/2019/08/login-to-dashboard.gif" alt="Login to dashboard" >}}

### Redirect to login function

```typescript
import { ServerResponse } from "http";
import { NextPageContext } from "next";
import Router from "next/router";

export const redirectToLogin = (server?: ServerResponse) => {
  const login = "/login?redirected=true";
  if (server) {
    // @see https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
    // server rendered pages do not have access to "next/router", thus they need to redirect
    server.writeHead(302, {
      Location: login,
    });
    server.end();
  } else {
    Router.push(login);
  }
};
```

### Add Logout function

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

## **Bonus:** Add Tailwindcss
## **Bonus:** Add Docker
## **Bonus:** Install Golang 

First of all, an EXCELLENT starters guide to getting your feet wet with Golang is _Learn Go with Tests_ ([Gitbook available](https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/install-go)) 

* https://github.com/quii/learn-go-with-tests
* https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/install-go

One of the quirky things about go is, it expects your code in a specific folder. Most languages, you can put your code anywhere you want.

```bash
# here is what I have added to my .zshrc
export GOPATH=${HOME}/go; 
export GO111MODULE=on; 
export PATH="$GOPATH/bin:$PATH"
```



## Part 1: The REST Api Server

I am using Golang web framework [Echo](https://echo.labstack.com/) for my API, but feel free to bring your own backend implementation. You can use anything from another Node.js, to a Laravel/PHP/Ruby/Rails app. You can even have the entire backend logic inside of your Next.js app!

If you are not familiar with Golang, _do not fret_, **this is just an example of a backend server**. The more important piece here is not the framework or language, but the following REST API we are working with:

```bash
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
```

I am referencing the [Echo JWT Recipe](https://echo.labstack.com/cookbook/jwt) that is a jumping off point for a JWT secure rest api.

### API Preview

Let's take a look at the actual REST API we have implemented. 

{{< asciinema id="1hB16TAx2eD0g6sy50XjAELaZ" description="A demonstration of the RESTful API will be working with." >}}

### Hit the API manually via the curl

Now to demonstrate the endpoints that we have created, lets hit them on the CLI real quick. First we will hit the unrestricted endpoint. 

```bash
curl -i localhost:1323/api/unrestricted

HTTP/1.1 200 OK

{"message":"this route is unauthenticated!"}
```

Now let's hit the restricted endpoint without providing any credentials. We receive a response status code of 400, and a message with the supplied error.

```bash
curl -i localhost:1323/api/restricted

HTTP/1.1 400 Bad Request

{"message":"missing or malformed jwt"}
```

### Submit login post

Next I am going to make a POST request with my email and password passed as form data to the API's login page.

The API will receive the request and begin the flow by verifying the user exists, and the password is correct. The following shows the result of the **login request succeeding** and responding with a **token**.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=shhh!' \
             localhost:1323/api/login

HTTP/1.1 200 OK

{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"}
```

The following shows the result of the **login request failing** as a result of an invalid credentials being supplied.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=wrong-password!!' \
             localhost:1323/api/login

HTTP/1.1 401 Unauthorized

{"message":"Unauthorized"}
```

The **token** from the successful login can now be used as the "Authorization" header for requesting secure (auth protected) endpoints.

```bash
curl -i localhost:1323/api/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"

HTTP/1.1 200 OK

{"message":"hello email address: rickety_cricket@example.com"}
```
