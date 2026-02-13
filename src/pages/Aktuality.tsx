import { Link } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { Calendar, ArrowRight } from 'lucide-react'
import './Aktuality.css'

interface NewsItem {
    id: number
    title: string
    date: string
    excerpt: string
    image: string
}

const DUMMY_NEWS: NewsItem[] = [
    {
        id: 1,
        title: 'Oznámení prvních headlinerů festivalu 2026',
        date: '2026-01-15',
        excerpt: 'S radostí oznamujeme první velká jména letošního ročníku! Připravte se na nezapomenutelné vystoupení světových hvězd elektronické scény...',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'
    },
    {
        id: 2,
        title: 'Spuštěn předprodej vstupenek',
        date: '2026-01-10',
        excerpt: 'Od dnešního dne je možné zakoupit vstupenky v předprodeji za zvýhodněné ceny. Nenechte si ujít early bird nabídku...',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    },
    {
        id: 3,
        title: 'Nová stage věnovaná české alternativě',
        date: '2026-01-05',
        excerpt: 'Letos přidáváme třetí stage, která bude věnována výhradně českým alternativním kapelám. Podpořte domácí scénu...',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'
    },
    {
        id: 4,
        title: 'Ekologická iniciativa: Zero Waste Festival',
        date: '2025-12-20',
        excerpt: 'Dolive Festival se zavazuje k udržitelnosti. Představujeme naši novou iniciativu zaměřenou na minimalizaci odpadu...',
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop'
    },
    {
        id: 5,
        title: 'Rozšíření kempovacích kapacit',
        date: '2025-12-15',
        excerpt: 'Díky velkému zájmu rozšiřujeme kempovací plochy. Nově nabízíme také glamping možnosti pro ty, kteří preferují větší komfort...',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop'
    },
    {
        id: 6,
        title: 'Workshop program pro rok 2026',
        date: '2025-12-10',
        excerpt: 'Připravili jsme bohatý program workshopů zahrnující DJing, produkci hudby, jógu, umělecké instalace a mnoho dalšího...',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop'
    },
    {
        id: 7,
        title: 'Partnerství s lokálními producenty',
        date: '2025-12-05',
        excerpt: 'Spolupracujeme s místními farmáři a řemeslníky, abychom vám přinesli tu nejlepší lokální gastronomii a craft pivo...',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'
    },
    {
        id: 8,
        title: 'Dětská zóna s novým programem',
        date: '2025-11-28',
        excerpt: 'Pro rodiny s dětmi jsme připravili speciální zónu s animačním programem, tvořivými dílnami a bezpečným prostorem...',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
    },
    {
        id: 9,
        title: 'Umělecké instalace od českých umělců',
        date: '2025-11-20',
        excerpt: 'Festival obohatí unikátní umělecké instalace od renomovaných českých umělců. Připravte se na vizuální zážitek...',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop'
    },
    {
        id: 10,
        title: 'Dopravní informace a shuttle služba',
        date: '2025-11-15',
        excerpt: 'Zveřejňujeme kompletní dopravní informace včetně shuttle busů z Pardubic a Hradce Králové. Plánujte svou cestu...',
        image: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&h=600&fit=crop'
    },
    {
        id: 11,
        title: 'Afterparty v centru Lytomyšle',
        date: '2025-11-10',
        excerpt: 'Po skončení hlavního programu pokračuje zábava v historickém centru Lytomyšle. Připravte se na noční maratón...',
        image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop'
    },
    {
        id: 12,
        title: 'Bezpečnostní opatření a zdravotní služba',
        date: '2025-11-05',
        excerpt: 'Vaše bezpečnost je naší prioritou. Informace o zdravotní službě, bezpečnostních opatřeních a kontaktech...',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'
    },
    {
        id: 13,
        title: 'Fotosoutěž #DoliveFest2026',
        date: '2025-10-30',
        excerpt: 'Spouštíme fotosoutěž na sociálních sítích! Sdílejte své nejlepší festivalové momenty a vyhrajte permanentku na příští rok...',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
    },
    {
        id: 14,
        title: 'Dobrovolnický program',
        date: '2025-10-25',
        excerpt: 'Staňte se součástí týmu! Hledáme dobrovolníky, kteří nám pomohou vytvořit nezapomenutelný festival...',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'
    },
    {
        id: 15,
        title: 'Ohlédnutí za ročníkem 2025',
        date: '2025-10-20',
        excerpt: 'Podívejte se na nejlepší momenty z loňského ročníku. Video aftermovie a fotogalerie jsou nyní k dispozici...',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'
    }
]

export default function Aktuality() {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    return (
        <div className="aktuality-page">
            <Header />

            <main className="aktuality-main">
                <PageHero
                    title="Aktuality"
                    accentColor="pink"
                />

                {/* News Grid */}
                <section className="aktuality-content">
                    <div className="container">
                        <div className="aktuality-grid">
                            {DUMMY_NEWS.map((item) => (
                                <article key={item.id} className="news-item">
                                    <div className="news-item-image">
                                        <img src={item.image} alt={item.title} />
                                        <div className="news-item-overlay"></div>
                                    </div>
                                    <div className="news-item-content">
                                        <div className="news-item-date">
                                            <Calendar size={14} />
                                            <span>{formatDate(item.date)}</span>
                                        </div>
                                        <h2 className="news-item-title">{item.title}</h2>
                                        <p className="news-item-excerpt">{item.excerpt}</p>
                                        <Link to={`/aktuality/${item.id}`} className="news-item-link">
                                            Číst dále
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}
