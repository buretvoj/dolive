import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import {
    ArrowLeft, Sparkles, Users, Train, Car, Baby, Cat,
    CloudRain, Wifi, CreditCard, Trash2, Tent, Shield,
    Utensils, Beer, Coffee, Leaf, Plus, Save
} from 'lucide-react'
import './Admin.css'
import './Info.css'

const ICON_MAP: Record<string, any> = {
    Sparkles, Users, Train, Car, Baby, Cat,
    CloudRain, Wifi, CreditCard, Trash2, Tent, Shield,
    Utensils, Beer, Coffee, Leaf
};

interface Section {
    id: string
    type: string
    content: any
    order: number
}

interface PageData {
    id: string
    slug: string
    title: string
    description: string // accent
    sections: Section[]
}

export default function AdminInfoDetail() {
    const { section } = useParams<{ section: string }>()
    const [pageData, setPageData] = useState<PageData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const getToken = () => localStorage.getItem('token')

    const fetchData = async () => {
        if (!section) return
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pages/info-${section}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setPageData(data)
        } catch (error) {
            console.error('Failed to fetch info detail:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [section])

    const handleUpdateSection = async (sectionId: string, updates: any) => {
        if (!pageData) return
        setSaving(true)

        const targetSection = pageData.sections.find(s => s.id === sectionId)
        if (!targetSection) return

        const updatedContent = { ...targetSection.content, ...updates }

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/sections/${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ content: updatedContent })
            })
            // Update local state
            setPageData({
                ...pageData,
                sections: pageData.sections.map(s =>
                    s.id === sectionId ? { ...s, content: updatedContent } : s
                )
            })
        } catch (error) {
            console.error('Failed to update section:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateArrayItem = async (sectionId: string, arrayName: string, index: number, updates: any) => {
        if (!pageData) return
        const targetSection = pageData.sections.find(s => s.id === sectionId)
        if (!targetSection) return

        const newArray = [...targetSection.content[arrayName]]
        newArray[index] = { ...newArray[index], ...updates }

        await handleUpdateSection(sectionId, { [arrayName]: newArray })
    }

    if (loading) return <div className="admin-container"><Spinner /></div>
    if (!pageData) return <div className="admin-container">Stránka nenalezena</div>

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>DOLIVE CMS</h1>
                <nav className="admin-nav">
                    <button className="nav-item active" onClick={() => window.location.href = '/admin/info'}>Info</button>
                    <button className="nav-item" onClick={() => window.location.href = '/admin'}>Domů</button>
                    <button className="nav-item" onClick={() => window.location.href = '/admin/tickets'}>Vstupenky</button>
                    <button className="nav-item" onClick={() => window.location.href = '/admin/performers'}>Performers</button>
                </nav>
                <Link to="/info" className="back-link">← Back to Site</Link>
            </header>

            <main className="admin-editor admin-editor-full">
                <div className="editor-header" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => window.location.href = '/admin/info'} className="btn-small">
                            <ArrowLeft size={16} />
                        </button>
                        <h2>Editace: {pageData.title}</h2>
                    </div>
                </div>

                <div className="info-detail-inner" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                    <div className="info-detail-body" style={{ width: '100%' }}>
                        {pageData.sections.map((s) => (
                            <div key={s.id} className="cms-section-wrapper" style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px dashed #ddd', borderRadius: '8px', position: 'relative', width: '100%' }}>
                                <span style={{ position: 'absolute', top: '-10px', left: '10px', background: '#fff', padding: '0 5px', fontSize: '0.6rem', color: '#999', textTransform: 'uppercase', zIndex: 5 }}>
                                    {s.type}
                                </span>

                                {s.type === 'text-block' && (
                                    <div className="info-text-block">
                                        <textarea
                                            className="lead"
                                            value={s.content.lead}
                                            onChange={(e) => handleUpdateSection(s.id, { lead: e.target.value })}
                                            style={{ width: '100%', minHeight: '350px', background: '#fcfcfc', border: '1px solid #eee', padding: '1.5rem', borderRadius: '4px', fontFamily: 'inherit', fontSize: '1.3rem', lineHeight: '1.6', resize: 'vertical', color: 'var(--fg)' }}
                                        />
                                    </div>
                                )}

                                {(s.type === 'cards-2col' || s.type === 'cards-3col') && (
                                    <div className={s.type === 'cards-2col' ? 'info-grid-2col' : 'info-grid-3col'}>
                                        {s.content.cards.map((card: any, idx: number) => {
                                            const Icon = ICON_MAP[card.icon];
                                            return (
                                                <div key={idx} className={`info-card organic-card organic-card-${card.accent}`} style={{ cursor: 'default' }}>
                                                    <div className="cms-card-tools" style={{ position: 'absolute', top: '5px', right: '5px' }}>
                                                        <select
                                                            value={card.icon}
                                                            onChange={(e) => handleUpdateArrayItem(s.id, 'cards', idx, { icon: e.target.value })}
                                                            style={{ fontSize: '0.6rem' }}
                                                        >
                                                            {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="card-header-with-icon">
                                                        {Icon && <Icon className="card-icon" />}
                                                        <input
                                                            value={card.title}
                                                            onChange={(e) => handleUpdateArrayItem(s.id, 'cards', idx, { title: e.target.value })}
                                                            style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}
                                                        />
                                                    </div>
                                                    <textarea
                                                        value={card.text}
                                                        onChange={(e) => handleUpdateArrayItem(s.id, 'cards', idx, { text: e.target.value })}
                                                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', width: '100%', resize: 'none', minHeight: '80px' }}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {s.type === 'highlight-box' && (
                                    <input
                                        className="highlight-box"
                                        value={s.content.text}
                                        onChange={(e) => handleUpdateSection(s.id, { text: e.target.value })}
                                        style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center' }}
                                    />
                                )}

                                {s.type === 'icon-list' && (
                                    <ul className="icon-list">
                                        {s.content.items.map((item: any, idx: number) => {
                                            const Icon = ICON_MAP[item.icon];
                                            return (
                                                <li key={idx} style={{ position: 'relative' }}>
                                                    <div className="icon-wrapper">
                                                        {Icon && <Icon />}
                                                        <select
                                                            value={item.icon}
                                                            onChange={(e) => handleUpdateArrayItem(s.id, 'items', idx, { icon: e.target.value })}
                                                            style={{ position: 'absolute', top: '-15px', left: 0, fontSize: '0.5rem' }}
                                                        >
                                                            {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="content" style={{ width: '100%' }}>
                                                        <input
                                                            value={item.title}
                                                            onChange={(e) => handleUpdateArrayItem(s.id, 'items', idx, { title: e.target.value })}
                                                            style={{ fontWeight: 'bold', border: 'none', background: 'transparent', display: 'block' }}
                                                        />
                                                        <textarea
                                                            value={item.text}
                                                            onChange={(e) => handleUpdateArrayItem(s.id, 'items', idx, { text: e.target.value })}
                                                            style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none' }}
                                                        />
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {saving && <div className="saving-indicator">Ukládání...</div>}
            </main>
        </div>
    )
}
