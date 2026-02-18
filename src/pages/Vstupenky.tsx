import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Spinner from '../components/Spinner/Spinner'
import {
    Ticket as TicketIcon, Heart, Beer, ShoppingCart, Calendar,
    ShoppingBag, Frown, Plus, Minus, Trash2, ArrowLeft, CheckCircle2
} from 'lucide-react'
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

interface CartItem {
    ticket: Ticket
    quantity: number
}

interface FormData {
    email: string
    phone: string
    name: string
    surname: string
    address: string
    consent: boolean
}

export default function Vstupenky() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState<'list' | 'checkout'>('list')
    const [cart, setCart] = useState<CartItem[]>([])
    const [formData, setFormData] = useState<FormData>({
        email: '',
        phone: '',
        name: '',
        surname: '',
        address: '',
        consent: false
    })

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/tickets/active`)
            .then(res => res.json())
            .then(data => {
                setTickets(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching tickets:', err)
                setLoading(false)
            })
    }, [])

    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/\D/g, '')) || 0
    }

    const addToCart = (ticket: Ticket) => {
        setCart(prev => {
            const existing = prev.find(item => item.ticket.id === ticket.id)
            if (existing) {
                return prev.map(item =>
                    item.ticket.id === ticket.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { ticket, quantity: 1 }]
        })
        setView('checkout')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.ticket.id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.ticket.id !== id))
    }

    const totalPrice = useMemo(() => {
        return cart.reduce((sum, item) => sum + (parsePrice(item.ticket.price) * item.quantity), 0)
    }, [cart])

    const isFormValid = formData.email && formData.phone && formData.name && formData.surname && formData.address && formData.consent

    if (loading) {
        return (
            <div className="vstupenky-page">
                <Header />
                <main className="vstupenky-main">
                    <div style={{ padding: '8rem 0' }}><Spinner /></div>
                </main>
                <Footer />
            </div>
        )
    }

    if (view === 'checkout') {
        const availableToAdd = tickets.filter(t =>
            (t.type === 'active' || t.type === 'support') &&
            !cart.find(ci => ci.ticket.id === t.id)
        )

        return (
            <div className="vstupenky-page">
                <Header />
                <main className="vstupenky-main">
                    <PageHero title="Objednávka" accentColor="pink">
                    </PageHero>

                    <div className="checkout-container">
                        <div className="checkout-grid">
                            <div className="checkout-left">
                                <section className="cart-items">
                                    <h2>Tvoje vstupenky</h2>
                                    {cart.length === 0 ? (
                                        <div className="empty-cart">
                                            <p>V košíku zatím nic nemáš.</p>
                                            <button onClick={() => setView('list')} className="btn-secondary">Vybrat vstupenky</button>
                                        </div>
                                    ) : (
                                        <div className="item-list">
                                            {cart.map(item => (
                                                <div key={item.ticket.id} className={`cart-item ${(item.ticket.type || '').toLowerCase()}`}>
                                                    <div className="item-info">
                                                        <h3 className="cart-item-title">{item.ticket.title}</h3>
                                                        <div className="item-details-row">
                                                            <div className={`item-type-tag ${item.ticket.type}`}>
                                                                {item.ticket.type === 'support' ? <Heart size={12} fill="currentColor" /> : <TicketIcon size={12} />}
                                                                {item.ticket.type === 'support' ? 'Srdcovka' : 'Vstupenka'}
                                                            </div>
                                                            <p className="item-price-unit">{item.ticket.price} / ks</p>
                                                        </div>
                                                    </div>
                                                    <div className="item-controls">
                                                        <div className="qty-picker">
                                                            <button onClick={() => updateQuantity(item.ticket.id, -1)} aria-label="Decrease quantity"><Minus size={18} /></button>
                                                            <span>{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.ticket.id, 1)} aria-label="Increase quantity"><Plus size={18} /></button>
                                                        </div>
                                                        <div className="item-total-price">
                                                            {(parsePrice(item.ticket.price) * item.quantity).toLocaleString()} Kč
                                                        </div>
                                                        <button onClick={() => removeFromCart(item.ticket.id)} className="remove-btn" aria-label="Remove item">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {availableToAdd.length > 0 && (
                                        <div className="add-more-section">
                                            <div className="add-more-grid">
                                                {availableToAdd.map(t => (
                                                    <div key={t.id} className="add-more-card" onClick={() => addToCart(t)}>
                                                        <div className="add-more-info">
                                                            <span>{t.title}</span>
                                                            <small>{t.price}</small>
                                                        </div>
                                                        <Plus size={20} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </div>

                            <div className="checkout-right">
                                <h2>Osobní údaje</h2>
                                <section className="checkout-form">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="name">Jméno</label>
                                            <input
                                                type="text" id="name" required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Jan"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="surname">Příjmení</label>
                                            <input
                                                type="text" id="surname" required
                                                value={formData.surname}
                                                onChange={e => setFormData({ ...formData, surname: e.target.value })}
                                                placeholder="Novák"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label htmlFor="email">E-mail</label>
                                            <input
                                                type="email" id="email" required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="jan.novak@priklad.cz"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label htmlFor="phone">Telefon</label>
                                            <input
                                                type="tel" id="phone" required
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+420 123 456 789"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label htmlFor="address">Adresa (ulice, město, PSČ)</label>
                                            <textarea
                                                id="address" required
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Dlouhá 123, Praha, 110 00"
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    <div className="consent-group">
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={formData.consent}
                                                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="label-text">Souhlasím se zpracováním osobních údajů</span>
                                        </label>
                                    </div>

                                    <div className="total-summary">
                                        <div className="total-row">
                                            <span>Celkem k úhradě</span>
                                            <span className="total-amount">{totalPrice.toLocaleString()} Kč</span>
                                        </div>
                                        <p className="vat-info">Cena je konečná včetně DPH.</p>

                                        <div className="checkout-btns">
                                            <button
                                                className="btn-pay"
                                                disabled={!isFormValid || cart.length === 0}
                                                title={!isFormValid ? "Vyplňte prosím všechny údaje" : ""}
                                            >
                                                Zaplatit
                                            </button>
                                            <button
                                                className="btn-back"
                                                onClick={() => setView('list')}
                                            >
                                                Zpátky
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="vstupenky-page">
            <Header />

            <main className="vstupenky-main">
                <PageHero
                    title="Vstupenky"
                    accentColor="pink"
                >
                    <Link to="/merch" className="hero-cta-organic">
                        <ShoppingBag size={24} />
                        <span>Kup si merch!</span>
                    </Link>
                </PageHero>

                <div className="vstupenky-container">
                    <div className="tickets-grid">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className={`ticket-card ${ticket.type}`}>
                                <div className="card-top">
                                    <h3>{ticket.title}</h3>
                                    {ticket.type === 'past' && (
                                        <div className="wave-badge past-badge">VYPRODÁNO</div>
                                    )}
                                    {ticket.type === 'active' && (
                                        <div className="wave-badge">PRÁVĚ V PRODEJI</div>
                                    )}
                                    {ticket.type === 'support' && (
                                        <div className="wave-badge support-badge">
                                            <Heart size={14} fill="#ff0000" color="#ff0000" style={{ marginRight: '4px' }} />
                                            SRDCOVKA
                                        </div>
                                    )}
                                </div>
                                <div className="ticket-price">{ticket.price}</div>
                                <div className="ticket-details">
                                    {ticket.type === 'onsite' ? (
                                        <p>{ticket.description}</p>
                                    ) : ticket.type === 'support' ? (
                                        <>
                                            <p className="support-mini-desc">{ticket.description}</p>
                                            <ul className="support-perks-list">
                                                {(ticket.features || '').split('\n').filter(p => p.trim()).map((perk, i) => (
                                                    <li key={i}>
                                                        {perk.toLowerCase().includes('vstup') ? <TicketIcon size={16} /> : <Beer size={16} />}
                                                        {perk.replace('•', '').trim()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <div className="detail-row">
                                                <Calendar size={16} />
                                                <span>{ticket.description}</span>
                                            </div>
                                            <div className="detail-limit">{ticket.features}</div>
                                        </>
                                    )}
                                </div>

                                {ticket.type === 'past' ? (
                                    <button className="buy-btn past-btn" disabled>
                                        <Frown size={20} />
                                        <span>Vyprodáno</span>
                                    </button>
                                ) : ticket.type === 'upcoming' ? (
                                    <button className="buy-btn disabled" disabled>
                                        <span>Brzy v prodeji</span>
                                    </button>
                                ) : ticket.type === 'support' ? (
                                    <button className="buy-btn support-btn" onClick={() => addToCart(ticket)}>
                                        <ShoppingCart size={20} />
                                        <span>Podpořit</span>
                                    </button>
                                ) : ticket.type === 'onsite' ? (
                                    <div className="onsite-badge">
                                        <TicketIcon size={20} /> <span>Jen na místě</span>
                                    </div>
                                ) : (
                                    <button className="buy-btn" onClick={() => addToCart(ticket)}>
                                        <ShoppingCart size={20} />
                                        <span>Koupit</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
