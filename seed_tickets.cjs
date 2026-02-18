const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding tickets from static data...');

    const tickets = [
        {
            title: 'První vlna',
            price: '350 Kč',
            badge: 'Právě v prodeji',
            description: 'do vyprodání',
            features: 'nejpozději do 30. 6. 2025',
            buttonText: 'Koupit',
            type: 'active',
            order: 0,
            active: true
        },
        {
            title: 'Druhá vlna',
            price: '450 Kč',
            badge: null,
            description: 'do vyprodání',
            features: 'nejpozději do 20. 8. 2026',
            buttonText: 'Brzy v prodeji',
            type: 'upcoming',
            order: 1,
            active: true
        },
        {
            title: 'Přátelé festivalu',
            price: '1 500 Kč',
            badge: 'Srdcovka',
            description: 'Podpořte nás a získejte:',
            features: '• Vstup na festival\n• Půllitr DOlive',
            buttonText: 'Podpořit',
            type: 'support',
            order: 2,
            active: true
        },
        {
            title: 'Na místě',
            price: '600 Kč',
            badge: null,
            description: 'Cena na místě v den konání festivalu.',
            features: null,
            buttonText: 'Jen na místě',
            type: 'onsite',
            order: 3,
            active: true
        }
    ];

    for (const t of tickets) {
        await prisma.ticket.create({
            data: t
        });
        console.log(`✅ Created ticket: ${t.title}`);
    }

    console.log('🚀 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
