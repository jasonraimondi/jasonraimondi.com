+++
title = "Create a secured REST Api using JWT and Golang"
slug = "authenticating-nextjs-part-1"
date = "2019-08-16T03:30:00-0700"
description = "Create a secured REST Api using JWT and Golang"
tags = [
    "authenticating-nextjs",
    "nextjs",
    "react",
    "jwt",
    "golang",
    "echo-framework",
]
categories = [
    "software",
    "backend",
]
+++

## Overview

* In [this part]({{< relref "/posts/028_authenticating-nextjs-part-1.md" >}}) we will be creating the JWT secured REST API
* In [the next part]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}}) we will create the user facing Next.js application
* In [the last part]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}}) we will add pre-render async api calls to our Next.js application

## Source Code

Everything we are working on can be found on GitHub at https://github.com/jasonraimondi/nextjs-jwt-example. For this part, take a look in the [api](https://github.com/jasonraimondi/nextjs-jwt-example/tree/master/api) directory.

For this part, I am referencing the [Echo JWT Recipe](https://echo.labstack.com/cookbook/jwt) as an excellent starting point.

## Outline the REST API

Let's outline of the REST API we will be creating. We will have two open routes and one secure route that will require authentication.

```bash
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
```

Anyone will be able to access the `/api/unrestricted` endpoint. A user will be able to authenticate via a POST request containing a valid _email_ and _password_ to the `/api/login` endpoint and receiving a JWT. Authenticated users can then pass the JWT as an **Authorization** header to the `/api/restricted` endpoint to view the content. Any requests without the **Authorization** header will be denied.

## Add the unrestricted/open endpoint

The first endpoint is just a really simple endpoint that returns a json object with a key and value of `"message": "Success! The status is 200"`. 

```go
package main

import (
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
    "net/http"
)

func main() {
    e := echo.New()

    // logging and panic recovery middleware
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    // unrestricted route
    e.GET("/api/unrestricted", unrestricted)
    
    // listen on localhost:1323
    e.Logger.Fatal(e.Start(":1323"))
}

func unrestricted(c echo.Context) error {
    return c.JSON(http.StatusOK, map[string]string{
        "message": "Success! The status is 200",
    })
}
```

### Submit the GET requests to the unprotected endpoint

To demonstrate the endpoints that we have created, let's request them on the CLI real quick. First we will hit the unrestricted endpoint. 

```bash
curl -i localhost:1323/api/unrestricted

HTTP/1.1 200 OK

{"message":"Success! The status is 200"}
```

## Create the login endpoint that authenticates a user and returns a jwt upon successful login

We are going to create a login endpoint that will take an **email** and **password** from login post request and validate the fields. In our case, we are hard coding the email and password. The only acceptable input would be **email: rickety_cricket@example.com** and **pw: shhh!**. 

In a real implementation, we would be retrieving a user record in a database and validating the password.

```go
package main

import (
    "github.com/dgrijalva/jwt-go"
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
    "net/http"
)

const jwtSecretKey = "my-super-secret-key"

func main() {
    e := echo.New()

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    e.GET("/api/unrestricted", unrestricted)
    // add the login route
    e.POST("/api/login", login)

    // add a restricted group
    r := e.Group("/api")
    // apply the jwt middleware to the route group
    r.Use(middleware.JWT([]byte(jwtSecretKey)))
    r.GET("/restricted", restricted)
    
    e.Logger.Fatal(e.Start(":1323"))
}

func login(c echo.Context) error {
    email := c.FormValue("email")
    password := c.FormValue("password")

    // in our case, the only "valid user and password" is 
    // user: rickety_cricket@example.com pw: shhh!
    // really, this would be connected to any database and 
    // retrieving the user and validating the password
    if email != "rickety_cricket@example.com" || password != "shhh!" {
        return echo.ErrUnauthorized
    }

    // create token
    token := jwt.New(jwt.SigningMethodHS256)

    // set claims
    claims := token.Claims.(jwt.MapClaims)
    // add any key value fields to the token 
    claims["email"] = "rickety_cricket@example.com"
    claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

    // generate encoded token and send it as response.
    t, err := token.SignedString([]byte("secret"))
    if err != nil {
        return err
    }
    
    // return the token for the consumer to grab and save
    return c.JSON(http.StatusOK, map[string]string{
        "token": t,
    })
}
```

Please checkout the Echo JWT [Cookbook](https://echo.labstack.com/cookbook/jwt) & [Middleware API](https://echo.labstack.com/middleware/jwt) for more information on the JWT implementation.

### The login request failing (invalid credentials)

On a failure to login, either due an invalid password, or attempting to log into an invalid user (in our case, any user other than the hardcoded rickety_cricket@example.com), will result in a 401 Status Code and an Unauthorized message. 

The following shows the result of the **login request failing** as a result of an invalid credentials being supplied.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=wrong-password!!' \
             localhost:1323/api/login

HTTP/1.1 401 Unauthorized

{"message":"Unauthorized"}
```

### The login request succeeding

Next I am going to make a POST request with my email and password passed as form data to the API's login page. The API will receive the request and begin the flow by verifying the user exists, and the password is correct. 

The following shows the result of the **login request succeeding** and responding with a **token**.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=shhh!' \
             localhost:1323/api/login

HTTP/1.1 200 OK

{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"}
```

If you run the token through a jwt decoder such as https://jwt.io you'll get the decoded token.

```json
{
  "admin": true,
  "email": "rickety_cricket@example.com",
  "exp": 1565199379
}
```

## Create the restricted endpoint with the JWT middleware protection

I am using the [Echo Framework JWT middleware](https://echo.labstack.com/middleware/jwt), but the idea can be replicated in any language or framework.  

We will use the middleware to create a restricted endpoint that only authenticated users can access. 

```go
package main

import (
    "github.com/dgrijalva/jwt-go"
    "github.com/labstack/echo"
    "github.com/labstack/echo/middleware"
    "net/http"
)

// Jwt signing key, this could be anything. Changing it would 
// effectively log out all users, but is not destructive
const jwtSecretKey = "my-super-secret-key"

func main() {
    e := echo.New()

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    e.GET("/api/unrestricted", unrestricted)

    // create a route group that will add the jwt middleware
    r := e.Group("/api")
    // apply the jwt middleware to the route group
    r.Use(middleware.JWT([]byte(jwtSecretKey)))
    r.GET("/restricted", restricted)
    
    // listen on localhost:1323
    e.Logger.Fatal(e.Start(":1323"))
}

func restricted(c echo.Context) error {
    // do a fancy dance to get the token's email
    user := c.Get("user").(*jwt.Token)
    claims := user.Claims.(jwt.MapClaims)
    email := claims["email"].(string)
    
    return c.JSON(http.StatusOK, map[string]string{
        "message": "hello email address: " + email,
    })
}
```

This restricted endpoint that responds with a JSON object of `{"message": "hello email address: " + email}`

### The restricted request failing (no Authorization header)

Unsuccessfully request the restricted endpoint without any credentials

We are going to hit the restricted endpoint without providing any credentials. We receive a response status code of 400, and a message with the supplied error as expected.

```bash
curl -i localhost:1323/api/restricted

HTTP/1.1 400 Bad Request

{"message":"missing or malformed jwt"}
```

### Append the Authorization header when requesting secure routes

The **token** from the successful login can now be used as the "Authorization" header for requesting secure (auth protected) endpoints.

```bash
curl -i localhost:1323/api/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"

HTTP/1.1 200 OK

{"message":"hello email address: rickety_cricket@example.com"}
```

## API Preview

Let's take a look at the actual REST API we have implemented. 

{{< asciinema id="1hB16TAx2eD0g6sy50XjAELaZ" description="A demonstration of the RESTful API will be working with." >}}

## Continue to [securing a Next.js application with JWT and a private route higher order component]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
