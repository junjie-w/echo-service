# Echo Service Examples

Examples of using the [Echo Service](https://github.com/junjie-w/echo-service) via [Docker image](https://hub.docker.com/r/junjiewu0/echo-service) and [NPM package](https://www.npmjs.com/package/@junjie-wu/echo-service).
Each example runs on a different port to avoid conflicts.

## 🐳 Docker Usage (Port 3003)

### Using Container

```bash
# Start container
npm run start:docker

# Stop container
npm run docker:stop
```

### Using Docker Compose

```bash
# Start services
npm run compose:up

# View logs
npm run compose:logs

# Stop services
npm run compose:down
```

## 🎯 CLI Usage (Port 3002)

Using the package as a command-line tool:
```bash
npm run start:cli
```

## 📦 Library Usage (Port 3001)

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

### Docker on Apple Silicon (M1/M2/M3)
The example automatically handles platform differences, but you can manually run:
```bash
docker run --platform linux/amd64 -p 3003:3000 junjiewu0/echo-service
```
