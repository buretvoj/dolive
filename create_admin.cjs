const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        console.log(`User created with username: ${user.username}`);
    } catch (e) {
        if (e.code === 'P2002') {
            console.log('User already exists, updating password...');
            const user = await prisma.user.update({
                where: { username },
                data: { password: hashedPassword },
            });
            console.log(`Password updated for user: ${user.username}`);
        } else {
            console.error(e);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
