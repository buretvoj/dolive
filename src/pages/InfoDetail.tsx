import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import Spinner from '../components/Spinner/Spinner'
import {
    ArrowLeft, Sparkles, Users, Train, Car, Baby, Cat,
    CloudRain, Wifi, CreditCard, Trash2, Tent, Shield,
    Utensils, Beer, Coffee, Leaf
} from 'lucide-react'
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
}

interface PageData {
    id: string
    title: string
    description: string // used for accent
    sections: Section[]
}

export default function InfoDetail() {
    const { section } = useParams<{ section: string }>()
    const [pageData, setPageData] = useState<PageData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (section) {
            setLoading(true)
            fetch(`${import.meta.env.VITE_API_URL}/api/pages/info-${section}`)
                .then(res => res.json())
                .then(data => {
                    setPageData(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }, [section])

    if (loading) return <div className="info-page"><Spinner /></div>

    if (!pageData || (pageData as any).error) {
        return (
            <div className="info-page">
                <Header />
                <main className="info-main">
                    <div className="container" style={{ padding: '10rem 2rem' }}>
                        <h1>Stránka nenalezena</h1>
                        <Link to="/info" className="info-back-link"><ArrowLeft size={18} /> Zpátky na info</Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const renderSection = (s: Section) => {
        switch (s.type) {
            case 'text-block':
                return (
                    <div className="info-detail-body" key={s.id}>
                        <div className="info-text-block">
                            <p className="lead" style={{ whiteSpace: 'pre-wrap' }}>{s.content.lead}</p>
                        </div>
                    </div>
                );
            case 'cards-2col':
                return (
                    <div className="info-grid-2col" key={s.id}>
                        {s.content.cards.map((card: any, idx: number) => {
                            const Icon = ICON_MAP[card.icon];
                            return (
                                <div key={idx} className={`info-card organic-card organic-card-${card.accent}`}>
                                    <div className="card-header-with-icon">
                                        {Icon && <Icon className="card-icon" />}
                                        <h3>{card.title}</h3>
                                    </div>
                                    <p>{card.text}</p>
                                </div>
                            )
                        })}
                    </div>
                );
            case 'highlight-box':
                return <p key={s.id} className="highlight-box">{s.content.text}</p>;
            case 'icon-list':
                return (
                    <ul key={s.id} className="icon-list animated-list">
                        {s.content.items.map((item: any, idx: number) => {
                            const Icon = ICON_MAP[item.icon];
                            return (
                                <li key={idx}>
                                    <div className="icon-wrapper">{Icon && <Icon />}</div>
                                    <div className="content">
                                        <strong>{item.title}</strong> {item.text}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                );
            case 'cards-3col':
                return (
                    <div className="info-grid-3col" key={s.id}>
                        {s.content.cards.map((card: any, idx: number) => {
                            const Icon = ICON_MAP[card.icon];
                            return (
                                <div key={idx} className={`info-card organic-card organic-card-${card.accent}`}>
                                    <div className="card-header-with-icon">
                                        {Icon && <Icon className="card-icon" />}
                                        <h3>{card.title}</h3>
                                    </div>
                                    <p>{card.text}</p>
                                </div>
                            )
                        })}
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="info-page">
            <Header />
            <main className="info-main">
                <PageHero
                    title={pageData.title}
                    accentColor={pageData.description as any}
                />
                <section className="info-detail">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="info-detail-inner"
                        >
                            <div className="info-detail-body">
                                {pageData.sections.map(renderSection)}
                            </div>
                            <Link to="/info" className="organic-back-button">
                                <ArrowLeft size={32} /> <span>Zpátky na info</span>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
