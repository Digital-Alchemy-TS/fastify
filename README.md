# 📨 Welcome to the Fastify Adapter Library

- [Extended docs](https://docs.digital-alchemy.app)
- [Discord](https://discord.gg/JkZ35Gv97Y)

This library acts as a simple wrapper for Fastify, allowing it to be configured and loaded by @digital-alchemy workflows

## 🥡 Import Code

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/fastify-extension
```

> **Add to code**

```typescript
import { LIB_FASTIFY } from "@digital-alchemy/fastify-extension";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_FASTIFY],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_FASTIFY],
  name: "special_logic",
})
```

## 🧲 Usage

```typescript
export function Example({ fastify }: TServiceParams) {
  fastify.routes((fastify: FastifyInstance) => {
    fastify.post("/a", () => { /*...*/ });
    fastify.get("/b", () => { /*...*/ });
  });
}
```
