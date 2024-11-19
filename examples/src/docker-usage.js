import { execSync } from 'child_process';

const DOCKER_PORT = 3003;
const IMAGE_NAME = 'junjiewu0/echo-service';
const IMAGE_TAG = 'latest';
const CONTAINER_NAME = 'echo-service-example';

console.log(`
🐳 Echo Service Docker Example
===========================
`);

let isArm = false;
try {
  const arch = execSync('uname -m').toString().trim();
  isArm = arch === 'arm64' || arch === 'aarch64';
} catch (error) {
  console.error('Architecture detection failed:', error);
  isArm = false;
}

const pullAndRunDocker = (platformFlag = '') => {
  console.log('1. Pulling Docker image...');
  execSync(`docker pull ${platformFlag}${IMAGE_NAME}:${IMAGE_TAG}`, { stdio: 'inherit' });

  console.log('\n2. Starting container...');
  execSync(`docker run ${platformFlag}-d -p ${DOCKER_PORT}:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${IMAGE_TAG}`, {
    stdio: 'inherit'
  });
};

try {
  if (isArm) {
    console.log(`
⚠️  ARM64 Architecture Detected (Apple Silicon Macs (M1/M2/M3))
Running with platform flag...
`);
    pullAndRunDocker('--platform linux/amd64 ');
  } else {
    pullAndRunDocker();
  }

  console.log(`
✅ Container started successfully!

Test the service:
curl http://localhost:${DOCKER_PORT}/health
curl http://localhost:${DOCKER_PORT}/echo

View logs:
docker logs ${CONTAINER_NAME}

Stop container:
docker stop ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}
`);

} catch (error) {
  console.error('\n❌ Error:', error.message);
  
  try {
    execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: 'ignore' });
  } catch (cleanupError) {
    console.error('Failed to remove container:', cleanupError);
  }

  console.log(`
Troubleshooting:
1. Make sure Docker is running
2. Check if port ${DOCKER_PORT} is available
3. For ARM-based machines (Apple Silicon, etc.), try manually:

   docker pull --platform linux/amd64 ${IMAGE_NAME}:${IMAGE_TAG}
   docker run --platform linux/amd64 -p ${DOCKER_PORT}:3000 ${IMAGE_NAME}:${IMAGE_TAG}

4. For other architectures:
   docker pull ${IMAGE_NAME}:${IMAGE_TAG}
   docker run -p ${DOCKER_PORT}:3000 ${IMAGE_NAME}:${IMAGE_TAG}
`);
}
