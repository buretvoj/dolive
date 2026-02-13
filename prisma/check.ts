import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking database content...');
    try {
        const pages = await prisma.page.findMany({
            include: { sections: true }
        });
        console.log('Pages found:', pages.length);
        pages.forEach(p => {
            console.log(`- Page: ${p.title} (${p.slug}), Sections: ${p.sections.length}`);
        });

        if (pages.length === 0) {
            console.warn('WARNING: No pages found in database. Did the seed run correctly?');
        }
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
