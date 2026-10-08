/**
 * Database Switcher Script
 * Usage:
 *   node scripts/switch-db.js postgres
 *   node scripts/switch-db.js sqlite
 */

const fs = require('fs');
const path = require('path');

const target = process.argv[2]?.toLowerCase();
const schemaPrismaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const postgresSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.postgres.prisma');

if (target === 'postgres') {
  if (!fs.existsSync(postgresSchemaPath)) {
    console.error('schema.postgres.prisma not found');
    process.exit(1);
  }
  const content = fs.readFileSync(postgresSchemaPath, 'utf8');
  fs.writeFileSync(schemaPrismaPath, content);
  console.log('✓ Switched Prisma schema to PostgreSQL (provider: postgresql, url: env("DATABASE_URL"))');
  console.log('Run `npx prisma generate` and `npx prisma db push` or `npx prisma migrate dev` to sync.');
} else if (target === 'sqlite') {
  let content = fs.readFileSync(schemaPrismaPath, 'utf8');
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  content = content.replace(/url\s*=\s*env\("DATABASE_URL"\)/g, 'url = "file:./dev.db"');
  content = content.replace(/@db\.Text/g, '');
  fs.writeFileSync(schemaPrismaPath, content);
  console.log('✓ Switched Prisma schema to SQLite (provider: sqlite, url: "file:./dev.db")');
  console.log('Run `npx prisma generate` and `npx prisma db push` to sync.');
} else {
  console.log('Usage: node scripts/switch-db.js [postgres|sqlite]');
}
