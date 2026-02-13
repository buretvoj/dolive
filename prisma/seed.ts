import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding fixed pages...');

    // 1. Clear existing (optional, but good for clean start)
    await prisma.section.deleteMany();
    await prisma.page.deleteMany();

    // 2. Create the 4 fixed pages
    const pages = [
        { title: 'Festival 2026', slug: 'index', description: 'Main page of the festival' },
        { title: 'O nás', slug: 'about', description: 'About the festival' },
        { title: 'Galerie', slug: 'gallery', description: 'Photo gallery' },
        { title: 'Vstupenky', slug: 'tickets', description: 'Ticket information' },
    ];

    for (const pageData of pages) {
        const page = await prisma.page.create({
            data: {
                ...pageData,
                sections: {
                    create: [
                        {
                            type: pageData.slug === 'index' ? 'hero' : 'content',
                            order: 1,
                            content: pageData.slug === 'index'
                                ? { subtitle: 'Prague, 2026', title: 'Festival 2026', description: 'Experience the Art of Culture', ctaPrimary: 'Tickets', ctaSecondary: 'Explore' }
                                : { title: pageData.title, text: `Content for ${pageData.title} goes here.` }
                        }
                    ]
                }
            }
        });
        console.log(`Created page: ${page.title}`);
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
