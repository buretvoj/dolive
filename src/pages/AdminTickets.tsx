import React, { useState, useEffect, DragEvent } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { Ticket as TicketIcon, Heart, ShoppingCart, Trash2, GripHorizontal, Plus } from 'lucide-react'
import './Admin.css'
import './Vstupenky.css'

interface Ticket {
    id: string
    title: string
    price: string
    badge: string | null
    description: string | null
    features: string | null
    buttonText: string | null
    type: string // active, upcoming, support, onsite
    order: number
    active: boolean
}

export default function AdminTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [pages, setPages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    const FIXED_SLUGS = ['index', 'tickets', 'info']
    const getToken = () => localStorage.getItem('token')

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`)
            const data = await res.json()
            setTickets(data)
        } catch (error) {
            console.error('Failed to fetch tickets:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPages = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pages`)
            const data = await res.json()
            const filtered = data.filter((p: any) => FIXED_SLUGS.includes(p.slug))
                .sort((a: any, b: any) => FIXED_SLUGS.indexOf(a.slug) - FIXED_SLUGS.indexOf(b.slug))
            setPages(filtered)
        } catch (error) {
            console.error('Failed to fetch pages:', error)
        }
    }

    useEffect(() => {
        const token = getToken()
        if (!token) {
            window.location.href = '/login'
            return
        }
        fetchTickets()
        fetchPages()
    }, [])

    const handleUpdateTicket = async (id: string, updates: Partial<Ticket>) => {
        setSaving(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(updates)
            })
            if (res.ok) {
                setTickets(tickets.map(t => t.id === id ? { ...t, ...updates } : t))
            }
        } catch (error) {
            console.error('Failed to update ticket:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleAddTicket = async () => {
        setSaving(true)
        try {
            const newTicket = {
                title: 'Nová vlna',
                price: '0 Kč',
                badge: null,
                description: 'Popis',
                features: 'Vlastnosti',
                buttonText: 'Koupit',
                type: 'active',
                order: tickets.length,
                active: true
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(newTicket)
            })
            if (res.ok) {
                const data = await res.json()
                setTickets([...tickets, data])
            }
        } catch (error) {
            console.error('Failed to create ticket:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteTicket = async (id: string) => {
        if (!confirm('Opravdu chcete tuto vstupenku smazat?')) return
        setSaving(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
            if (res.ok) {
                setTickets(tickets.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete ticket:', error)
        } finally {
            setSaving(false)
        }
    }

    // Drag & Drop reordering
    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = async (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === dropIndex) return

        const reordered = [...tickets]
        const [movedItem] = reordered.splice(draggedIndex, 1)
        reordered.splice(dropIndex, 0, movedItem)

        const updated = reordered.map((t, idx) => ({ ...t, order: idx }))
        setTickets(updated)
        setDraggedIndex(null)

        // Sync with server
        try {
            await Promise.all(updated.map(t =>
                fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${t.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ order: t.order })
                })
            ))
        } catch (error) {
            console.error('Failed to sync order:', error)
            fetchTickets()
        }
    }

    if (loading) return <div className="admin-container"><Spinner /></div>

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>DOLIVE CMS</h1>
                <nav className="admin-nav">
                    {pages.map(p => (
                        <button
                            key={p.id}
                            className={`nav-item ${p.slug === 'tickets' ? 'active' : ''}`}
                            onClick={() => window.location.href = p.slug === 'index' ? '/admin' : (p.slug === 'tickets' ? '/admin/tickets' : `/admin?page=${p.slug}`)}
                        >
                            {p.slug === 'index' ? 'Domů' : (p.slug === 'info' ? 'Info' : (p.slug === 'tickets' ? 'Vstupenky' : p.title))}
                        </button>
                    ))}
                    <button
                        className="nav-item"
                        onClick={() => window.location.href = '/admin/performers'}
                    >
                        Performers
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => {
                            localStorage.removeItem('token')
                            window.location.href = '/login'
                        }}
                        style={{ color: 'red' }}
                    >
                        Logout
                    </button>
                </nav>
                <a href="/" className="back-link">← Back to Site</a>
            </header>

            <main className="admin-editor admin-editor-full">
                <div className="editor-header">
                    <h2>Správa vstupenek</h2>
                    <button onClick={handleAddTicket} className="btn-small">
                        <Plus size={16} /> Přidat vstupenku
                    </button>
                </div>

                <div className="vstupenky-page" style={{ padding: 0, minHeight: 'auto' }}>
                    <div className="tickets-grid" style={{ marginTop: '2rem' }}>
                        {tickets.map((ticket, index) => (
                            <div
                                key={ticket.id}
                                className={`ticket-card ${ticket.type} ${draggedIndex === index ? 'dragging' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                style={{ position: 'relative', cursor: 'default' }}
                            >
                                <div className="cms-card-tools" style={{ position: 'absolute', top: '-15px', right: '10px', display: 'flex', gap: '5px', zIndex: 10 }}>
                                    <div className="drag-handle" style={{ background: '#fff', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', cursor: 'grab' }}>
                                        <GripHorizontal size={16} />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTicket(ticket.id)}
                                        style={{ background: '#fff', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', cursor: 'pointer', color: 'red' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="card-top">
                                    <input
                                        className="cms-input-heading"
                                        value={ticket.title}
                                        onChange={(e) => handleUpdateTicket(ticket.id, { title: e.target.value })}
                                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', width: '100%' }}
                                    />
                                    <div className="cms-badge-preview" style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, color: ticket.type === 'support' ? '#ff006e' : (ticket.type === 'past' ? '#999' : 'var(--accent)') }}>
                                        {ticket.type === 'past' && 'VYPRODÁNO'}
                                        {ticket.type === 'active' && 'PRÁVĚ V PRODEJI'}
                                        {ticket.type === 'support' && 'SRDCOVKA'}
                                        {!['past', 'active', 'support'].includes(ticket.type) && <span style={{ opacity: 0.4 }}>(žádný štítek)</span>}
                                    </div>
                                </div>

                                <div className="ticket-price" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                                    <input
                                        value={ticket.price.includes(' Kč') ? ticket.price.replace(' Kč', '') : ticket.price}
                                        onChange={(e) => handleUpdateTicket(ticket.id, { price: e.target.value + (e.target.value.toLowerCase().includes('zdarma') ? '' : ' Kč') })}
                                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', width: '60%', textAlign: 'right', paddingRight: '0' }}
                                    />
                                    <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Kč</span>
                                </div>

                                <div className="ticket-details">
                                    <textarea
                                        className="cms-textarea-desc"
                                        value={ticket.description || ''}
                                        onChange={(e) => handleUpdateTicket(ticket.id, { description: e.target.value })}
                                        placeholder="Description..."
                                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: '0.9rem', width: '100%', resize: 'none' }}
                                    />
                                    <textarea
                                        className="cms-textarea-features"
                                        value={ticket.features || ''}
                                        onChange={(e) => handleUpdateTicket(ticket.id, { features: e.target.value })}
                                        placeholder="Features (one per line)..."
                                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: '0.8rem', width: '100%', minHeight: '60px', resize: 'none' }}
                                    />
                                </div>

                                <div className="cms-type-sel" style={{ marginTop: 'auto', padding: '10px 0' }}>
                                    <select
                                        value={ticket.type}
                                        onChange={(e) => handleUpdateTicket(ticket.id, { type: e.target.value })}
                                        style={{ width: '100%', padding: '4px', fontSize: '0.7rem', textTransform: 'uppercase' }}
                                    >
                                        <option value="active">Active (Wave)</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="support">Support</option>
                                        <option value="onsite">On Site</option>
                                        <option value="past">Past (Sold Out)</option>
                                    </select>
                                </div>

                                <div className="cms-button-preview" style={{
                                    marginTop: 'auto',
                                    padding: '12px',
                                    background: ticket.type === 'past' ? '#eee' : (ticket.type === 'support' ? 'var(--accent-pop)' : (ticket.type === 'upcoming' ? '#ccc' : '#333')),
                                    color: ticket.type === 'support' || ticket.type === 'past' ? '#000' : '#fff',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px',
                                    opacity: ticket.type === 'past' || ticket.type === 'upcoming' ? 0.6 : 1
                                }}>
                                    {ticket.type === 'past' && <span>Vyprodáno ☹</span>}
                                    {ticket.type === 'upcoming' && <span>Brzy v prodeji</span>}
                                    {ticket.type === 'support' && <span>Podpořit</span>}
                                    {ticket.type === 'onsite' && <span>Jen na místě</span>}
                                    {ticket.type === 'active' && <span>Koupit</span>}
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <label style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input
                                            type="checkbox"
                                            checked={ticket.active}
                                            onChange={(e) => handleUpdateTicket(ticket.id, { active: e.target.checked })}
                                        /> Active
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {
                    saving && (
                        <div className="saving-indicator">Ukládání...</div>
                    )
                }
            </main >
        </div >
    )
}
