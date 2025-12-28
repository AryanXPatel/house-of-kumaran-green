/**
 * Admin Password Hash Generator
 * 
 * Run this script to generate a bcrypt hash for your admin password:
 * 
 * Usage:
 *   node scripts/generate-admin-hash.js YOUR_PASSWORD_HERE
 * 
 * Then add the output to your .env.local file as:
 *   ADMIN_PASSWORD_HASH=the_generated_hash
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

async function generateHash() {
    const password = process.argv[2];

    if (!password) {
        console.error('❌ Error: Please provide a password as an argument');
        console.error('');
        console.error('Usage: node scripts/generate-admin-hash.js YOUR_PASSWORD_HERE');
        console.error('');
        console.error('Example: node scripts/generate-admin-hash.js MySecurePassword123!');
        process.exit(1);
    }

    if (password.length < 8) {
        console.error('❌ Error: Password must be at least 8 characters long');
        process.exit(1);
    }

    console.log('');
    console.log('🔐 Generating bcrypt hash with', SALT_ROUNDS, 'rounds...');
    console.log('');

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    console.log('✅ Hash generated successfully!');
    console.log('');
    console.log('Add this to your .env.local file:');
    console.log('');
    console.log('ADMIN_PASSWORD_HASH=' + hash);
    console.log('');
    console.log('⚠️  IMPORTANT: Never commit this hash to version control!');
    console.log('');
}

generateHash().catch(console.error);
