---
title: Using SHA256 to preprocess password before bcrypt
description: Showing example of 72 bytes
date: 2021-04-22T09:25:00-0700
categories:
- software
- backend
tags:
- nodejs
- bcrypt
- security
draft: true
---

edit learning that most of this is irrelevant: update post why...

Using SHA256 to preprocess a password before bcrypt seems to have a few benefits over using bcrypt alone. A typical bcrypt setup would have two functions.

*  `hashPassword` takes a users password string and returns the hashed value. This value is a one way hash, and theoretically cannot be unencrypted. The value 10 refers to the number of salt rounds. The larger the number the longer it takes to run the hash to both create and verify the password. [^fn:1]
* `verifyPassword` takes a password attempt, and a hashed password, and returns a boolean value if the password attempted is valid.

```ts
import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export function verifyPassword(attempt: string, hashedPassword: string) {
  return compare(attempt, hashedPassword);
}
```

The salt rounds is the number of calculations 2^10[^fn:4]

The salt is random every single time, a

## Only the first 72 bytes of the password are evaluated with bcrypt

This means that if a user enters a password that is longer than 72 bytes, any character after the 72nd byte is ignored.[^fn:2] 72 bytes is roughly 72 characters, although it could be less if there are emo

Here is a password that is longer than 72 bytes.

```ts
const s = "This string is exactly 72 bytes long to demonstrate the example.........";
const actualPassword = s + "additional characters";

console.log(actualPassword)
// outputs:
// This string is exactly 72 bytes long to demonstrate the example.........additional characters
```

{{< tip info >}}It is possible for a string to contain less than 72 characters, while taking up more than 72 bytes (e.g. a UTF-8 encoded string containing emojis).{{< /tip >}}

With this setup, if we attempt a password that was 

```ts
const actualPassword = bytes72 + "additional characters";
const attemptedPassword = bytes72 + "wrong additional characters";

// we need to make this test pass without changing our assertion
it("invalid password fails verification", async () => {
  const passwordHash = await hashPassword(actualPassword);
  const isValid = await verifyPassword(attemptedPassword, passwordHash);

  // Do not change this line
  expect(isValid).toBeFalsy();
});
```



```ts
invalid password fails verification  
  
expect(received).toBeFalsy()  
  
Received: true  
  
   9  |   const isValid = await verifyPassword(attemptedPassword, passwordHash);  
   10 |  
\> 11 |   expect(isValid).toBeFalsy();  
      |                   ^  
   12 | });  
   13 |
```

If you preprocess password with bcrypt, you allow users to enter passwords longer than 72 characters.


On the other hand if a user has a very short password, only its few bytes are evaluated during the hash.  By preprocessing the short password with SHA256, the end string that will be hash output will be a 64 character hexadecimal screen that that 


Even though the user entered the wrong password, this test will not pass because bcrypt is only checking the first 72 bytes.

This means that all characters after the first ~72 will be ignored during the hash and verify.


```ts
import crypto from "crypto";

const SALT = "my super secret salt";
const sha256 = () => crypto.createHmac("sha256", SALT);

const userPassword = "abc"

const presalt = sha256().update(userPassword).digest("hex");

console.log(presalt)

// outputs:
// 11891c9283d0da7054829491284074463ac7159b255317d0f65bfaa39b47d37aT
```


If we update our `hashPassword` and `verifyPassword` functions to presalt and sha256 the password, we move to basically

Because we are salting and hashing our password with both sha256 and then bcrypt to account for passwords that are over 75 characters

```ts
import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import { hashPassword, verifyPassword } from "./password";

const SALT = "my super secret salt";

const sha256 = () => crypto.createHmac("sha256", SALT);

export function verifyWithSalt(attempt: string, hashedPassword: string) {
  attempt = sha256().update(attempt).digest("hex");
  return compare(attempt, hashedPassword);
}

export async function hashWithSalt(password: string) {
  password = sha256().update(password).digest("hex");
  return hash(password, 10); // the value 10 here is the number of salt rounds
}
```



```ts
// success
it("invalid password using sha256/bcrypt fails verification", async () => {
  const passwordHash = await hasPassword(actualPassword);
  const isValid = await verifyPassword(attemptedPassword, passwordHash);

  expect(isValid).toBeFalsy();
});
```

Since the SHA256 is giving you a 64 character string, you now using bcrypt on a 64 character string where there are 2^256 possible values.[^fn:0] If a user actually entered a full 72 characters, technically they are missing out on some bytes of entropy.

If you wanted to get really crazy here, you could append the original password to the end of the sha to get to the full 72 bytes of entropy every time. This assumes that your application requires a minimum password length of 8 characters.

```ts
import * as crypto from "crypto";

const sha256 = () => crypto.createHmac("sha256", "my super secret salt");

export function verifyWithSalt(attempt: string, hashedPassword: string) {
  shaAttempt = sha256().update(attempt).digest("hex") + attempt;
  return compare(attempt, hashedPassword);
}

export async function hashWithSalt(password: string) {
  password = sha256().update(password).digest("hex") + password;
  return hash(password, 10);
}
```

Is it necessary for everything? Most likely not. Does it hurt to add it? Nope.[^fn:2]

[^fn:0]: [using sha256 to preprocess password before bcrypt](https://security.stackexchange.com/questions/151297/using-sha-256-to-preprocess-password-before-bcrypt/151339/)
[^fn:1]: [salt rounds](https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds)
[^fn:2]: [72 Bytes](https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns)
[^fn:3]: [sha256 input limit](https://stackoverflow.com/questions/17388177/is-there-a-limit-for-sha256-input)
[^fn:4]: [salt rounds cost factor](https://stackoverflow.com/a/46713082)