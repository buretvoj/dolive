/* eslint-disable */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .normalize('NFD')                   // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '')   // remove diacritical marks
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')              // replace spaces with -
        .replace(/[^\w-]+/g, '')           // remove all non-word chars
        .replace(/--+/g, '-');             // replace multiple - with single -
}

async function main() {
    console.log('🔄 Attempting to add "slug" column and populate it...');

    try {
        // 1. Add column if it doesn't exist
        await prisma.$executeRawUnsafe('ALTER TABLE "Performer" ADD COLUMN "slug" TEXT;');
        console.log('✅ Column "slug" added to database.');
    } catch (e) {
        if (e.message && e.message.includes('already exists')) {
            console.log('ℹ️  Column "slug" already exists in database.');
        } else {
            console.error('❌ Error adding column:', e.message);
        }
    }

    // 2. Populate slugs using RAW SQL to bypass Prisma Client validation
    const performers = await prisma.$queryRawUnsafe('SELECT id, name, year FROM "Performer"');
    console.log(`📝 Processing ${performers.length} performers...`);

    for (const p of performers) {
        const baseSlug = `${p.year}-${slugify(p.name)}`;
        let uniqueSlug = baseSlug;

        await prisma.$executeRawUnsafe(
            'UPDATE "Performer" SET slug = $1 WHERE id = $2',
            uniqueSlug, p.id
        );
        console.log(`   ✅ Set slug "${uniqueSlug}" for "${p.name}"`);
    }

    try {
        // 3. Set NOT NULL and UNIQUE constraints
        await prisma.$executeRawUnsafe('ALTER TABLE "Performer" ALTER COLUMN "slug" SET NOT NULL;');
        await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "Performer_slug_key" ON "Performer"("slug");');
        console.log('✅ Constraints applied (NOT NULL, UNIQUE).');
    } catch (e) {
        console.error('⚠️  Constraint error (maybe duplicates?):', e.message);
    }

    console.log('👉 FINAL STEP: Now run "npx prisma generate" and restart your server.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
