# Instructions for AI Agents

This project is a Go backend migrated from Google App Engine to Firebase Functions.

## Key Components

- **Entry Point**: `function.go` contains the `Handler` function used as the entry point for Firebase Functions.
- **Local Development**: `main.go` allows running the server locally. Use `go run main.go`.
- **Routing**: `handlers/router.go` contains the `NewRouter()` function which defines all application routes. Both local and cloud entry points use this router.
- **Configuration**: `firebase.json` and `.firebaserc` manage the Firebase deployment configuration.
- **Environment Variables**: Managed via `utils.LoadEnv`. In production (Firebase), variables should be set in the Firebase Function configuration or via GitHub Actions.

## CI/CD Workflows

- **CI (`ci.yml`)**: Runs on every push and pull request to `main`. It executes `go test ./...` and `go build ./...`.
- **CD (`deploy.yml`)**: Supports both automatic and manual deployment.
    - **Authentication**: Uses a **Service Account JSON key** stored in the `FIREBASE_TOKEN` secret.
    - **Automatic**: Merges to `main` deploy to the `production-tss` environment.
    - **Manual**: Use `workflow_dispatch` to select a specific environment (`production-tss`, `production-alm181`).
    - **Tagging**: After a successful deployment, it creates a tag with the format `v1.0.RUN_NUMBER-ENV`.

## Best Practices

- When adding new routes, add them to `handlers/router.go`.
- Keep business logic in the `services/` package.
- Ensure all new handlers have corresponding tests in `handlers/handlers_test.go`.
- To support new clients, instruct the user to create a new GitHub Environment with its own `FIREBASE_TOKEN` (Service Account JSON) and `FIREBASE_PROJECT_ID`.
