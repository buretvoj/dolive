import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import './Hero.css'

interface HeroProps {
    subtitle?: string
    title?: string
    description?: string
    ctaPrimary?: string
    ctaSecondary?: string
    backgroundImage?: string
}

export default function Hero({
    subtitle = 'Prague, Czech Republic',
    title = 'Experience the Art of Culture',
    description = 'A celebration of music, art, and unity. Join us for the most unforgettable summer festival of 2026.',
    ctaPrimary = 'Koupit lístky',
    ctaSecondary = 'Více o festivalu',
    backgroundImage
}: HeroProps) {
    return (
        <section className={`hero ${backgroundImage ? 'has-bg-image' : ''}`}>
            <div className="container hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >

                    <h1 className="hero-title title-date" dangerouslySetInnerHTML={{ __html: title.replace('Culture', '<span class="accent">Culture</span>') }} />
                    {description && (
                        <div className="hero-description-wrapper">
                            <MapPin className="hero-location-icon" />
                            <p className="hero-description">
                                <span className="desc-desktop">{description}</span>
                                <span className="desc-mobile">Dolívka</span>
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {backgroundImage ? (
                <div className="hero-visual-image">
                    <div className="visual-overlay"></div>
                    <img src={backgroundImage} alt="Hero Background" />
                </div>
            ) : (
                <div className="hero-visual">
                    <div className="visual-overlay"></div>
                    <div className="visual-placeholder"></div>
                </div>
            )}
            <div className="hero-wave">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path d="M0,0 L1440,0 L1440,20 C1100,60 800,20 480,50 C240,70 100,20 0,40 Z"></path>
                </svg>
            </div>
        </section>
    )
}