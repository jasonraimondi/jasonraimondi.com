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

### Overview

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
    * Bonus: Add Tailwindcss


I am using Golang web framework [Echo](https://echo.labstack.com/) for my API, but feel free to bring your own backend implementation. You can use anything from another Node.js, to a Laravel/PHP/Ruby/Rails app. You can even have the entire backend logic inside of your Next.js app!



First of all, here is the [source code repository](https://github.com/jasonraimondi/nextjs-jwt-example).

```bash
git clone git@github.com:jasonraimondi/nextjs-jwt-example.git
cd nextjs-jwt-example
```

### Part 1: The REST Api Server

If you are not familiar with Golang, do not fret, this is just an example of a "backend server". The more important piece here is not the framework or language, but the REST API we are working with. I just happen to be using 

I am referencing the [Echo JWT Recipe](https://echo.labstack.com/cookbook/jwt) that is a jumping off point for a JWT secure rest api.

```bash
POST http://localhost:1323/api/login # NO AUTH REQUIRED
GET http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET http://localhost:1323/api/restricted # AUTHORIZATION HEADER REQUIRED 
```

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

We are going to replicate this flow in our Next.js application by authenticating 

### Part 2: The Next.js Application

Create the directory

```bash
mkdir web
cd web
npm init
```

Install Next.js

```bash
npm install --save next react react-dom
```

Install TypeScript

```bash
npm install --save-dev typescript @types/react @types/node
```

Add a hello world index page 

```jsx
import React from "react";

function Page() {
    return <>
        <h1><?
        <ul>
            <li><a href={"/"}>Home</a></li>
            <li><a href={"/login"}>Login</a></li>
        </ul>
    </>;
}

export default Page;
```

Show login form

```jsx
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
    <form className="container mx-auto max-w-sm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" onChange={handleInputChange} value={inputs.email} placeholder="rickety_cricket@example.com"/>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" onChange={handleInputChange} value={inputs.password} placeholder="********"/>
      </div>
      <button type="submit">Login</button>
    </form>
  </>;
}

export default LoginPage;
```

Add a login api call with axois

```jsx
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

  // store the token into cookies
  Cookie.set(COOKIES.authToken, token);
  await Router.push("/dashboard");
}

export type ErrorResponse = {
  error: string
}

export function catchAxiosError(err: AxiosError): ErrorResponse {
  // ... better error message handling
  return { error: message };
}

```













Install Golang 

* https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/install-go

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