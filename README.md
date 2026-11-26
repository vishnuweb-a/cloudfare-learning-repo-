Cloudflare Workers + Hono

A hands-on backend engineering project exploring how to build, organize, secure, and deploy REST APIs using Cloudflare Workers, Hono, and TypeScript.

Built as part of a practical, self-paced Cloudflare learning sprint, with an emphasis on understanding the runtime, writing APIs from scratch, and deploying within the free tier.






Live Deployment

Backend: sparkling-silence-06e4.vishnu-coder.workers.dev

The backend was deployed to Cloudflare's global Workers network using Wrangler and a free workers.dev subdomain with managed HTTPS.

Learning Objectives

Understand serverless and edge computing.

Build native Workers using the Fetch API before adopting a framework.

Implement REST endpoints, request body parsing, query parameters, and dynamic routes.

Use Hono for routing, middleware, CORS, and error handling.

Separate routes, controllers, services, and middleware.

Manage configuration, secrets, and resource bindings securely.

Deploy and monitor a backend without managing a traditional server.

Extend the backend with persistent SQL storage and AI inference.

Tech Stack

Technology

Purpose

Cloudflare Workers

Serverless edge runtime and deployment

Hono

Web framework and routing

TypeScript

Type-safe backend development

Wrangler

Local development, deployment, secrets, and logs

Vitest

Scaffolded automated testing framework

D1

SQLite-based persistence (extension)

Workers AI

Model inference (planned extension)

Architecture

flowchart TD
    A[Browser / API Client] -->|HTTPS| B[Cloudflare Worker]
    B --> C[Hono Middleware]
    C --> D[Routes]
    D --> E[Controllers]
    E --> F[Services]
    F --> G[Application Data]
    F -. D1 extension .-> H[(D1 Database)]
    F -. AI extension .-> I[Workers AI]
    J[Secrets / Bindings] --> C
    J --> F

Hono handles HTTP routing and middleware while Cloudflare manages the runtime. Controllers process requests and return responses; services encapsulate business logic and data access.

Project Structure

The structure below reflects the modular architecture introduced during the learning sprint. Some directories may remain empty until their features are implemented.

sparkling-silence-06e4/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── user.routes.ts
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── types/
│   │   └── env.ts
│   ├── config/
│   └── utils/
├── test/
├── .dev.vars                  # Local secrets; never commit
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── worker-configuration.d.ts
└── wrangler.jsonc

A schema.sql file is introduced in the D1 extension.

Getting Started

Prerequisites

Node.js LTS and npm

A Cloudflare account on the Workers Free plan

Git (optional for local development)

Install dependencies

Clone or download this repository, open the project directory, and run:

npm install

Local configuration

Preserve the existing wrangler.jsonc settings. When deploying under a different Cloudflare account, update the account ID and choose an appropriate Worker name.

Example configuration fields:

{
  "name": "cloudflare-learning-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-11-25",
  "account_id": "YOUR_ACCOUNT_ID",
  "vars": {
    "APP_NAME": "Cloudflare Learning",
    "APP_VERSION": "1.0.0",
    "APP_ENV": "development"
  }
}

Create a .dev.vars file in the project root:

API_KEY="my-local-test-key"

This is a sample key for local testing only. Keep real secrets out of Git. Ensure .dev.vars* and .env* are ignored.

Start the development server

npm run dev

Local URL: http://localhost:8787

Test the API

Examples below use Windows PowerShell:

curl.exe http://localhost:8787/
curl.exe http://localhost:8787/api/config
curl.exe http://localhost:8787/api/users
curl.exe http://localhost:8787/api/users/1
curl.exe -i http://localhost:8787/api/protected
curl.exe -i -H "x-api-key: my-local-test-key" http://localhost:8787/api/protected

The protected endpoint should reject unauthenticated requests with HTTP 401 and return a successful response when the correct local key is supplied.

API Reference

Core endpoints from the completed lessons

Method

Endpoint

Description

GET

/

Backend health check

GET

/api/users

Retrieve sample users

GET

/api/users/:id

Retrieve a user by ID

GET

/api/config

Retrieve non-sensitive application configuration

GET

/api/protected

