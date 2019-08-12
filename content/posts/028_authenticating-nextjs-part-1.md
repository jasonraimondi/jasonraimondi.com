+++
title = "Authenticating and securing a Next.js app from unauthorized access"
slug = "authenticating-nextjs-part-1"
date = "2019-08-10T03:30:00-0700"
description = "Part 1: The REST Api"
tags = [
    "authenticating-nextjs",
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

## Overview

* In [this part]({{< relref "/posts/028_authenticating-nextjs-part-1.md" >}}) we will be creating/mocking the REST API.
* In [part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}}) we will be creating the Next.js application
* In [part 3]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}}) we will add pre-render async api calls to our Next.js application

## Source Code

Everything we are working on can be found on GitHub at https://github.com/jasonraimondi/nextjs-jwt-example. For part 1, take a look in the [api](https://github.com/jasonraimondi/nextjs-jwt-example/tree/master/api) directory.

## Outline the REST API

We will be creating/mocking a REST API with an authentication flow. Any unauthorized user will be able to access and view a single **unrestricted** endpoint. A user will be able to authenticate via a POST containing a valid _email_ and _password_ to the **login** endpoint and receiving a JWT. Authenticated users can then pass the JWT as an **Authorization** header to the **restricted** endpoint to view the content. Any requests without the **Authorization** header will be denied.

The backend language or framework that is running our REST API that we are going to create is less important than the actual API that we are going to expose. The language/framework is interchangeable; the API is the piece we want to reinforce here.

```bash
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
```

I am referencing the [Echo JWT Recipe](https://echo.labstack.com/cookbook/jwt) that is a jumping off point for our JWT secured REST API.

## Submit the GET requests

To demonstrate the endpoints that we have created, let's request them on the CLI real quick. First we will hit the unrestricted endpoint. 

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

## Submit the login POST request

Next I am going to make a POST request with my email and password passed as form data to the API's login page. The API will receive the request and begin the flow by verifying the user exists, and the password is correct. 

### Successful login

The following shows the result of the **login request succeeding** and responding with a **token**.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=shhh!' \
             localhost:1323/api/login

HTTP/1.1 200 OK

{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"}
```

### Failed login

On a failure to login, either due an invalid password, or attempting to log into an invalid user (in our case, any user other than the hardcoded rickety_cricket@example.com), will result in a 401 Status Code and an Unauthorized message. 

The following shows the result of the **login request failing** as a result of an invalid credentials being supplied.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=wrong-password!!' \
             localhost:1323/api/login

HTTP/1.1 401 Unauthorized

{"message":"Unauthorized"}
```

## Append the Authorization header when requesting secure routes

The **token** from the successful login can now be used as the "Authorization" header for requesting secure (auth protected) endpoints.

```bash
curl -i localhost:1323/api/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"

HTTP/1.1 200 OK

{"message":"hello email address: rickety_cricket@example.com"}
```

## API Preview

Let's take a look at the actual REST API we have implemented. 

{{< asciinema id="1hB16TAx2eD0g6sy50XjAELaZ" description="A demonstration of the RESTful API will be working with." >}}

### Continue to [part 2, building the Nextjs application with protected routes, having authorized access only.]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
