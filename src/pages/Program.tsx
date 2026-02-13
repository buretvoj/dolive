import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { Link } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { Clock, MapPin, Archive, ArrowRight, Calendar } from 'lucide-react'
import '../components/Performers/Performers.css'
import './Program.css'

interface Performer {
    id: string
    name: string
    genre: string
    photo: string | null
    description: string | null
    active: boolean
    order: number
}

const LINEUP_DATA = {
    day1: {
        date: 'Pátek 7. 8.',
        stages: [
            {
                name: 'Main Stage',
                color: '#ccff00',
                acts: [
                    { time: '18:00', artist: 'DJ Marko', duration: '60 min' },
                    { time: '19:30', artist: 'Retrowave Collective', duration: '90 min' },
                    { time: '21:30', artist: 'NERVO', duration: '90 min' },
                    { time: '23:30', artist: 'Boris Brejcha', duration: '120 min' },
                    { time: '01:30', artist: 'Resident Afterparty', duration: '90 min' },
                ]
            },
            {
                name: 'Forest Stage',
                color: '#ff6b9d',
                acts: [
                    { time: '16:00', artist: 'Early Vibes', duration: '60 min' },
                    { time: '17:00', artist: 'Ambient Drift', duration: '60 min' },
                    { time: '18:30', artist: 'Modular Dreams', duration: '90 min' },
                    { time: '20:30', artist: 'Floating Points', duration: '90 min' },
                    { time: '22:30', artist: 'Nils Frahm', duration: '120 min' },
                ]
            }
        ]
    },
    day2: {
        date: 'Sobota 8. 8.',
        stages: [
            {
                name: 'Main Stage',
                color: '#ccff00',
                acts: [
                    { time: '16:00', artist: 'Local Heroes', duration: '90 min' },
                    { time: '18:00', artist: 'Infected Mushroom', duration: '90 min' },
                    { time: '20:00', artist: 'Amelie Lens', duration: '90 min' },
                    { time: '22:00', artist: 'Charlotte de Witte', duration: '120 min' },
                    { time: '00:30', artist: 'Richie Hawtin', duration: '150 min' },
                ]
            },
            {
                name: 'Forest Stage',
                color: '#ff6b9d',
                acts: [
                    { time: '15:00', artist: 'Sunrise Session', duration: '60 min' },
                    { time: '16:30', artist: 'Kiasmos', duration: '90 min' },
                    { time: '18:30', artist: 'Ólafur Arnalds', duration: '90 min' },
                    { time: '20:30', artist: 'Jon Hopkins', duration: '90 min' },
                    { time: '22:30', artist: 'Four Tet', duration: '120 min' },
                ]
            }
        ]
    }
}

export default function Program() {
    const [performers, setPerformers] = useState<Performer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/performers/active`)
            .then(res => res.json())
            .then(data => {
                setPerformers(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching performers:', err)
                setLoading(false)
            })
    }, [])



    return (
        <div className="program-page">
            <Header />

            <main className="program-main">
                <PageHero
                    title={`Program ${new Date().getFullYear()}`}
                    accentColor="lime"
                />

                {/* Performers Grid */}
                <section className="program-performers">
                    <div className="container">
                        {loading ? (
                            <Spinner />
                        ) : (
                            <div className="performers-grid">
                                {performers.map((performer) => (
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
                        )}

                        {/* Archive CTA */}
                        <div className="archive-cta-wrapper">
                            <Link to="/archiv" className="archive-cta">
                                <span>Minulé roky</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Lineup Section */}
                <section className="lineup-section">
                    <div className="container">


                        {/* Stages Grid (Now Days Grid) */}
                        <div className="stages-grid">
                            {[LINEUP_DATA.day1, LINEUP_DATA.day2].map((day, dayIdx) => {
                                // Consolidate acts from all stages and sort by time, then take only first 6
                                const allActs = day.stages
                                    .flatMap(stage => stage.acts.map(act => ({ ...act, stageColor: stage.color })))
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .slice(0, 6);

                                return (
                                    <div key={dayIdx} className="stage-column">
                                        <div className="stage-header" style={{ borderColor: dayIdx === 0 ? '#ccff00' : '#ff6b9d' }}>
                                            <Calendar size={32} style={{ color: dayIdx === 0 ? '#ccff00' : '#ff6b9d' }} />
                                            <h3 className="stage-name">{day.date.split(' ')[0]}</h3>
                                        </div>
                                        <div className="stage-acts">
                                            {allActs.map((act, actIdx) => (
                                                <div
                                                    key={actIdx}
                                                    className="act-card"
                                                    style={{
                                                        animationDelay: `${actIdx * 0.1}s`,
                                                        '--stage-color': act.stageColor
                                                    } as React.CSSProperties}
                                                >
                                                    <div className="act-time">
                                                        <Clock size={14} />
                                                        <span>{act.time}</span>
                                                        <span className="act-duration">/ {act.duration}</span>
                                                    </div>
                                                    <h4 className="act-artist">{act.artist}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}

