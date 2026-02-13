import { type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { ArrowLeft, Ghost, MapPin, Baby, Cat, CloudRain, Wifi, CreditCard, Trash2, Sparkles, Users, Train, Car, Tent, Shield, Utensils, Beer, Coffee, Leaf } from 'lucide-react'
import './Info.css'

/* ============================================================
   Section content data — all the original Info.tsx content
   split into individual sections
============================================================ */

const SECTION_DATA: Record<string, {
    title: string
    accent: 'navy' | 'pink' | 'lime'
    content: ReactNode
}> = {
    dolivka: {
        title: 'Dolívka',
        accent: 'lime',
        content: (
            <div className="info-detail-body">
                <div className="info-text-block">
                    <p className="lead">Pánové z Rychmburku na Dolívce v roce 1720 vybudovali významný velkostatek, jehož součástí byly dvůr, špejchar, hájenka, rybníky a vydatná studna. Vodou ze studny vozkové tajně dolévali ulité pivo, které mířilo z Rychmburského pivovaru do hospod v Hlinsku a okolí, a právě proto toto místo získalo jméno Dolívka.</p>
                    <p className="lead">Celý prostor byl po několik desetiletí opuštěný a chátral. V roce 2014 Dolívku získala skupina přátel, kteří se postupně snaží tuto zapomenutou lokalitu proměnit v místo setkávání. Cílem je pořádání kulturních a sportovních akcí, workshopů, přednášek a festivalů. Nedílnou součástí konceptu je zachování a podpora původních rysů prostředí a obnova krajiny – zejména vodních ploch, remízků, luk a původních dřevin a porostů v úzkém okolí.</p>
                </div>
            </div>
        ),
    },
    festival: {
        title: 'Festival DOlive',
        accent: 'pink',
        content: (
            <div className="info-detail-body">
                <div className="info-text-block">
                    <p className="lead">Každý rok na několik letních dní ožívá Dolívka multižánrovým festivalem DOlive. Místo s příběhem v obci Předhradí se promění v otevřený prostor pro hudbu, divadlo, výtvarné umění a setkávání lidí napříč generacemi.</p>

                    <div className="info-grid-2col">
                        <div className="info-card organic-card organic-card-green">
                            <div className="card-header-with-icon">
                                <Sparkles className="card-icon" />
                                <h3>Atmosféra</h3>
                            </div>
                            <p>Festival stojí na pečlivém výběru umělců, žánrové rozmanitosti a blízkém kontaktu mezi publikem a tvůrci. Program počítá i s nejmladšími návštěvníky. Díky tomu si návštěvníci odnášejí zážitky, na které se nezapomíná.</p>
                        </div>
                        <div className="info-card organic-card organic-card-pink">
                            <div className="card-header-with-icon">
                                <Users className="card-icon" />
                                <h3>Komunita</h3>
                            </div>
                            <p>DOlive vyrůstá z komunity a z respektu k místu, které bylo dlouhá léta opuštěné a dnes dostává nový život jako prostor pro setkávání lidí. Dobrovolnická energie, dostupné vstupné a důraz na přirozené prostředí dávají festivalu jedinečný charakter. Je klidný, lidský a opravdový – festival, kde jste součástí dění.</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    doprava: {
        title: 'Doprava',
        accent: 'navy',
        content: (
            <div className="info-detail-body">
                <p className="lead">Festival DOlive se koná na Dolívce, v malebné místní části obce Předhradí u Skutče. Areál se nachází v srdci přírody, obklopen lesy a loukami. Doporučujeme využít hromadnou dopravu, ale myslíme i na ty, kteří k nám dorazí po vlastní ose.</p>

                <div className="info-grid-2col">
                    <div className="info-card organic-card organic-card-navy">
                        <div className="card-header-with-icon">
                            <Train className="card-icon" />
                            <h3>Vlakem</h3>
                        </div>
                        <p><strong>Doporučujeme přijet vlakem:</strong> Využít lze stanici <strong>Žďárec u Skutče</strong>, kam jezdí vlaky z Pardubic každou hodinu. Odtud je Dolívka dostupná pěšky za 40 minut (3 km). <em>Zastávka Předhradí je 200 m od areálu, ale vlaky tam staví zřídka.</em></p>
                    </div>
                    <div className="info-card organic-card organic-card-green">
                        <div className="card-header-with-icon">
                            <Car className="card-icon" />
                            <h3>Autem</h3>
                        </div>
                        <p>Pro návštěvníky přijíždějící autem je parkování zajištěno na přilehlé louce přímo u areálu. Prosíme o respektování pokynů a dočasného značení na místě.</p>
                    </div>
                </div>
            </div>
        ),
    },
    pobyt: {
        title: 'Pobyt na festivalu',
        accent: 'lime',
        content: (
            <div className="info-detail-body">
                <div className="info-text-block">
                    <p className="highlight-box">Areál festivalu je otevřen od pátku 12:00 do pondělí 12:00.</p>

                    <ul className="icon-list animated-list">
                        <li>
                            <div className="icon-wrapper"><Baby /></div>
                            <div className="content">
                                <strong>Rodiny s dětmi:</strong> Festival je koncipován jako otevřená a klidná akce vhodná i pro rodiny s dětmi.
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><Cat /></div>
                            <div className="content">
                                <strong>Zvířata:</strong> Dolívka je farma kde žijí ovce, kozy, slepice, husy a také naši psi a kočky. Doporučujeme, aby domácí mazlíčci zůstali doma. Pokud je vezmete s sebou, mějte je prosím na vodítku.
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><CloudRain /></div>
                            <div className="content">
                                <strong>Počasí:</strong> Festival probíhá v přírodním prostředí, které je částečně kryté – program pokračuje i za deště.
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><Wifi /></div>
                            <div className="content">
                                <strong>Signál & Wi-Fi:</strong> V areálu je dostupný signál všech operátorů. Ve vymezeném prostoru je zdarma Wi-Fi a dobíjení telefonů.
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><CreditCard /></div>
                            <div className="content">
                                <strong>Platby:</strong> V celém areálu je možné platit hotově nebo kartou.
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><Trash2 /></div>
                            <div className="content">
                                <strong>Odpady:</strong> Koše jsou netříděné, ale po skončení festivalu je veškerý odpad pečlivě vytříděn a recyklován organizátory.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        ),
    },
    ubytovani: {
        title: 'Ubytování',
        accent: 'pink',
        content: (
            <div className="info-detail-body">
                <p className="lead">Všechny uvedené způsoby stanování jsou <strong>ZDARMA</strong>. Ubytování v areálu je možné od pátku 12:00 do pondělí 12:00. Rezervace místa není nutná - na rozlehlých loukách je dost prostoru pro všechny.</p>

                <div className="info-grid-2col">
                    <div className="info-card organic-card organic-card-pink">
                        <div className="card-header-with-icon">
                            <Tent className="card-icon" />
                            <h3>Možnosti</h3>
                        </div>
                        <p>Přijet můžete s vlastním stanem, karavanem nebo klidně přespat přímo pod širým nebem. Stanovat lze na loukách u areálu (najdete zde klidnější místa i místa blíž centru) nebo přímo v Doliveckých sadech.</p>
                    </div>
                    <div className="info-card organic-card organic-card-green">
                        <div className="card-header-with-icon">
                            <Shield className="card-icon" />
                            <h3>Zázemí</h3>
                        </div>
                        <p>K dispozici je základní zázemí včetně pitné vody, umývárny a mobilních toalet. Aby vaše cennosti byly v bezpečí, mějte je u sebe nebo v zamčeném autě, ne ve stanu.</p>
                    </div>
                </div>
            </div>
        ),
    },
    jidlo: {
        title: 'Jídlo a pití',
        accent: 'lime',
        content: (
            <div className="info-detail-body">
                <p className="lead">Na festivalu se snažíme o poctivou kuchyni z lokálních surovin. Najdete u nás vše od vydatné snídaně až po půlnoční snack u baru. Doporučujeme zakoupení <strong>re-use kelímku</strong> s logem DOlive. Jídlo servírujeme v papírových miskách a s dřevěnými příbory.</p>

                <div className="info-grid-3col">
                    <div className="info-card organic-card organic-card-green">
                        <div className="card-header-with-icon">
                            <Utensils className="card-icon" />
                            <h3>Kuchyně</h3>
                        </div>
                        <p><strong>Snídaně:</strong> Chleby s domácími pomazánkami, koláče. <strong>Hlavní jídla:</strong> Polévky, hotovky, párek v rohlíku. Vždy vegetariánská varianta.</p>
                    </div>
                    <div className="info-card organic-card organic-card-pink">
                        <div className="card-header-with-icon">
                            <Beer className="card-icon" />
                            <h3>Bar</h3>
                        </div>
                        <p>Plzeň a piva od malých pivovarů. Malináda, víno, panáky a míchané nápoje z rumu a ginu.</p>
                    </div>
                    <div className="info-card organic-card organic-card-yellow">
                        <div className="card-header-with-icon">
                            <Coffee className="card-icon" />
                            <h3>Kavárna</h3>
                        </div>
                        <p>Káva z presovače, domácí limonády, koláče a cookies. Ideální místo pro chvíli odpočinku.</p>
                    </div>
                </div>
            </div>
        ),
    },
}

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
}

export default function InfoDetail() {
    const { section } = useParams<{ section: string }>()
    const data = section ? SECTION_DATA[section] : null

    if (!data) {
        return (
            <div className="info-page">
                <Header />
                <main className="info-main">
                    <div className="container" style={{ padding: '10rem 2rem' }}>
                        <h1>Stránka nenalezena</h1>
                        <p>Tato sekce neexistuje.</p>
                        <Link to="/info" className="info-back-link"><ArrowLeft size={18} /> Zpátky na info</Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="info-page">
            <Header />

            <main className="info-main">
                <PageHero
                    title={data.title}
                    accentColor={data.accent}
                />

                <section className="info-detail">
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="info-detail-inner"
                        >
                            {data.content}

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
