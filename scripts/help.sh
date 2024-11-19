#!/bin/bash

echo "
Echo Service Commands
===================

Development
----------
npm run dev                   # Start development server with auto-reload (tsx watch)
npm run build                 # Build TypeScript project
npm start                     # Start production server
npm run prepare               # Setup Husky git hooks

Testing
-------
npm test                      # Run all tests
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Generate test coverage report
npm run test:ci               # Run tests in CI mode with coverage
npm run test:unit             # Run unit tests only
npm run test:integration      # Run integration tests only
npm run test:api              # Run API tests only
npm run start:test            # Start test server
npm run stop:test             # Stop test server

Linting
-------
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint issues automatically

Docker Operations
---------------
npm run docker:build          # Build Docker image
npm run docker:start          # Start Docker container
npm run docker:stop           # Stop Docker container
npm run docker:logs           # View container logs
npm run docker:clean          # Remove container and image
npm run docker:shell          # Open a shell in the container
npm run docker:info           # Show container information
npm run docker:restart        # Restart Docker container
npm run docker:help           # Show all Docker commands

CLI Development & Usage
-----------------------
npm run cli                   # Run CLI locally from dist/
npm run link                  # Link package globally
npm run unlink                # Unlink package globally
npx @junjie-wu/echo-service   # Run CLI without installing
"