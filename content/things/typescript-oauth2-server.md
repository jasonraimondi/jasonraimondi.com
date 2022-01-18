---
title: TypeScript OAuth2.0 Server
description: A standards compliant implementation of an OAuth 2.0 authorization server for Node that utilizes JWT and Proof Key for Code Exchange (PKCE), written in TypeScript.
date: "2022-01-17T00:00:00-07:00"
tags:
- typescript
- nodejs
- express
- fastify
- oauth2
categories:
- backend
aliases:
- /posts/traverse/
---

Repository is available: https://github.com/jasonraimondi/ts-oauth2-server

`@jmondi/oauth2-server` is a standards compliant implementation of an OAuth 2.0 authorization server for Node, written in TypeScript. 

Requires `node >= 12`

The following RFCs are implemented:

- [RFC6749 “OAuth 2.0”](https://tools.ietf.org/html/rfc6749)
- [RFC6750 “The OAuth 2.0 Authorization Framework: Bearer Token Usage”](https://tools.ietf.org/html/rfc6750)
- [RFC7519 “JSON Web Token (JWT)”](https://tools.ietf.org/html/rfc7519)
- [RFC7636 “Proof Key for Code Exchange by OAuth Public Clients”](https://tools.ietf.org/html/rfc7636)

Out of the box it supports the following grants:

- [Authorization code grant](#authorization-code-grant-w-pkce)
- [Client credentials grant](#client-credentials-grant)
- [Refresh grant](#refresh-token-grant)
- [Implicit grant](#implicit-grant) // not recommended 
- [Resource owner password credentials grant](#password-grant) // not recommended
