import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 3002;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Request Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// API Endpoints
app.get('/api/pages', async (req, res) => {
    try {
        const pages = await prisma.page.findMany({
            include: { _count: { select: { sections: true } } },
        });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

app.post('/api/pages', async (req, res) => {
    try {
        const { title, slug, description } = req.body;
        const page = await prisma.page.create({
            data: { title, slug, description },
        });
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create page' });
    }
});

app.get('/api/pages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await prisma.page.findUnique({
            where: { slug },
            include: { sections: { orderBy: { order: 'asc' } } },
        });
        if (!page) return res.status(404).json({ error: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

app.put('/api/sections/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content, type, order } = req.body;
        const section = await prisma.section.update({
            where: { id },
            data: { content, type, order },
        });
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update section' });
    }
});

app.delete('/api/sections/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.section.delete({
            where: { id },
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete section' });
    }
});

app.post('/api/pages/:pageId/sections', async (req, res) => {
    try {
        const { pageId } = req.params;
        const { type, content, order } = req.body;
        const section = await prisma.section.create({
            data: {
                type,
                content,
                order,
                pageId
            }
        });
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create section' });
    }
});

// Performer endpoints
app.get('/api/performers', async (req, res) => {
    try {
        const performers = await prisma.performer.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performers' });
    }
});

app.get('/api/performers/active', async (req, res) => {
    try {
        const performers = await prisma.performer.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
        });
        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active performers' });
    }
});

app.post('/api/performers', async (req, res) => {
    try {
        const { name, genre, photo, description, active, order } = req.body;
        const performer = await prisma.performer.create({
            data: { name, genre, photo, description, active, order: order || 0 },
        });
        res.json(performer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create performer' });
    }
});

app.put('/api/performers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, genre, photo, description, active, order } = req.body;
        const performer = await prisma.performer.update({
            where: { id },
            data: { name, genre, photo, description, active, order },
        });
        res.json(performer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update performer' });
    }
});

app.delete('/api/performers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.performer.delete({
            where: { id },
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete performer' });
    }
});

app.listen(PORT, () => {
    console.log(`CMS Backend running on http://localhost:${PORT}`);
});
