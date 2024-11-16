#!/bin/bash

echo "
Echo Service Commands
===================

Development
----------
npm run dev          # Start development server
npm start           # Start production server

Docker
------
npm run docker:build # Build Docker image
npm run docker:start # Start Docker container
npm run docker:stop  # Stop Docker container

Package Development
-----------------
npm run cli         # Run CLI locally
npm run link        # Link package globally
npm run unlink      # Unlink @junjie-wu/echo-service globally

Global Usage
-----------
# Install globally
npm install -g @junjie-wu/echo-service

# Run anywhere
echo-service

# Or use npx without installing
npx @junjie-wu/echo-service

Environment Variables
-------------------
PORT                # Specify port (default: 3000)
"