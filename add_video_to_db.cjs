/* eslint-disable */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Attempting to add "videoUrl" column to "Performer" table...');
    try {
        await prisma.$executeRawUnsafe('ALTER TABLE "Performer" ADD COLUMN "videoUrl" TEXT;');
        console.log('✅ Success: Column "videoUrl" added to database.');
        console.log('👉 NEXT STEP: Run "npx prisma generate" to update the client.');
        console.log('👉 THEN: Restart your server.');
    } catch (e) {
        if (e.message && e.message.includes('already exists')) {
            console.log('ℹ️  Column "videoUrl" already exists in the database. No changes made.');
        } else {
            console.error('❌ Error executing SQL:', e.message);
            console.log('⚠️  Try running this SQL manually in your database:');
            console.log('   ALTER TABLE "Performer" ADD COLUMN "videoUrl" TEXT;');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
