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
+++ 

## Overview

* Part 1: Using an Echo Server for JWT Authentication
    * Show example curls
* Part 2: Add nextjs
    * Install Typescript
    * Add Hello World Page
    * Add login page
    * Add login API call
    * Show login page succeeding
    * Store jwt string into Cookies
    * Create AuthToken class and validate the JWT string
    * Add privateRoute HOC
    * Add dashboard page protected by privateRoute
    * **Bonus:** Add Tailwindcss
    * **Bonus:** Add Docker

First of all, here is the [source code repository](https://github.com/jasonraimondi/nextjs-jwt-example).

```bash
git clone git@github.com:jasonraimondi/nextjs-jwt-example.git
cd nextjs-jwt-example
```

## Part 1: The REST Api Server

I am using Golang web framework [Echo](https://echo.labstack.com/) for my API, but feel free to bring your own backend implementation. You can use anything from another Node.js, to a Laravel/PHP/Ruby/Rails app. You can even have the entire backend logic inside of your Next.js app!

If you are not familiar with Golang, do not fret, this is just an example of a "backend server". The more important piece here is not the framework or language, but the REST API we are working with. I just happen to be using 

I am referencing the [Echo JWT Recipe](https://echo.labstack.com/cookbook/jwt) that is a jumping off point for a JWT secure rest api.

```bash
POST http://localhost:1323/api/login # NO AUTH REQUIRED
GET http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET http://localhost:1323/api/restricted # AUTHORIZATION HEADER REQUIRED 
```

### Boot the API


Let's boot the backend api. If you have never used Golang before before, I don't want you to get hung up on this one with the install and whatnot. Lets push forward to the actual REST API being implemented. I will post resources for Installing Golang at the end of this post.

```bash
go run ./api/main.go

   ____    __
  / __/___/ /  ___
 / _// __/ _ \/ _ \
/___/\__/_//_/\___/ v3.3.10-dev
High performance, minimalist Go web framework
https://echo.labstack.com
____________________________________O/_______
                                    O\
⇨ http server started on [::]:1323
```

Now we have a server started and listening on `localhost:1323`

### Hit the API via the CURL

Now to demonstrate the endpoints that we have created, lets hit them on the CLI real quick. First we will hit the unrestricted endpoint. 

```bash
curl -i localhost:1323/api/unrestricted
```
```bash
HTTP/1.1 200 OK
Access-Control-Allow-Origin: 
Content-Type: application/json; charset=UTF-8
Vary: Origin
Date: Sun, 04 Aug 2019 17:34:18 GMT
Content-Length: 45

{"message":"this route is unauthenticated!"}
```

Now let's hit the restricted endpoint without providing any credentials. We receive a response status code of 400, and a message with the supplied error.

```bash
curl -i localhost:1323/api/restricted
```

```bash
HTTP/1.1 400 Bad Request
Access-Control-Allow-Origin: 
Content-Type: application/json; charset=UTF-8
Vary: Origin
Date: Sun, 04 Aug 2019 17:35:47 GMT
Content-Length: 39

{"message":"missing or malformed jwt"}

```

### Submit Login POST

Next I am going to make a POST request with my email and password passed as form data to the API's login page.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=shhh!' \
             localhost:1323/api/login
```

The API will receive the request and begin the flow by verifying the user exists, and the password is correct. The following shows the result of the **login request succeeding** and responding with a **token**.

```bash
HTTP/1.1 200 OK
Access-Control-Allow-Origin: 
Content-Type: application/json; charset=UTF-8
Vary: Origin
Date: Sun, 04 Aug 2019 17:36:19 GMT
Content-Length: 186

{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"}
```

The following shows the result of the **login request failing** as a result of an invalid credentials being supplied.

```bash
HTTP/1.1 401 Unauthorized
Access-Control-Allow-Origin: 
Content-Type: application/json; charset=UTF-8
Vary: Origin
Date: Sun, 04 Aug 2019 17:36:54 GMT
Content-Length: 27

{"message":"Unauthorized"}
```

The **token** from the successful login can now be used as the "Authorization" header for requesting secure (auth protected) endpoints.

```bash
curl -i localhost:1323/api/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"
```

And the response:

```bash
HTTP/1.1 200 OK
Access-Control-Allow-Origin: 
Content-Type: application/json; charset=UTF-8
Vary: Origin
Date: Sun, 04 Aug 2019 18:40:53 GMT
Content-Length: 63

{"message":"hello email address: rickety_cricket@example.com"}
```

## Part 2: The Next.js Application

Now we are going to replicate the flow in our Next.js application by creating a login form, an unrestricted "home" page, and a restricted "dashboard".  

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

Because we are not heathens (and since Next.js v9.0 [built in zero config typescript support!](https://nextjs.org/blog/next-9#built-in-zero-config-typescript-support)), we will install TypeScript.

```bash
npm install --save-dev typescript @types/react @types/node
```

```bash
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

Now we can add our main index page with two links, one home, and one to a not-yet-existing Login page.

```jsx
// pages/index.tsx
import React from "react";

function Page() {
    return <>
        <h1>
        <ul>
            <li><a href={"/"}>Home</a></li>
            <li><a href={"/login"}>Login</a></li>
        </ul>
    </>;
}

export default Page;
```

### Add Login page with form

Now we can add the login form. First let's get a working form that updates our form fields, `inputs` via the React Hook `setInputs`. 

```jsx
// pages/login.tsx

import React, { useState } from "react";

export type LoginInputs = {
  email: string
  password: string
}

function LoginPage() {
  const initialValues: LoginInputs = { email: "", password: "", };

  const [inputs, setInputs] = useState(initialValues);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // we will add the login POST request here
    alert(`TODO add login endpoint! ${JSON.stringify(inputs)}`)
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    e.persist();
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" onChange={handleInputChange} value={inputs.email} placeholder="rickety_cricket@example.com"/>
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" onChange={handleInputChange} value={inputs.password} placeholder="********"/>
    </div>
    <button type="submit">Login</button>
  </form>;
}

export default LoginPage;
```

We should be able to now enter our email and password into our login form located at `localhost:3000`

### Add Login API Call

Add a login api call with Axios. I am using axios over fetch because, well... I just havent found good enough documentation on Fetch for me to understand how to use it both in a Node, and Browser context. Axios I am certain works with both, and works well.

```jsx
// services/login_service.ts

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { LoginInputs } from "../pages/login";

export async function login(inputs: LoginInputs): Promise<string | void> {
  const data = new URLSearchParams(inputs);
  const config: AxiosRequestConfig = {
    baseURL: "http://localhost:1323",
  };
  const res: any = await axios.post("/api/login", data, config).catch(catchAxiosError);
  if (res.error) {
    return res.error;
  } else if (!res.data || !res.data.token) {
    return "Something went wrong!";
  }
  const { token } = res.data;
  
  // we will add the store to cookies and redirect logic here
  alert(`Success! Your token is ${$token}`);
}


// below is error handling stuff, this would be 
// extracted out into its own file, as well as 
// the Axios POST logic.

export type ErrorResponse = {
  error: string
}

export function catchAxiosError(err: AxiosError): ErrorResponse {
  // ... better error message handling
  return { error: message };
}

```

### Show Login Page Succeeding

### Store JWT String into Cookies

```jsx
// services/login_service.ts

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { LoginInputs } from "../pages/login";

export const COOKIES = {
  authToken: "myApp.authToken", // any arbitrary key
};

export async function login(inputs: LoginInputs): Promise<string | void> {
  // ...
  const { token } = res.data;

  // we will add the store to cookies and redirect logic here
  // alert(`Success! Your token is ${$token}`);
  Cookie.set(COOKIES.authToken, token);
  await Router.push("/dashboard");
}
```

```jsx
// pages/login.tsx

function LoginPage() {
  // ...
  const handleSubmit = async (e: any) => {
    // ...

    // we will add the login POST request here
    // alert(`TODO add login endpoint! ${JSON.stringify(inputs)}`)
    const error = await login(inputs);
    if (error) setError(error);
  };
```

### Create AuthToken class and validate the JWT string



### Add `privateRoute` High Order Component (HOC)

### Add dashboard page protected by privateRoute


## Install Golang 

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

FIN

```go
package main

import (
    "net/http"
    "time"

    "github.com/dgrijalva/jwt-go"
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
)

const JWTSecret = "mySecret"

func login(c echo.Context) error {
    email := c.FormValue("email")
    password := c.FormValue("password")

    // Throws unauthorized error
    if email != "rickety_cricket@example.com" || password != "shhh!" {
        return echo.ErrUnauthorized
    }

    // Create token
    token := jwt.New(jwt.SigningMethodHS256)

    // Set claims
    claims := token.Claims.(jwt.MapClaims)
    claims["email"] = email
    claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

    // Generate encoded token and send it as response.
    t, err := token.SignedString([]byte(JWTSecret))
    if err != nil {
        return err
    }

    return c.JSON(http.StatusOK, map[string]string{
        "token": t,
    })
}

func accessible(c echo.Context) error {
    return c.JSON(http.StatusOK, map[string]string{
        "message": "this route is unauthenticated!",
    })
}

func restricted(c echo.Context) error {
    user := c.Get("user").(*jwt.Token)
    claims := user.Claims.(jwt.MapClaims)
    email := claims["email"].(string)
    return c.JSON(http.StatusOK, map[string]string{
        "message": "hello email address: "+email,
    })
}

func main() {
    e := echo.New()
    // ... removed for brevity
    
    // Unauthenticated routes
    e.POST("/api/login", login)
    e.GET("/api/unrestricted", accessible)

    // Restricted group
    r := e.Group("/api/restricted")
    r.Use(middleware.JWT([]byte(JWTSecret)))
    r.GET("", restricted)
    // ... removed for brevity
}
```