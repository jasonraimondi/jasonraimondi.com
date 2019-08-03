+++
title = "Authenticating and secure Nextjs with a RESTful API using JWT"
slug = "authenticating-a-nextjs-application-with-jwt"
date = 2019-08-01
draft = true
description = "Authenticating and securing a nextjs application."
tags = [
    "nextjs",
    "react",
]
categories = [
    "frontend",
    "Backend",
]
+++ 

#### Overview

BYOB (bring your own backend). I am using Echo Golang because it is the most minimal full example.

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

[GitHub](https://github.com/jasonraimondi/nextjs-jwt-example)

```bash
git clone git@github.com:jasonraimondi/nextjs-jwt-example.git
cd nextjs-jwt-example
```

# The REST Api Server

I am using the golang framework [Echo](https://echo.labstack.com/) to serve an API. If you are not familiar with golang, do not fret, this is merely an example of a "backend server". You could have any backend, from pure PHP or Laravel, to Ruby or Ruby on Rails, or Node.js. I just want to briefly describe the REST API we are working with. 

First, let's just boot the backend api:

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
    return c.JSON(http.StatusOK, map[string]string{
        "email": claims["name"].(string),
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


Login

```bash
curl -X POST -d 'email=rickety_cricket@example.com' -d 'password=shhh!' localhost:1323/api/login
```

Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTY1MDcyNTU1LCJuYW1lIjoiSm9uIFNub3cifQ.ueAvFTMYsaS2udTeOOZoLxeShdgNmV9TSk1QkQHbgqQ"
}
```

Request Secure Endpoint

```shell script
curl localhost:1323/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTY1MDcyNTU1LCJuYW1lIjoiSm9uIFNub3cifQ.ueAvFTMYsaS2udTeOOZoLxeShdgNmV9TSk1QkQHbgqQ"
```

SHOW THE INSTALL OF NEXT

```
foo
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

```typescript
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
