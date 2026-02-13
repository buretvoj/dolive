import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../Spinner/Spinner'
import './Performers.css'

interface Performer {
    id: string
    name: string
    genre: string
    photo: string | null
    description: string | null
    active: boolean
    order: number
}

export default function Performers() {
    const [performers, setPerformers] = useState<Performer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/performers/active`)
            .then(res => res.json())
            .then(data => {
                setPerformers(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Failed to fetch performers:', error)
                setLoading(false)
            })
    }, [])

    if (loading) return <Spinner />

    if (performers.length === 0) return null

    return (
        <section className="performers-section">
            <div className="container">
                <h2 className="performers-heading">Program 2026</h2>
                <div className="performers-grid">
                    {performers.slice(0, 3).map(performer => (
                        <div key={performer.id} className="performer-card">
                            {performer.photo && (
                                <div className="performer-image">
                                    <img src={performer.photo} alt={performer.name} />
                                    <div className="performer-overlay"></div>
                                </div>
                            )}
                            <div className="performer-content">
                                <h3 className="performer-name">{performer.name}</h3>

                            </div>
                        </div>
                    ))}
                </div>
                <div className="performers-actions">
                    <Link to="/program" className="btn btn-primary">Kompletní program</Link>
                </div>
            </div>
        </section>
    )
}

