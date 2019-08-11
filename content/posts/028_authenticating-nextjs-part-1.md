+++
title = "Authenticating and securing a Next.js app from unauthorized access"
slug = "authenticating-nextjs-part-1"
date = 2019-08-01
draft = true
description = "Part 1: The REST Api"
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

## Overview

The source code for everything we are working on can be found on GitHub: https://github.com/jasonraimondi/nextjs-jwt-example

We will be creating an application with an authentication flow, that will allow the an unauthorized user to view unprotected pages. Only logged in users will be able to view pages that will be using our **privateRoute** high order component (HOC).

1. An unauthenticated user lands on the **home page**. This page is visible to _any_ user, authenticated or not.
2. The user then can navigate to the **login page**. And proceed to fill the form. 
3. After a successful login, the user will then be redirected to the **dashboard page**. This dashboard is only accessible by an authenticated user. Any unauthenticated user will be redirected back to the **login page**.  

For part 1 of this series, we will be creating a REST API that our Next.js application will use to keep state.

## Part 1: The REST Api

The backend language or framework that is running our REST API that we are going to create is less important than the actual API that we are going to expose. The language/framework is interchangeable, but the API is the concept we are building.

```bash
POST http://localhost:1323/api/login        # NO AUTH REQUIRED
GET  http://localhost:1323/api/unrestricted # NO AUTH REQUIRED
GET  http://localhost:1323/api/restricted   # AUTHORIZATION HEADER REQUIRED 
```

**This is just an example of a REST API running on a server**. I am referencing the [Echo JWT Recipe](https://echo.labstack.com/cookbook/jwt) that is a jumping off point for a JWT secure rest api.

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

### Submit a successful login request

Next I am going to make a POST request with my email and password passed as form data to the API's login page.

The API will receive the request and begin the flow by verifying the user exists, and the password is correct. The following shows the result of the **login request succeeding** and responding with a **token**.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=shhh!' \
             localhost:1323/api/login

HTTP/1.1 200 OK

{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"}
```

### Submit an failing login request due to invalid credentials

On a failure to login, either due an invalid password, or attempting to log into an invalid user (in our case, any user other than the hardcoded rickety_cricket@example.com), will result in a 401 Status Code and an Unauthorized message. 

The following shows the result of the **login request failing** as a result of an invalid credentials being supplied.

```bash
curl -X POST -d 'email=rickety_cricket@example.com' \
             -d 'password=wrong-password!!' \
             localhost:1323/api/login

HTTP/1.1 401 Unauthorized

{"message":"Unauthorized"}
```

### Append the Authorization header when requesting secure routes

The **token** from the successful login can now be used as the "Authorization" header for requesting secure (auth protected) endpoints.

```bash
curl -i localhost:1323/api/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZW1haWwiOiJyaWNrZXR5X2NyaWNrZXRAZXhhbXBsZS5jb20iLCJleHAiOjE1NjUxOTkzNzl9.BUSk39ZXXAUU6-L0sa3tlH_6vNnKIPWKoclOI1u85TA"

HTTP/1.1 200 OK

{"message":"hello email address: rickety_cricket@example.com"}
```

### API Preview

Let's take a look at the actual REST API we have implemented. 

{{< asciinema id="1hB16TAx2eD0g6sy50XjAELaZ" description="A demonstration of the RESTful API will be working with." >}}

### Continue to [part 2, building the Nextjs application with protected routes, having authorized access only.]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})

Once again, the source code can be found here: https://github.com/jasonraimondi/nextjs-jwt-example

* [Part 1]({{< ref "/posts/028_authenticating-nextjs-part-1.md" >}})
* [Part 2]({{< ref "/posts/029_authenticating-nextjs-part-2.md" >}})
* [Part 3]({{< ref "/posts/030_authenticating-nextjs-part-3.md" >}})
* [Part 4]({{< ref "/posts/031_authenticating-nextjs-part-4.md" >}})
* [Part 5]({{< ref "/posts/032_authenticating-nextjs-part-5.md" >}})
