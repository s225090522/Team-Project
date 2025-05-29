// generateEnv.js
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envPath = path.join(`${__dirname}/Backend/`, '.env');

// Generate a random JWT secret
const generateSecret = () => crypto.randomBytes(64).toString('hex');

// Load or create .env file
let env = '';
if (fs.existsSync(envPath)) {
  env = fs.readFileSync(envPath, 'utf-8');
  if (!env.includes('JWT_SECRET')) {
    env += `\nJWT_SECRET=${generateSecret()}\n`;
    fs.writeFileSync(envPath, env);
    console.log('✅ JWT_SECRET added to .env');
  } else {
    console.log('✅ .env already contains JWT_SECRET');
  }
} else {
  env = `MONGO_URI=mongodb://localhost:27017/homeglam\nJWT_SECRET=${generateSecret()}\n`;
  fs.writeFileSync(envPath, env);
  console.log('✅ .env file created with JWT_SECRET');
}
