# Memory with MongoDB

This example demonstrates how to use Mastra's memory system with MongoDB for both storage and vector search (Atlas Vector Search).

## Prerequisites

Create a `.env` file in this folder with:

```
OPENAI_API_KEY=<your-api-key>
MONGODB_URL=<your-mongodb-connection-string>
MONGODB_DB=mastra
```

Install dependencies from repo root:

```
pnpm i
```

## Run

From this folder:

```
bun run --watch src/index.ts
```

Or interactive chat:

```
bun run --watch src/chat.ts
```
