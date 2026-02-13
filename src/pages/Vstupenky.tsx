import { Link } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { Ticket, Heart, Beer, ShoppingCart, Calendar, ShoppingBag } from 'lucide-react'
import './Vstupenky.css'

export default function Vstupenky() {
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

                    {/* Standard Tickets Grid */}
                    <div className="tickets-grid">

                        {/* Wave 1 */}
                        <div className="ticket-card active">
                            <div className="card-top">
                                <h3>První vlna</h3>
                                <div className="wave-badge">Právě v prodeji</div>
                            </div>
                            <div className="ticket-price">350 Kč</div>
                            <div className="ticket-details">
                                <div className="detail-row">
                                    <Calendar size={16} />
                                    <span>do vyprodání</span>
                                </div>
                                <div className="detail-limit">nejpozději do 30. 6. 2025</div>
                            </div>
                            <button className="buy-btn">
                                <ShoppingCart size={20} /> <span>Koupit</span>
                            </button>
                        </div>

                        {/* Wave 2 */}
                        <div className="ticket-card upcoming">
                            <div className="card-top">
                                <h3>Druhá vlna</h3>
                            </div>
                            <div className="ticket-price">450 Kč</div>
                            <div className="ticket-details">
                                <div className="detail-row">
                                    <Calendar size={16} />
                                    <span>do vyprodání</span>
                                </div>
                                <div className="detail-limit">nejpozději do 20. 8. 2026</div>
                            </div>
                            <button className="buy-btn disabled" disabled>
                                <span>Brzy v prodeji</span>
                            </button>
                        </div>

                        {/* On Site */}
                        <div className="ticket-card onsite">
                            <div className="card-top">
                                <h3>Na místě</h3>
                            </div>
                            <div className="ticket-price">600 Kč</div>
                            <div className="ticket-details">
                                <p>Cena na místě v den konání festivalu.</p>
                            </div>
                            <div className="onsite-badge">
                                <Ticket size={20} /> <span>Jen na místě</span>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="ticket-card support">
                            <div className="card-top">
                                <h3>Přátelé festivalu</h3>
                                <div className="wave-badge support-badge">
                                    <Heart size={14} fill="currentColor" /> Srdcovka
                                </div>
                            </div>
                            <div className="ticket-price">1 500 Kč</div>
                            <div className="ticket-details">
                                <p className="support-mini-desc">
                                    Podpořte nás a získejte:
                                </p>
                                <ul className="support-perks-list">
                                    <li><Ticket size={16} /> Vstup na festival</li>
                                    <li><Beer size={16} /> Půllitr DOlive</li>
                                </ul>
                            </div>
                            <button className="buy-btn support-btn">
                                <ShoppingCart size={20} /> <span>Podpořit</span>
                            </button>
                        </div>

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    )
}
