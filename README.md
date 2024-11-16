# Echo Service

![GitHub package.json version](https://img.shields.io/github/package-json/v/junjie-w/echo-service)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/junjie-w/echo-service/quality-checks.yml)
![Node.js](https://img.shields.io/badge/Node.js->=20-brightgreen)
[![semantic-release](https://img.shields.io/badge/semantic--release-enabled-brightgreen?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
![ESLint](https://img.shields.io/badge/ESLint-enabled-brightgreen)

A flexible HTTP echo service that mirrors back request details. Available as an NPM package for both library integration and CLI usage, as well as a Docker image for containerized deployment.

## 🚀 Quick Start

```bash
# Using Docker
docker run -p 3000:3000 junjiewu0/echo-service

# Using NPM (global)
npm install -g @junjie-wu/echo-service
echo-service

# Using NPM (as library)
npm install @junjie-wu/echo-service
```

## 📚 Usage

### 🔷 NPM Package

#### Library Integration
```typescript
import { createServer } from '@junjie-wu/echo-service';
const server = createServer(3000);
```

#### CLI Usage
```bash
npm install -g @junjie-wu/echo-service
echo-service --port 3000
```

### 🐳 Docker

```bash
# Using pre-built image
docker run -p 3000:3000 junjiewu0/echo-service

# Using Docker Compose
docker compose up -d

# Building locally
docker build -t echo-service .
docker run -p 3000:3000 echo-service
```

## ⚡ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info |
| `/health` | GET | Health check |
| `/echo` | ANY | Request mirror |

## ⚙️ Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000                  # Server port (default: 3000)
NODE_ENV=production        # Environment (default: development)

# Docker Specific
DOCKER_PORT=3000          # Container exposed port
```

### Runtime Options

```bash
# CLI Options
echo-service --port 3000
echo-service --env production

# Docker Environment
docker run -e PORT=3000 -e NODE_ENV=production junjiewu0/echo-service
```

## 🛠️ Development

### Prerequisites

- Node.js >= 20
- npm
- Docker (optional)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/junjie-w/echo-service.git
cd echo-service
```

2. Install dependencies:
```bash
npm install
```

3. Enable Git hooks:
```bash
npm run prepare
```

### Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build package |
| `test` | Run all tests |
| `test:unit` | Run unit tests |
| `test:integration` | Run integration tests |
| `test:api` | Run API tests |
| `docker:build` | Build Docker image |
| `docker:start` | Start Docker container |

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

## 📦 Distribution

- NPM Registry: [@junjie-wu/echo-service](https://www.npmjs.com/package/@junjie-wu/echo-service)
- Docker Hub: [junjiewu0/echo-service](https://hub.docker.com/r/junjiewu0/echo-service)

## 📄 License

MIT