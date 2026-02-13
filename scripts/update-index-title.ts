import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateIndexPageTitle() {
    try {
        const result = await prisma.page.update({
            where: { slug: 'index' },
            data: { title: 'Úvod' }
        })
        console.log('✅ Page title updated successfully:', result)
    } catch (error) {
        console.error('❌ Error updating page title:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateIndexPageTitle()
