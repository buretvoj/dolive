import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, Variants } from 'framer-motion'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { ArrowLeft, Facebook, Instagram, Globe, Music2, Youtube } from 'lucide-react'
import Spinner from '../components/Spinner/Spinner'
import './Info.css'
import './PerformerDetail.css'

interface Performer {
    id: string
    slug: string
    name: string
    genre: string
    photo: string | null
    description: string | null
    links: { facebook?: string, instagram?: string, soundcloud?: string, website?: string, youtube?: string } | null
    year: number
    videoUrl?: string | null
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
}

export default function PerformerDetail() {
    const { slug } = useParams<{ slug: string }>()
    const [performer, setPerformer] = useState<Performer | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetch(`${import.meta.env.VITE_API_URL}/api/performers/${slug}`)
                .then(res => {
                    if (!res.ok) throw new Error('Not found')
                    return res.json()
                })
                .then(data => {
                    setPerformer(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }, [slug])

    if (loading) return <div className="info-page"><Spinner /></div>

    if (!performer) {
        return (
            <div className="info-page">
                <Header />
                <main className="info-main">
                    <div className="container" style={{ padding: '10rem 2rem' }}>
                        <h1>Performer not found</h1>
                        <Link to="/" className="info-back-link"><ArrowLeft size={18} /> Back to Home</Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const socialLinks = performer.links || {}

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const videoId = performer.videoUrl ? getYoutubeId(performer.videoUrl) : null

    return (
        <div className="info-page">
            <Header />
            <main className="info-main">
                <PageHero
                    title={performer.name}
                    accentColor="pink"
                />

                <section className="info-detail">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="info-detail-inner"
                        >
                            <div className="info-detail-body">
                                {performer.photo && (
                                    <div className="performer-detail-image">
                                        <img
                                            src={performer.photo}
                                            alt={performer.name}
                                        />
                                        <div className="detail-genre-tags">
                                            {performer.genre.split(',').map((g, idx) => (
                                                <span key={idx} className="detail-genre-tag">
                                                    {g.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Social Links Overlay */}
                                        <div className="detail-social-overlay">
                                            {socialLinks.facebook && (
                                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#3b5998' }}>
                                                    <Facebook size={20} />
                                                </a>
                                            )}
                                            {socialLinks.instagram && (
                                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
                                                    <Instagram size={20} />
                                                </a>
                                            )}
                                            {socialLinks.soundcloud && (
                                                <a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#ff5500' }}>
                                                    <Music2 size={20} />
                                                </a>
                                            )}
                                            {socialLinks.youtube && (
                                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#ff0000' }}>
                                                    <Youtube size={20} />
                                                </a>
                                            )}
                                            {socialLinks.website && (
                                                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#333' }}>
                                                    <Globe size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="info-text-block">
                                    {performer.description && (
                                        <div className="lead" style={{ whiteSpace: 'pre-wrap' }}>
                                            {performer.description}
                                        </div>
                                    )}



                                    {/* Video Section */}
                                    {videoId && (
                                        <div className="performer-video-section" style={{ marginTop: '2.5rem' }}>
                                            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    title="YouTube video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link to={performer.year < 2026 ? "/archiv" : "/program"} className="organic-back-button">
                                <ArrowLeft size={32} /> <span>{performer.year < 2026 ? "Zpátky na archiv" : "Zpátky na program"}</span>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
