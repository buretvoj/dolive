import React, { useState, useEffect } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { Crown, Music, MapPin, Info as InfoIcon, Tent, Utensils, Save } from 'lucide-react'
import './Admin.css'
import './Info.css'

const ICON_MAP: Record<string, any> = {
    Crown, Music, MapPin, InfoIcon, Tent, Utensils
}

interface HubItem {
    id: string
    title: string
    description: string
    accent: string
    order: number
}

export default function AdminInfo() {
    const [page, setPage] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [navPages, setNavPages] = useState<any[]>([])

    const FIXED_SLUGS = ['index', 'tickets', 'info']
    const getToken = () => localStorage.getItem('token')

    const fetchData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pages/info`)
            const data = await res.json()
            setPage(data)

            const pagesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/pages`)
            const pagesData = await pagesRes.json()
            const filtered = pagesData.filter((p: any) => FIXED_SLUGS.includes(p.slug))
                .sort((a: any, b: any) => FIXED_SLUGS.indexOf(a.slug) - FIXED_SLUGS.indexOf(b.slug))
            setNavPages(filtered)
        } catch (error) {
            console.error('Failed to fetch info:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdateItem = async (itemId: string, updates: Partial<HubItem>) => {
        if (!page) return
        setSaving(true)

        const section = page.sections.find((s: any) => s.type === 'info-hub')
        if (!section) return

        const updatedItems = section.content.items.map((item: HubItem) =>
            item.id === itemId ? { ...item, ...updates } : item
        )

        const updatedContent = { ...section.content, items: updatedItems }

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/sections/${section.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ content: updatedContent })
            })
            // Update local state
            setPage({
                ...page,
                sections: page.sections.map((s: any) =>
                    s.id === section.id ? { ...s, content: updatedContent } : s
                )
            })
        } catch (error) {
            console.error('Failed to update:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="admin-container"><Spinner /></div>

    const hubSection = page?.sections.find((s: any) => s.type === 'info-hub')
    const items = hubSection?.content.items || []

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>DOLIVE CMS</h1>
                <nav className="admin-nav">
                    {navPages.map(p => (
                        <button
                            key={p.id}
                            className={`nav-item ${p.slug === 'info' ? 'active' : ''}`}
                            onClick={() => window.location.href = p.slug === 'index' ? '/admin' : (p.slug === 'tickets' ? '/admin/tickets' : (p.slug === 'info' ? '/admin/info' : `/admin?page=${p.slug}`))}
                        >
                            {p.slug === 'index' ? 'Domů' : (p.slug === 'info' ? 'Info' : (p.slug === 'tickets' ? 'Vstupenky' : p.title))}
                        </button>
                    ))}
                    <button className="nav-item" onClick={() => window.location.href = '/admin/performers'}>Performers</button>
                    <button className="nav-item" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }} style={{ color: 'red' }}>Logout</button>
                </nav>
                <a href="/" className="back-link">← Back to Site</a>
            </header>

            <main className="admin-editor admin-editor-full">
                <div className="editor-header">
                    <h2>Rozcestník informací</h2>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Kliknutím na text v kartách jej přímo upravíte.</p>
                </div>

                <div className="info-hub" style={{ padding: '2rem 0' }}>
                    <div className="info-hub-grid">
                        {items.map((item: HubItem) => {
                            const IconComp = ICON_MAP[item.title === 'Pobyt na festivalu' ? 'InfoIcon' : (item.id.charAt(0).toUpperCase() + item.id.slice(1))] || InfoIcon;
                            return (
                                <div key={item.id} className={`info-hub-card info-hub-card--${item.accent}`} style={{ cursor: 'default' }}>
                                    <div className="info-hub-card-bg"></div>
                                    <div className="info-hub-card-content">
                                        <div className="cms-card-tools" style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                                            <select
                                                value={item.accent}
                                                onChange={(e) => handleUpdateItem(item.id, { accent: e.target.value })}
                                                style={{ fontSize: '0.6rem', padding: '2px' }}
                                            >
                                                <option value="green">green</option>
                                                <option value="pink">pink</option>
                                                <option value="navy">navy</option>
                                                <option value="lime">lime</option>
                                                <option value="orange">orange</option>
                                                <option value="brown">brown</option>
                                            </select>
                                            <button
                                                onClick={() => window.location.href = `/admin/info/${item.id}`}
                                                style={{ fontSize: '0.6rem', padding: '2px 5px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                EDIT DETAIL
                                            </button>
                                        </div>
                                        <div className="info-hub-card-icon">
                                            <IconComp size={32} />
                                        </div>
                                        <input
                                            className="info-hub-card-title"
                                            value={item.title}
                                            onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                                            style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', width: '100%', marginBottom: '0.5rem' }}
                                        />
                                        <textarea
                                            className="info-hub-card-desc"
                                            value={item.description}
                                            onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                                            style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', width: '100%', resize: 'none', minHeight: '60px' }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {saving && <div className="saving-indicator">Ukládání...</div>}
            </main>
        </div>
    )
}
