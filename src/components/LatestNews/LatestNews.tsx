import { Link } from 'react-router-dom'
import './LatestNews.css'

interface BlogPost {
    id: number
    title: string
    excerpt: string
    date: string
}

const DUMMY_POSTS: BlogPost[] = [
    {
        id: 1,
        title: 'Festival 2026: Co očekávat',
        excerpt: 'Připravte se na nezapomenutelný zážitek jako nikdy předtím. Spojujeme umělce z celého světa, abychom vytvořili jedinečnou fúzi kultury a inovace. Objevte nové stage, umělecké instalace a kulinářské speciality, které na vás čekají.',
        date: '12. 01. 2026'
    },
    {
        id: 2,
        title: 'Seznamte se s headlinery',
        excerpt: 'Od elektronických beatů po klasické symfonie, naše letošní sestava je rozmanitější než kdy předtím. Připojte se k nám a prozkoumejte neuvěřitelnou škálu talentů, které jsme pro vás připravili.',
        date: '05. 02. 2026'
    },
    {
        id: 3,
        title: 'Udržitelnost na Dolive',
        excerpt: 'Zavázali jsme se ke snížení naší ekologické stopy. Zjistěte více o našich zelených iniciativách, včetně zero-waste jídla, recyklace a obnovitelné energie, které pohání náš festival.',
        date: '18. 02. 2026'
    },
    {
        id: 4,
        title: 'Partnerství s lokálními producenty',
        excerpt: 'Spolupracujeme s místními farmáři a řemeslníky, abychom vám přinesli tu nejlepší lokální gastronomii a craft pivo přímo z regionu. Těšit se můžete na domácí sýry, uzeniny a čerstvé pečivo.',
        date: '25. 02. 2026'
    }
]

export default function LatestNews() {
    return (
        <section className="latest-news-section">
            <div className="section-wave mobile-only">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
            <div className="container">
                <h2 className="news-heading">Aktuality</h2>
                <div className="news-grid">
                    {DUMMY_POSTS.map(post => (
                        <article key={post.id} className="news-card">
                            <div className="news-content">
                                <h3 className="news-title">{post.title}</h3>
                                <span className="news-date">{post.date}</span>
                                <p className="news-excerpt">
                                    {post.excerpt.slice(0, 120)}...
                                </p>
                                <a href="#" className="read-more">číst více →</a>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="news-actions">
                    <Link to="/aktuality" className="btn btn-primary">zobrazit více</Link>
                </div>
            </div>
        </section>
    )
}
