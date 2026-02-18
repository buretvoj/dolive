import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'dolive-secret-key-change-me';

function slugify(text: string) {
    if (!text) return '';
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

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

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            // Check if no users exist at all, if so, create the first one
            const userCount = await prisma.user.count();
            if (userCount === 0) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await prisma.user.create({
                    data: { username, password: hashedPassword }
                });
                const token = jwt.sign({ username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token });
            }
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// API Endpoints

// Public GET routes
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

// Protected Routes (require authentication)
// Note: We need to ensure that the middleware is applied only to these routes or that these routes are defined after the middleware.
// In the previous step I added the middleware definition but didn't apply it globally yet or only applied it to some.
// Let's explicitly apply it to the mutation routes.

app.post('/api/pages', authenticateToken, async (req, res) => {
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

app.put('/api/sections/:id', authenticateToken, async (req, res) => {
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

app.delete('/api/sections/:id', authenticateToken, async (req, res) => {
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

app.post('/api/pages/:pageId/sections', authenticateToken, async (req, res) => {
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
// GET public
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
            where: {
                active: true,
                year: 2026
            },
            orderBy: { order: 'asc' },
        });
        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active performers' });
    }
});

app.get('/api/performers/archive', async (req, res) => {
    try {
        const performers = await prisma.performer.findMany({
            where: {
                active: true,
                year: {
                    lt: 2026
                }
            },
            orderBy: [
                { year: 'desc' },
                { order: 'asc' }
            ],
        });
        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch archive performers' });
    }
});

// Public GET single performer (supports ID or slug)
app.get('/api/performers/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        let performer = await prisma.performer.findUnique({ where: { slug: identifier } });

        if (!performer) {
            performer = await prisma.performer.findUnique({ where: { id: identifier } });
        }

        if (!performer) return res.status(404).json({ error: 'Performer not found' });
        res.json(performer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performer' });
    }
});

app.post('/api/performers', authenticateToken, async (req, res) => {
    try {
        const { name, genre, photo, description, links, year, videoUrl, active, order } = req.body;
        const targetYear = parseInt(year) || 2026;
        const slug = `${targetYear}-${slugify(name)}`;
        const performer = await prisma.performer.create({
            data: { slug, name, genre, photo, description, links, year: targetYear, videoUrl, active, order: order || 0 },
        });
        res.json(performer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create performer' });
    }
});

app.put('/api/performers/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, genre, photo, description, links, year, videoUrl, active, order } = req.body;
        const targetYear = parseInt(year) || 2026;
        const slug = `${targetYear}-${slugify(name)}`;
        const performer = await prisma.performer.update({
            where: { id },
            data: { slug, name, genre, photo, description, links, year: targetYear, videoUrl, active, order },
        });
        res.json(performer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update performer' });
    }
});

app.delete('/api/performers/:id', authenticateToken, async (req, res) => {
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

// Ticket endpoints
app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

app.get('/api/tickets/active', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active tickets' });
    }
});

app.post('/api/tickets', authenticateToken, async (req, res) => {
    try {
        const { title, price, badge, description, features, buttonText, type, order, active } = req.body;
        const ticket = await prisma.ticket.create({
            data: { title, price, badge, description, features, buttonText, type, order: order || 0, active: active ?? true },
        });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

app.put('/api/tickets/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, badge, description, features, buttonText, type, order, active } = req.body;
        const ticket = await prisma.ticket.update({
            where: { id },
            data: { title, price, badge, description, features, buttonText, type, order, active },
        });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

app.delete('/api/tickets/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.ticket.delete({ where: { id } });
        res.json({ message: 'Ticket deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});


app.listen(PORT, () => {
    console.log(`CMS Backend running on http://localhost:${PORT}`);
});
