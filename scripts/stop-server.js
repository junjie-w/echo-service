import { execSync } from 'child_process';

const command = process.platform === 'win32'
  ? 'taskkill /F /IM node.exe || exit 0'
  : 'pkill -f "node dist/server.js" || exit 0';

execSync(command, { stdio: 'inherit' });
