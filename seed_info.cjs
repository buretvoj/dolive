const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Info sections...');

    // 1. Create Info Hub Page
    const infoHub = await prisma.page.upsert({
        where: { slug: 'info' },
        update: {},
        create: {
            slug: 'info',
            title: 'Informace pro vás',
            description: 'navy' // using description for accent color in hero
        }
    });

    const hubItems = [
        { id: 'dolivka', title: 'Dolívka', description: 'Historie místa, jeho příběh a proměna ve festival.', accent: 'green', order: 0 },
        { id: 'festival', title: 'Festival', description: 'Atmosféra, komunita a co dělá DOlive výjimečným.', accent: 'pink', order: 1 },
        { id: 'doprava', title: 'Doprava', description: 'Jak se k nám dostanete — vlakem i autem.', accent: 'navy', order: 2 },
        { id: 'pobyt', title: 'Pobyt na festivalu', description: 'Otevírací doba, rodiny, počasí, platby a další praktické info.', accent: 'lime', order: 3 },
        { id: 'ubytovani', title: 'Ubytování', description: 'Stan, karavan nebo pod širákem — kde a jak přespat.', accent: 'orange', order: 4 },
        { id: 'jidlo', title: 'Jídlo a pití', description: 'Kuchyně, bar, kavárna a ekologie na festivalu.', accent: 'brown', order: 5 },
    ];

    await prisma.section.deleteMany({ where: { pageId: infoHub.id } });
    await prisma.section.create({
        data: {
            pageId: infoHub.id,
            type: 'info-hub',
            order: 0,
            content: { items: hubItems }
        }
    });

    // 2. Create subpages
    const subpages = [
        {
            slug: 'info-dolivka',
            title: 'Dolívka',
            accent: 'lime',
            sections: [
                {
                    type: 'text-block',
                    content: {
                        lead: "Pánové z Rychmburku na Dolívce v roce 1720 vybudovali významný velkostatek, jehož součástí byly dvůr, špejchar, hájenka, rybníky a vydatná studna. Vodou ze studny vozkové tajně dolévali ulité pivo, které mířilo z Rychmburského pivovaru do hospod v Hlinsku a okolí, a právě proto toto místo získalo jméno Dolívka.\n\nCelý prostor byl po několik desetiletí opuštěný a chátral. V roce 2014 Dolívku získala skupina přátel, kteří se postupně snaží tuto zapomenutou lokalitu proměnit v místo setkávání. Cílem je pořádání kulturních a sportovních akcí, workshopů, přednášek a festivalů. Nedílnou součástí konceptu je zachování a podpora původních rysů prostředí a obnova krajiny – zejména vodních ploch, remízků, luk a původních dřevin a porostů v úzkém okolí."
                    }
                }
            ]
        },
        {
            slug: 'info-festival',
            title: 'Festival DOlive',
            accent: 'pink',
            sections: [
                {
                    type: 'text-block',
                    content: { lead: "Každý rok na několik letních dní ožívá Dolívka multižánrovým festivalem DOlive. Místo s příběhem v obci Předhradí se promění v otevřený prostor pro hudbu, divadlo, výtvarné umění a setkávání lidí napříč generacemi." }
                },
                {
                    type: 'cards-2col',
                    content: {
                        cards: [
                            { title: 'Atmosféra', text: 'Festival stojí na pečlivém výběru umělců, žánrové rozmanitosti a blízkém kontaktu mezi publikem a tvůrci. Program počítá i s nejmladšími návštěvníky. Díky tomu si návštěvníci odnášejí zážitky, na které se nezapomíná.', accent: 'green', icon: 'Sparkles' },
                            { title: 'Komunita', text: 'DOlive vyrůstá z komunity a z respektu k místu, které bylo dlouhá léta opuštěné a dnes dostává nový život jako prostor pro setkávání lidí. Dobrovolnická energie, dostupné vstupné a důraz na přirozené prostředí dávají festivalu jedinečný charakter. Je klidný, lidský a opravdový – festival, kde jste součástí dění.', accent: 'pink', icon: 'Users' }
                        ]
                    }
                }
            ]
        },
        {
            slug: 'info-doprava',
            title: 'Doprava',
            accent: 'navy',
            sections: [
                {
                    type: 'text-block',
                    content: { lead: "Festival DOlive se koná na Dolívce, v malebné místní části obce Předhradí u Skutče. Areál se nachází v srdci přírody, obklopen lesy a loukami. Doporučujeme využít hromadnou dopravu, ale myslíme i na ty, kteří k nám dorazí po vlastní ose." }
                },
                {
                    type: 'cards-2col',
                    content: {
                        cards: [
                            { title: 'Vlakem', text: 'Doporučujeme přijet vlakem: Využít lze stanici Žďárec u Skutče, kam jezdí vlaky z Pardubic každou hodinu. Odtud je Dolívka dostupná pěšky za 40 minut (3 km). Zastávka Předhradí je 200 m od areálu, ale vlaky tam staví zřídka.', accent: 'navy', icon: 'Train' },
                            { title: 'Autem', text: 'Pro návštěvníky přijíždějící autem je parkování zajištěno na přilehlé louce přímo u areálu. Prosíme o respektování pokynů a dočasného značení na místě.', accent: 'green', icon: 'Car' }
                        ]
                    }
                }
            ]
        },
        {
            slug: 'info-pobyt',
            title: 'Pobyt na festivalu',
            accent: 'lime',
            sections: [
                {
                    type: 'highlight-box',
                    content: { text: "Areál festivalu je otevřen od pátku 12:00 do pondělí 12:00." }
                },
                {
                    type: 'icon-list',
                    content: {
                        items: [
                            { icon: 'Baby', title: 'Rodiny s dětmi:', text: 'Festival je koncipován jako otevřená a klidná akce vhodná i pro rodiny s dětmi.' },
                            { icon: 'Cat', title: 'Zvířata:', text: 'Dolívka je farma kde žijí ovce, kozy, slepice, husy a také naši psi a kočky. Doporučujeme, aby domácí mazlíčci zůstali doma. Pokud je vezmete s sebou, mějte je prosím na vodítku.' },
                            { icon: 'CloudRain', title: 'Počasí:', text: 'Festival probíhá v přírodním prostředí, které je částečně kryté – program pokračuje i za deště.' },
                            { icon: 'Wifi', title: 'Signál & Wi-Fi:', text: 'V areálu je dostupný signál všech operátorů. Ve vymezeném prostoru je zdarma Wi-Fi a dobíjení telefonů.' },
                            { icon: 'CreditCard', title: 'Platby:', text: 'V celém areálu je možné platit hotově nebo kartou.' },
                            { icon: 'Trash2', title: 'Odpady:', text: 'Koše jsou netříděné, ale po skončení festivalu je veškerý odpad pečlivě vytříděn a recyklován organizátory.' }
                        ]
                    }
                }
            ]
        },
        {
            slug: 'info-ubytovani',
            title: 'Ubytování',
            accent: 'pink',
            sections: [
                {
                    type: 'text-block',
                    content: { lead: "Všechny uvedené způsoby stanování jsou ZDARMA. Ubytování v areálu je možné od pátku 12:00 do pondělí 12:00. Rezervace místa není nutná - na rozlehlých loukách je dost prostoru pro všechny." }
                },
                {
                    type: 'cards-2col',
                    content: {
                        cards: [
                            { title: 'Možnosti', text: 'Přijet můžete s vlastním stanem, karavanem nebo klidně přespat přímo pod širým nebem. Stanovat lze na loukách u areálu (najdete zde klidnější místa i místa blíž centru) nebo přímo v Doliveckých sadech.', accent: 'pink', icon: 'Tent' },
                            { title: 'Zázemí', text: 'K dispozici je základní zázemí včetně pitné vody, umývárny a mobilních toalet. Aby vaše cennosti byly v bezpečí, mějte je u sebe nebo v zamčeném autě, ne ve stanu.', accent: 'green', icon: 'Shield' }
                        ]
                    }
                }
            ]
        },
        {
            slug: 'info-jidlo',
            title: 'Jídlo a pití',
            accent: 'lime',
            sections: [
                {
                    type: 'text-block',
                    content: { lead: "Na festivalu se snažíme o poctivou kuchyni z lokálních surovin. Najdete u nás vše od vydatné snídaně až po půlnoční snack u baru. Doporučujeme zakoupení re-use kelímku s logem DOlive. Jídlo servírujeme v papírových miskách a s dřevěnými příbory." }
                },
                {
                    type: 'cards-3col',
                    content: {
                        cards: [
                            { title: 'Kuchyně', text: 'Snídaně: Chleby s domácími pomazánkami, koláče. Hlavní jídla: Polévky, hotovky, párek v rohlíku. Vždy vegetariánská varianta.', accent: 'green', icon: 'Utensils' },
                            { title: 'Bar', text: 'Plzeň a piva od malých pivovarů. Malináda, víno, panáky a míchané nápoje z rumu a ginu.', accent: 'pink', icon: 'Beer' },
                            { title: 'Kavárna', text: 'Káva z presovače, domácí limonády, koláče a cookies. Ideální místo pro chvíli odpočinku.', accent: 'orange', icon: 'Coffee' }
                        ]
                    }
                }
            ]
        }
    ];

    for (const pageData of subpages) {
        const page = await prisma.page.upsert({
            where: { slug: pageData.slug },
            update: { title: pageData.title, description: pageData.accent },
            create: { slug: pageData.slug, title: pageData.title, description: pageData.accent }
        });

        await prisma.section.deleteMany({ where: { pageId: page.id } });
        for (let i = 0; i < pageData.sections.length; i++) {
            await prisma.section.create({
                data: {
                    pageId: page.id,
                    type: pageData.sections[i].type,
                    content: pageData.sections[i].content,
                    order: i
                }
            });
        }
        console.log(`✅ Seeded subpage: ${page.slug}`);
    }

    console.log('🚀 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
