# Instructions for AI Agents

This project is a Node.js backend (Express) migrated from Go, deployed as Firebase Functions.

## Key Components

- **Entry Point**: `index.js` contains the `Handler` function used as the entry point for Firebase Functions.
- **Local Development**: `server.js` allows running the server locally. Use `npm start` or `npm run dev` (with nodemon).
- **Routing**: `handlers/router.js` contains the `newRouter()` function which defines all application routes using Express. Both local and cloud entry points use this router.
- **Configuration**: `firebase.json` and `.firebaserc` manage the Firebase deployment configuration.
- **Environment Variables**: Managed via `utils/loadEnv.js`. In production (Firebase), variables should be set in the Firebase Function configuration or via GitHub Actions.

## CI/CD Workflows

- **CI (`ci.yml`)**: Runs on every push and pull request to `main`. It executes `npm install` and `npm test`.
- **CD (`deploy.yml`)**: Supports both automatic and manual deployment.
    - **Authentication**: Uses a **Service Account JSON key** stored in the `FIREBASE_TOKEN` secret.
    - **Automatic**: Merges to `main` deploy to the `production-tss` environment.
    - **Manual**: Use `workflow_dispatch` to select a specific environment (`production-tss`, `production-alm181`).
    - **Tagging**: After a successful deployment, it creates a tag with the format `v1.0.RUN_NUMBER-ENV`.

## Best Practices

- When adding new routes, add them to `handlers/router.js`.
- Keep business logic in the `services/` package.
- Ensure all new handlers have corresponding tests in `handlers/handlers.test.js`.
- To support new clients, instruct the user to create a new GitHub Environment with its own `FIREBASE_TOKEN` (Service Account JSON) and `FIREBASE_PROJECT_ID`.
