import { execSync } from 'child_process';

const CLI_PORT = 3002;

console.log(`
🚀 Echo Service CLI Example
=========================
`);

try {
  console.log(`\nStarting echo-service on port ${CLI_PORT}...\n`);
  
  execSync(`npx @junjie-wu/echo-service --port ${CLI_PORT}`, {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      PORT: CLI_PORT.toString() 
    }
  });
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nTry manually:');
  console.log(`npx @junjie-wu/echo-service --port ${CLI_PORT}`);
  process.exit(1);
}
