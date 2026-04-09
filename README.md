# block-temp-mail

A lightweight Node.js package to detect disposable/temporary email addresses. Protect your app from fake signups by verifying whether an email belongs to a temporary mail service.

## Installation

```bash
npm install block-temp-mail
```

## Usage

### ESM

```ts
import { verifyEmail } from "block-temp-mail";

const result = await verifyEmail("user@tempmail.com");
console.log(result);
```

### CommonJS

```js
const { verifyEmail } = require("block-temp-mail");

async function check() {
  const result = await verifyEmail("user@tempmail.com");
  console.log(result);
}

check();
```

## API

### `verifyEmail(email: string): Promise<VerifyEmail>`

Checks whether the given email is a disposable/temporary email address.

**Parameters:**

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `email`   | `string` | The email address to verify |

**Returns:** `Promise<VerifyEmail>`

```ts
type VerifyEmail = {
  success: boolean;
  message: string;
  data: {
    isTemporary: boolean;
    isValid: boolean;
    message: string;
  };
};
```

### Response Examples

**Temporary email detected:**

```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": {
    "isTemporary": true,
    "isValid": true,
    "message": "Temporary email."
  }
}
```

**Valid, non-temporary email:**

```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": {
    "isTemporary": false,
    "isValid": true,
    "message": "Valid email."
  }
}
```

**Invalid email format:**

```json
{
  "success": false,
  "message": "Invalid email format.",
  "data": {
    "isTemporary": false,
    "isValid": false,
    "message": "Invalid email."
  }
}
```

## Use Cases

- Block disposable emails during user registration
- Validate email quality in lead generation forms
- Prevent abuse in free-tier signups

## License

[MIT](LICENSE.md) - Tara Chand Kumawat
