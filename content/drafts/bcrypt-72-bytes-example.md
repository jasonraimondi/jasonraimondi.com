---
draft: true
categories:
- software
- backend
date: 2021-04-22T09:25:00-0700
description: Showing example of 72 bytes
tags:
- nodejs
- bcrypt
- security
title: Using SHA256 to preprocess password before bcrypt
---

Using SHA256 to preprocess a password before bcrypt seems to have a few benefits over using bcrypt alone. 

The first is that 
Benefits of hashing the password
Only the first 72 bytes of a password are stored. 

* Make every password the full 72 bytes of entropy
* The full password is used the whole time

```ts
const part = "This string is exactly 72 bytes long to demonstrate the example.........";
const actualPassword = part + "additional characters";
const attemptedPassword = part + "wrong additional characters";
```

Even though the user entered the wrong password, this test will not pass because bcrypt is only checking the first 72 bytes.

This means that all characters after the first ~72 will be ignored during the hash and verify.

```ts
import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export function verifyPassword(attempt: string, hashedPassword: string): Promise<boolean> {
  return compare(attempt, hashedPassword);
}
```



```ts
// we need to make this test pass without changing our assertion
it("invalid password using bcrypt only fails verification", async () => {
  const passwordHash = await hashPassword(actualPassword);
  const isValid = await verifyPassword(attemptedPassword, passwordHash);

  // Do not change this line
  expect(isValid).toBeFalsy();
});
```

If we update our hashPassword and verifyPassword functions to presalt and sha256 the password, we move to basically

Because we are salting and hasing our password with both sha256 and then bcrypt to account for passwords that are over 75 characters

```ts
import { compare, hash } from "bcryptjs";
import * as crypto from "crypto";
import { hashPassword, verifyPassword } from "./password";

const SALT = "my super secret salt";

const sha256 = () => crypto.createHmac("sha256", SALT);

export function verifyWithSalt(attempt: string, hashedPassword: string): Promise<boolean> {
  attempt = sha256().update(attempt).digest("hex");
  return compare(attempt, hashedPassword);
}

export async function hashWithSalt(password: string): Promise<string> {
  password = sha256().update(password).digest("hex");
  return hash(password, 10); // the value 10 here is the number of salt rounds
}
```

The more rounds, the longer it takes to run the hash to both create and verify the password.[1]

```ts
// success
it("invalid password using sha256/bcrypt fails verification", async () => {
  const passwordHash = await hasPassword(actualPassword);
  const isValid = await verifyPassword(attemptedPassword, passwordHash);

  expect(isValid).toBeFalsy();
});
```

Since the SHA256 is giving you a 64 character string, you now using bcrypt on a 64 character string where there are 2^256 possible values.[0] If a user actually entered a full 72 characters, technically they are missing out on some bytes of entropy.

If you wanted to get really crazy here, you could append the original password to the end of the sha to get to the full 72 bytes of entropy every time. This assumes that your application requires a minimum password length of 8 characters.

```ts
import * as crypto from "crypto";

const sha256 = () => crypto.createHmac("sha256", "my super secret salt");

export function verifyWithSalt(attempt: string, hashedPassword: string): Promise<boolean> {
  shaAttempt = sha256().update(attempt).digest("hex") + attempt;
  return compare(attempt, hashedPassword);
}

export async function hashWithSalt(password: string): Promise<string> {
  password = sha256().update(password).digest("hex") + password;
  return hash(password, 10);
}
```

Is it necessary for everything? Most likely not. Does it hurt to add it? Definintely not.

Sources:

[0]: https://security.stackexchange.com/questions/151297/using-sha-256-to-preprocess-password-before-bcrypt/151339/ "Using SHA-256 to preprocess password before bcrypt?"
[1]: https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds "Salt Rounds"
