import dotenv from 'dotenv';

dotenv.config();

console.log('ACCESS_SECRET:', process.env.ACCESS_SECRET);
console.log('REFRESH_SECRET:', process.env.REFRESH_SECRET);

export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}
