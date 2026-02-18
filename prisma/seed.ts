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

    // 3. Create Admin User
    const existingAdmin = await prisma.user.findFirst();

    if (!existingAdmin) {
        // Password: 'dolive' hashed with bcrypt (cost 10)
        // This hash is for 'dolive': $2a$10$TjK.H9f.z9.t.h.u.g.s.o.f.d.o.l.i.v.e  <-- example, let's use a real one generated safely
        // But since we can use bcryptjs in TSX environment:
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('dolive', 10);

        await prisma.user.create({
            data: {
                username: 'admin',
                password: hashedPassword,
            },
        });
        console.log('Created admin user: admin / dolive');
    } else {
        console.log('Admin user already exists.');
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
