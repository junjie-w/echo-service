# Echo Service Examples

Examples of using the [Echo Service](https://github.com/junjie-w/echo-service) via [Docker image](https://hub.docker.com/r/junjiewu0/echo-service) and [NPM package](https://www.npmjs.com/package/@junjie-wu/echo-service).

## 🐳 Docker Usage

### Using Container

```bash
# Start container
npm run start:docker

# Stop container
npm run stop:docker
```

### Using Docker Compose

```bash
# Start services
npm run start:docker-compose

# View logs
npm run logs:docker-compose

# Stop services
npm run stop:docker-compose
```

## 🎯 CLI Usage

Using the package as a command-line tool:
```bash
npm run start:cli
```

## 📦 Library Usage

Using the package as a library in your code:
```bash
npm run start:lib
```

## 🧪 Testing the Examples

Each example runs on a different port to avoid conflicts.

### Docker Example (Port 3003)
```bash
curl http://localhost:3003/health
curl http://localhost:3003/echo
```

### CLI Example (Port 3002)
```bash
curl http://localhost:3002/health
curl http://localhost:3002/echo
```

### Library Example (Port 3001)
```bash
curl http://localhost:3001/health
curl http://localhost:3001/echo
```

## ⚠️ Troubleshooting

### Port Already in Use

If you see "Port in use" error:
```bash
# Check what's using the port
lsof -i :<port_number>

# Kill the process
kill -9 <PID>
```

### Docker on ARM-based machines (Apple Silicon, etc.)

The example automatically handles platform differences, but you can manually run:
```bash
docker pull --platform linux/amd64 junjiewu0/echo-service
docker run --platform linux/amd64 -p 3003:3000 junjiewu0/echo-service
```
