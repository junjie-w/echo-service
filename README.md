# Echo Service

![GitHub package.json version](https://img.shields.io/github/package-json/v/junjie-w/echo-service)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/junjie-w/echo-service/quality-checks.yml)
![Node.js](https://img.shields.io/badge/Node.js->=20-brightgreen)
[![codecov](https://codecov.io/gh/junjie-w/echo-service/branch/main/graph/badge.svg)](https://codecov.io/gh/junjie-w/echo-service)
[![semantic-release](https://img.shields.io/badge/semantic--release-enabled-brightgreen?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
![ESLint](https://img.shields.io/badge/ESLint-enabled-brightgreen)
![Husky](https://img.shields.io/badge/Husky-enabled-brightgreen)

An HTTP echo service that mirrors back request details. 
Available as a [Docker image](https://hub.docker.com/r/junjiewu0/echo-service) for containerized deployment, as well as an [NPM package](https://www.npmjs.com/package/@junjie-wu/echo-service) for both CLI usage and library integration.

## ⭐ Quick Start

```bash
# Using Docker
docker run -p 3000:3000 junjiewu0/echo-service

# Using NPM (with CLI)
npx @junjie-wu/echo-service

# Using NPM (as library)
npm install @junjie-wu/echo-service
```

## 📚 Usage

### 🐳 Docker

```bash
# Using Pre-built Image
docker pull junjiewu0/echo-service
docker run -p 3000:3000 junjiewu0/echo-service

# For ARM-based machines (Apple Silicon, etc.)
docker pull --platform linux/amd64 junjiewu0/echo-service
docker run --platform linux/amd64 -p 3000:3000 junjiewu0/echo-service

# Using Docker Compose
docker compose up -d

# Build and Run Locally
docker build -t echo-service .
docker run -p 3000:3000 echo-service
```

### 📦 NPM Package

#### CLI Usage

```bash
npx @junjie-wu/echo-service --port 3000
```

#### Library Integration

```typescript
import { createServer } from '@junjie-wu/echo-service';
const server = createServer(3000);
```

### 🧪 Try It Out

```bash
# Check service health
curl http://localhost:3000/health

# Echo back request details
curl http://localhost:3000/echo

# Echo with query parameters
curl "http://localhost:3000/echo?name=test"

# Echo with POST data
curl -X POST -H "Content-Type: application/json" \
     -d '{"message": "hello"}' \
     http://localhost:3000/echo
```

### 📋 Examples
For complete working examples of all usage methods, check out the [examples](https://github.com/junjie-w/echo-service/tree/main/examples) directory:
```bash
git clone https://github.com/junjie-w/echo-service.git
cd echo-service/examples

# Try different examples
npm install
npm run start:docker     # Docker usage
npm run start:cli        # CLI usage
npm run start:lib        # Library usage
```

## ⚡ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/health` | GET | Health check |
| `/echo` | ALL | Request mirror |

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/junjie-w/echo-service/issues).

## 🚀 Distribution

- Docker Hub: [junjiewu0/echo-service](https://hub.docker.com/r/junjiewu0/echo-service)
- NPM Registry: [@junjie-wu/echo-service](https://www.npmjs.com/package/@junjie-wu/echo-service)

## 📄 License

MIT