Test API-key authentication

The earlier native Worker and Hono routing exercises also demonstrated POST /api/users and GET /api/search?name=Rahul&age=20. The modular lesson replaced those examples with a smaller set of routes.

D1 CRUD extension

Once the D1 lesson is implemented, the users routes become database-backed and are protected by the API-key middleware.

Method

Endpoint

Description

GET

/api/users

List users

GET

/api/users/:id

Read a specific user

POST

/api/users

Create a user

PUT

/api/users/:id

Update a user

DELETE

/api/users/:id

Delete a user

Example request after implementing D1:

$headers = @{"x-api-key" = "my-local-test-key"}
Invoke-RestMethod -Uri "http://localhost:8787/api/users" -Method POST -Headers $headers -ContentType "application/json" -Body '{"name":"Vishal","email":"vishal@example.com"}'

Do not assume these extension routes are already deployed.

Deploy to Cloudflare

Authenticate and check which account is selected:

npx wrangler login
npx wrangler whoami

Set a production secret using the interactive prompt:

npx wrangler secret put API_KEY
npx wrangler secret list

Use a strong, unique randomly generated value rather than the local example. Deploy:

npx wrangler deploy

If this is your first deployment, register a free workers.dev subdomain when prompted. Use the public URL printed by Wrangler. A newly provisioned HTTPS certificate may take time to become available.

Monitor requests:

npx wrangler tail

D1 Database Extension

Create a database when ready to implement persistent CRUD:

npx wrangler d1 create cloudflare-learning-db

Add the generated database details to wrangler.jsonc with the binding name DB. Use the real database ID returned by Wrangler. Add DB: D1Database to the Hono environment type.

Example schema:

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

Save it as schema.sql, initialize locally, and inspect:

npx wrangler d1 execute cloudflare-learning-db --local --file=./schema.sql
npx wrangler d1 execute cloudflare-learning-db --local --command="SELECT * FROM users"

When ready to initialize the intended remote database:

npx wrangler d1 execute cloudflare-learning-db --remote --file=./schema.sql
npx wrangler deploy

Local and remote databases are independent. Deploying the Worker does not copy local database contents. Use prepared statements and bound parameters for user-supplied values.

Workers AI Extension

A planned extension is a private AI-powered developer assistant endpoint. Workers AI can be accessed by adding an AI resource binding and invoking a supported model through c.env.AI.run().

Before enabling it, verify the account's free allowance and model availability. Protect inference endpoints, cap input and output, monitor usage, and avoid enabling paid services or unified billing.

Security Notes

Never commit local secrets or expose API keys in frontend code.

Use strong production secrets and rotate them when needed.

Restrict CORS to the actual frontend origins.

CORS is not authentication.

Validate incoming requests and use parameterized SQL.

Avoid persistent application state in Worker memory.

The API-key middleware is a learning exercise, not a full user authentication system.

Add user-level authorization, rate limits, and integration tests before production use.

Useful Commands

Command

Purpose

npm run dev

Run locally

npm test

Run tests if configured in package.json

npx tsc --noEmit

Check TypeScript

npx wrangler types

Generate runtime and binding types

npx wrangler deploy

Deploy or update Worker

npx wrangler tail

Stream logs

npx wrangler deployments list

View deployment history

Update scaffolded tests as routes evolve.

Learning Roadmap

Cloudflare fundamentals and native Workers

REST APIs with GET, POST, query parameters, and dynamic routes

Global deployment and managed HTTPS

Hono framework and routing

Middleware, logging, CORS, and modular architecture

Environment variables, secrets, and protected routes

D1 persistence and complete CRUD

Workers AI integration

AI Gateway

React frontend deployment

End-to-end testing and production hardening

Official Resources

Cloudflare Workers

Wrangler

Hono

Cloudflare D1

Workers AI

AI Gateway

Workers pricing

Author

Vishnu Bhardwaj — Full-Stack & Backend Developer, B.Tech Computer Science, SRM University.

This project is part of my hands-on learning journey, focused on building real systems, understanding their architecture, and documenting the process for fellow developers.

Built by learning, implementing, testing, and deploying — not just watching tutorials.
