+++
title = "Create an authorization/authentication system from scratch using Next.js"
slug = "authenticating-nextjs-part-1"
date = 2019-08-01
description = "Part 1: Create an auth system from scratch using Next.js and JWT"
tags = [
    "nextjs",
    "react",
    "jwt",
    "golang",
    "echo-framework"
]
categories = [
    "software",
    "frontend",
    "backend",
]
+++

## Part 1: The REST Api

* Create a simple auth system from scratch using Next.js and JWT - Part 1
* Roll your own auth system using Next.js and JWT
* Authenticating and securing a nextjs application

## Overview

The source code for everything we are working on can be found here: https://github.com/jasonraimondi/nextjs-jwt-example

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

### GET requests

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

### Submitting a login post

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

### Continue to [Part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})

Once again, the source code can be found here: https://github.com/jasonraimondi/nextjs-jwt-example

* [Part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}})
* [Part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
