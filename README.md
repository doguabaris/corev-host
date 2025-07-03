# Corev Host

Corev Host is the back-end and dashboard monorepo that powers the [Corev-CLI](https://www.npmjs.com/package/@corev/cli) tool. It provides:

- A RESTful API for managing dynamic configuration files (used by CLI)
- A dashboard built with Next.js

## Repository structure

```
/bin                 # Entry point for corev-host
/packages
  ├── dashboard      # Frontend (Next.js)
  └── server         # Backend (Express.js + MongoDB)
.eslint.config.mjs   # Shared ESLint config
tsconfig.json        # Shared TypeScript config
```

## Environment setup

This project **requires an `.env` file** at the root of the repository to run the server.

You can create it manually **or** copy it from the provided `.env.dist` template:

```bash
cp .env.dist .env
```

Next, open the file and update it with your own settings (like MongoDB URI and JWT secret).

>This file is ignored in version control. You must create or copy it manually before starting the server.

## Getting started

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

This will:

- Start the Express server (`packages/server`)
- Launch the Next.js dashboard (`packages/dashboard`)

### Build and start production

```bash
npm run build
npm run start
```

## Testing

```bash
npm run test
```

Runs backend tests under `packages/server/tests`.

## Lint & Format

```bash
npm run lint        # Run ESLint
npm run format      # Run Prettier
npm run format:all  # Format with Prettier, then apply ESLint --fix
```

## Publishing

This is not a publishable package on its own. It is intended to be run as a host backend for Corev-CLI.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

Corev-CLI is released under the [MIT License](LICENSE).
