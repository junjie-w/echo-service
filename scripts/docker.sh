#!/bin/bash
set -e

# Allowed commands
allowed_targets=(
  'build'           # Build the image
  'start'           # Start services
  'stop'            # Stop services
  'restart'         # Restart services
  'logs'            # View logs
  'shell'           # Enter container shell
  'clean'           # Remove all containers and images
  'status'          # Check service status
  'info'            # Show service information
)

# Base variables
service_name="echo-service"
compose_file="docker-compose.yml"

# Load service info from package.json
version=$(node -p "require('./package.json').version")
source_code="https://github.com/junjie-w/echo-service"

# Commands
build() {
    echo "Building services..."
    docker compose build
}

start() {
    echo "Starting services..."
    docker compose up -d
    echo "Service started at http://localhost:${PORT:-3000}"
    echo "Health check: http://localhost:${PORT:-3000}/health"
}

stop() {
    echo "Stopping services..."
    docker compose down
}

restart() {
    stop
    start
}

logs() {
    if [ "$1" ]; then
        docker compose logs -f "$1"
    else
        docker compose logs -f
    fi
}

shell() {
    echo "Opening shell in container..."
    docker compose exec $service_name sh
}

clean() {
    echo "Stopping all containers..."
    docker compose down
    
    echo "Removing all project images..."
    docker images | grep $service_name | awk '{print $3}' | xargs -r docker rmi -f
    
    echo "Cleanup complete!"
}

status() {
    echo "Service Status:"
    echo "=============="
    docker compose ps
}

info() {
    echo "Service Information:"
    echo "==================="
    echo "Name: $service_name"
    echo "Version: $version"
    echo "Source Code: $source_code"
    echo "Environment: ${NODE_ENV:-development}"
    echo "Port: ${PORT:-3000}"
    echo
    echo "Container Status:"
    docker compose ps
}

# Help message with descriptions
help() {
    echo "Echo Service Docker Control Script"
    echo "================================="
    echo
    echo "Available commands:"
    echo "  build           - Build the Docker image"
    echo "  start           - Start all services"
    echo "  stop            - Stop all services"
    echo "  restart         - Restart all services"
    echo "  logs [svc]      - View logs (optionally for specific service)"
    echo "  shell           - Open a shell in the container"
    echo "  clean           - Remove all containers and images"
    echo "  status          - Show service status"
    echo "  info            - Show service information"
    echo
    echo "Usage: ./scripts/docker.sh [command]"
}

# Main execution
main() {
    command="$1"
    shift # Remove the first argument
    if [[ " ${allowed_targets[@]} " =~ " ${command} " ]]; then
        $command "$@"
    else
        help
    fi
}

main "$@"