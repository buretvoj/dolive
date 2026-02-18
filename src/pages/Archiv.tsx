import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { Link } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import '../components/Performers/Performers.css'
import './Program.css'

interface Performer {
    id: string
    slug: string
    name: string
    genre: string
    photo: string | null
    description: string | null
    year: number
    active: boolean
    order: number
}

export default function Archiv() {
    const [performers, setPerformers] = useState<Performer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/performers/archive`)
            .then(res => res.json())
            .then(data => {
                setPerformers(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching archive performers:', err)
                setLoading(false)
            })
    }, [])

    // Group performers by year
    const groupedPerformers = performers.reduce((acc: { [key: number]: Performer[] }, performer) => {
        if (!acc[performer.year]) {
            acc[performer.year] = []
        }
        acc[performer.year].push(performer)
        return acc
    }, {})

    // Sort years descending
    const years = Object.keys(groupedPerformers).map(Number).sort((a, b) => b - a)

    return (
        <div className="program-page">
            <Header />

            <main className="program-main">
                <PageHero
                    title="Archiv vystupujících"
                    accentColor="navy"
                />

                <section className="program-performers">
                    <div className="container" style={{ marginBottom: '6rem' }}>
                        {loading ? (
                            <Spinner />
                        ) : performers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
                                <p>Archiv je zatím prázdný.</p>
                                <Link to="/program" style={{ color: 'var(--fg)', fontWeight: 700, textDecoration: 'underline' }}>Přejít na aktuální program</Link>
                            </div>
                        ) : (
                            years.map(year => (
                                <div key={year} className="archive-year-group" style={{ marginBottom: '4rem' }}>
                                    <h2 className="archive-year-heading">{year}</h2>

                                    <div className="performers-grid">
                                        {groupedPerformers[year].map((performer) => (
                                            <Link to={`/performers/${performer.slug}`} key={performer.id} className="performer-card">
                                                {performer.photo && (
                                                    <div className="performer-image">
                                                        <img src={performer.photo} alt={performer.name} />
                                                        <div className="performer-overlay"></div>
                                                    </div>
                                                )}
                                                <div className="performer-content">
                                                    <h3 className="performer-name">{performer.name}</h3>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
