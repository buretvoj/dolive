import { useParams } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { Calendar, User, Facebook, Twitter, Instagram, Share2 } from 'lucide-react'
import './AktualityDetail.css'
import '../components/PageHero/PageHero.css'

export default function AktualityDetail() {
    const { id } = useParams()

    return (
        <div className="aktuality-detail-page">
            <Header />

            <main className="aktuality-detail-main">
                <article className="article">
                    {/* Article Header & Hero Image */}
                    {/* Article Header & Hero Image (Full Width) */}
                    <div className="article-header-full">
                        <div className="article-hero-bg">
                            <img
                                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop"
                                alt="Article Cover"
                            />
                            <div className="article-overlay"></div>
                        </div>

                        <div className="container article-header-content">
                            <div className="article-meta-top">
                                <span className="article-tag">Novinky</span>
                                <div className="meta-item">
                                    <Calendar size={16} />
                                    <span>15. ledna 2026</span>
                                </div>
                            </div>
                            <h1 className="article-title">Oznámení prvních headlinerů festivalu 2026</h1>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="container article-container">
                        {/* Mobile Title (Visible only on mobile, moved from header) */}
                        <h1 className="article-title-mobile">Oznámení prvních headlinerů festivalu 2026</h1>

                        {/* Mobile Meta (Visible only on mobile) */}
                        <div className="article-meta-mobile">
                            <span className="article-tag">Novinky</span>
                            <div className="meta-item">
                                <Calendar size={16} />
                                <span>15. ledna 2026</span>
                            </div>
                        </div>

                        <div className="article-content">
                            <p className="lead">
                                S radostí oznamujeme první velká jména letošního ročníku! Připravte se na nezapomenutelné vystoupení světových hvězd elektronické scény, které rozzáří pódia Dolive Festivalu.
                            </p>

                            <p>
                                Letošní ročník Dolive Festivalu slibuje být tím největším v naší historii. Po měsících vyjednávání a příprav můžeme konečně odhalit první vlnu umělců, kteří zavítají do Skutče u Litomyšle.
                            </p>

                            <h3>Světová jména na dosah ruky</h3>
                            <p>
                                Hlavním tahákem letošního ročníku bude legendární britské elektronické duo, které se vrací na pódia po pětileté pauze. Doplní je vycházející hvězdy berlínské techno scény a špička českého alternativního popu. Snažili jsme se sestavit lineup tak, aby si na své přišli jak milovníci taneční hudby, tak fanoušci experimentálnějších žánrů.
                            </p>

                            <blockquote>
                                "Jsme nadšeni, že se nám podařilo zajistit tak silný lineup. Věříme, že letošní ročník bude pro návštěvníky nezapomenutelným zážitkem," říká ředitel festivalu Jan Novák.
                            </blockquote>

                            <p>
                                Kromě hudebního programu se můžete těšit také na rozšířenou chill-out zónu, nové umělecké instalace a bohatý doprovodný program zahrnující workshopy, přednášky a divadelní představení.
                            </p>

                            <h3>Vstupenky v prodeji</h3>
                            <p>
                                První vlna vstupenek za zvýhodněnou cenu je již v prodeji na našem webu. Neváhejte s nákupem, kapacita je omezená a očekáváme, že po zveřejnění kompletního lineupu se po lístcích jen zapráší.
                            </p>

                            <p>
                                Sledujte naše sociální sítě pro další novinky a soutěže o volné vstupy. Těšíme se na vás v srpnu!
                            </p>

                            <div className="article-footer">
                                <div className="article-author">
                                    <div className="author-avatar">
                                        <User size={24} />
                                    </div>
                                    <div className="author-info">
                                        <span className="author-name">Martin Dvořák</span>
                                        <span className="author-role">Festival Team</span>
                                    </div>
                                </div>

                                <div className="article-share">
                                    <div className="share-icons">
                                        <a href="#" className="share-icon facebook"><Facebook size={18} /></a>
                                        <a href="#" className="share-icon twitter"><Twitter size={18} /></a>
                                        <a href="#" className="share-icon instagram"><Instagram size={18} /></a>
                                        <a href="#" className="share-icon copy"><Share2 size={18} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

            </main>

            <Footer />
        </div>
    )
}
