const fs = require('fs');
const path = require('path');

// Read PORT from .env file if available
let port = process.env.PORT || 3000;
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const portMatch = envContent.match(/^PORT\s*=\s*(\d+)/m);
  if (portMatch) {
    port = parseInt(portMatch[1], 10);
  }
}

module.exports = {
  apps: [{
    name: 'audi-motor',
    cwd: __dirname,
    script: 'node_modules/next/dist/bin/next',
    args: `start -p ${port}`,
    env: {
      NODE_ENV: 'production',
      PORT: port,
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
  }]
};
