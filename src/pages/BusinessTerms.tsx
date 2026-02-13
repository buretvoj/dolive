import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import './BusinessTerms.css'

export default function BusinessTerms() {
    return (
        <div className="business-terms-page">
            <Header />

            <main className="business-terms-main">
                <article className="terms-article">
                    {/* Header Section */}
                    <div className="terms-header-wrapper">
                        <div className="container">
                            <h1 className="terms-title">Obchodní podmínky – DOlive Festival</h1>
                            <span className="terms-meta">Platné od: 1. 2. 2026</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="container terms-container">
                        <div className="terms-content">
                            <section>
                                <h2>1. Úvod</h2>
                                <p>
                                    Tyto obchodní podmínky upravují účast na DOlive Festivalu a stanovují pravidla nákupu vstupenek,
                                    pobytu na festivalu, bezpečnosti a dodržování pokynů organizátora.
                                    Zakoupením vstupenky návštěvník souhlasí s těmito podmínkami a zavazuje se je dodržovat.
                                </p>
                            </section>

                            <section>
                                <h2>2. Organizátor</h2>
                                <p>
                                    <strong>Dolívka Productions, s.r.o.</strong><br />
                                    Předhradí č.p. 154, 539 74<br />
                                    IČO: 21541191<br />
                                    e-mail: <a href="mailto:info@dolive.cz">info@dolive.cz</a>
                                </p>
                            </section>

                            <section>
                                <h2>3. Objednávka a platba</h2>
                                <ul>
                                    <li>Online objednávka vstupenek je platná až po úspěšném zaplacení.</li>
                                    <li>Ceny vstupenek jsou uvedeny v CZK.</li>
                                    <li>Platby probíhají přes platební bránu Comgate (karta, bankovní převod, Apple/Google Pay). Organizátor nenese odpovědnost za technické problémy platební brány.</li>
                                    <li>Vstupenky je možné zakoupit také přímo na místě, u vstupu do areálu.</li>
                                </ul>
                            </section>

                            <section>
                                <h2>4. Storno a refundace</h2>
                                <p>
                                    <strong>Storno před platbou:</strong> objednávku lze zrušit, žádná platba se neprovádí.
                                </p>
                                <p>
                                    <strong>Vrácení po platbě:</strong> vstupenku lze vrátit nejpozději do 31. 7. 2026. Refundace probíhá přes platební bránu. Vratky po tomto datu jsou možné pouze při zrušení festivalu nebo v individuálních výjimečných případech.
                                </p>
                            </section>

                            <section>
                                <h2>5. Povinnosti a bezpečnost účastníka</h2>
                                <ul>
                                    <li>Na vstupu předložit vstupenku s QR kódem a získat náramek opravňující k pobytu na festivalu. Ponechat náramek na ruce po celou dobu festivalu.</li>
                                    <li>Nepřinášet nebezpečné předměty a pyrotechniku.</li>
                                    <li>Řídit se pokyny organizátora a festivalového personálu.</li>
                                    <li>Chovat se ohleduplně a s respektem k ostatním účastníkům festivalu.</li>
                                    <li>Porušení pravidel může vést k neumožnění vstupu nebo k vyvedení z festivalu, bez vrácení vstupného.</li>
                                </ul>
                            </section>

                            <section>
                                <h2>7. Foto / video souhlas</h2>
                                <p>
                                    Vstupem na festival účastník souhlasí s focením a natáčením pro promo, dokumentační a reklamní účely.
                                </p>
                            </section>

                            <section>
                                <h2>8. Force majeure a změny programu</h2>
                                <p>
                                    Organizátor nenese odpovědnost za události mimo jeho kontrolu, včetně nepříznivého počasí, technických poruch nebo zrušení účasti ze strany interpretů. Program festivalu může být upraven nebo doplněn podle aktuálních podmínek, včetně náhrady vystupujících.
                                </p>
                            </section>

                            <section>
                                <h2>9. Ochrana osobních údajů (GDPR)</h2>
                                <p>Správcem dat je DOlive Festival s.r.o., info@dolive.cz.</p>
                                <p>Osobní údaje jsou zpracované v rozsahu: jméno a příjmení, e-mailová adresa.</p>
                                <p>Údaje jsou zpracovávány pro účely:</p>
                                <ul>
                                    <li>zajištění nákupu vstupenek</li>
                                    <li>zasílání organizačních a provozních informací souvisejících s konáním festivalu</li>
                                    <li>zasílání informací o dalších ročnících festivalu a souvisejících akcích</li>
                                </ul>
                                <p>
                                    Osobní údaje budou zpracovávány do doby, než je tento souhlas odvolán.<br />
                                    Zákazník má právo na přístup, opravu, výmaz, omezení zpracování, odvolání souhlasu a stížnost u dozorového úřadu. Žádosti lze zaslat na mail info@dolive.cz.<br />
                                    Údaje nejsou poskytovány třetím stranám mimo platební bránu a doručení vstupenek.
                                </p>
                            </section>

                            <section>
                                <h2>11. Závěrečná ustanovení</h2>
                                <p>
                                    Organizátor si vyhrazuje právo měnit obchodní podmínky; nové znění platí pro nové objednávky.<br />
                                    Tyto podmínky se řídí českým právem.
                                </p>
                            </section>
                        </div>
                    </div>
                </article>
                <div className="terms-full-image">
                    <img
                        src="https://static.wixstatic.com/media/b10128_99394bc497504df49c9c2afac3dcb46b~mv2.jpg/v1/fill/w_2048,h_409,al_c,q_85,enc_avif,quality_auto/b10128_99394bc497504df49c9c2afac3dcb46b~mv2.jpg"
                        alt="Dolívka Panorama"
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}
