import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { Crown, Music, MapPin, Info as InfoIcon, Tent, Utensils } from 'lucide-react'
import './Info.css'

const INFO_SECTIONS = [
    {
        id: 'dolivka',
        title: 'Dolívka',
        description: 'Historie místa, jeho příběh a proměna ve festival.',
        icon: <Crown size={32} />,
        accent: 'green',
    },
    {
        id: 'festival',
        title: 'Festival',
        description: 'Atmosféra, komunita a co dělá DOlive výjimečným.',
        icon: <Music size={32} />,
        accent: 'pink',
    },
    {
        id: 'doprava',
        title: 'Doprava',
        description: 'Jak se k nám dostanete — vlakem i autem.',
        icon: <MapPin size={32} />,
        accent: 'navy',
    },
    {
        id: 'pobyt',
        title: 'Pobyt na festivalu',
        description: 'Otevírací doba, rodiny, počasí, platby a další praktické info.',
        icon: <InfoIcon size={32} />,
        accent: 'lime',
    },
    {
        id: 'ubytovani',
        title: 'Ubytování',
        description: 'Stan, karavan nebo pod širákem — kde a jak přespat.',
        icon: <Tent size={32} />,
        accent: 'orange',
    },
    {
        id: 'jidlo',
        title: 'Jídlo a pití',
        description: 'Kuchyně, bar, kavárna a ekologie na festivalu.',
        icon: <Utensils size={32} />,
        accent: 'brown',
    },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    },
}

export default function Info() {
    return (
        <div className="info-page">
            <Header />

            <main className="info-main">
                <PageHero
                    title="Informace pro vás"
                    accentColor="navy"
                />

                <section className="info-hub">
                    <div className="container">
                        <motion.div
                            className="info-hub-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {INFO_SECTIONS.map((section) => (
                                <motion.div key={section.id} variants={cardVariants}>
                                    <Link
                                        to={`/info/${section.id}`}
                                        className={`info-hub-card info-hub-card--${section.accent}`}
                                    >
                                        <div className="info-hub-card-bg"></div>
                                        <div className="info-hub-card-content">
                                            <div className="info-hub-card-icon">
                                                {section.icon}
                                            </div>
                                            <h2 className="info-hub-card-title">
                                                {section.id === 'pobyt' ? (
                                                    <>
                                                        <span className="title-desktop">{section.title}</span>
                                                        <span className="title-mobile">Hodí se...</span>
                                                    </>
                                                ) : section.title}
                                            </h2>
                                            <p className="info-hub-card-desc">
                                                {section.id === 'pobyt' ? (
                                                    <>
                                                        <span className="desc-desktop">{section.description}</span>
                                                        <span className="desc-mobile">Otevírací doba, rodiny, platby a další praktické info.</span>
                                                    </>
                                                ) : section.description}
                                            </p>
                                            <div className="info-hub-card-arrow">→</div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
