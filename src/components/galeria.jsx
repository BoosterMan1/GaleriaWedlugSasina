/**
 * Galeria.jsx
 * Senior Frontend Architect – refaktoring z integracją jQuery (useRef + fadeIn/fadeOut)
 * jQuery operuje WYŁĄCZNIE na kontenerach podpiętych przez useRef, nigdy nie mutuje
 * drzewa DOM zarządzanego przez Reacta.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import $ from "jquery";
import "../App.css";

// ─── Dane czołgów ────────────────────────────────────────────────────────────

import abrams   from "../gallery/abrams.jpg";
import kw1      from "../gallery/kw1.jpg";
import leopard1 from "../gallery/leopard1.jpg";
import leopard2 from "../gallery/leopard2.jpg";
import m26      from "../gallery/m26.jpg";
import m48      from "../gallery/m48.jpg";
import m60      from "../gallery/m60.jpg";
import pantera  from "../gallery/pantera.jpg";
import panzer4  from "../gallery/panzer4.jpg";
import sherman  from "../gallery/sherman.jpg";
import t34      from "../gallery/t34.jpg";
import t55      from "../gallery/t55.jpg";
import t72      from "../gallery/t72.jpg";
import t90      from "../gallery/t90.jpg";
import tygrys   from "../gallery/tygrys.jpg";

const czolgi = [
    {
        src: panzer4,
        nazwa: "Panzer IV",
        kategoria: "niemcy",
        opis: "Niemiecki czołg średni, produkowany przez cały okres II wojny światowej. Sprawdzał się dobrze chociaż daleko mu do ideału. To właśnie jego najczęściej spotykali alianci, co ciekawe przez ogólny strach przed Tygrysami, Panzera IV bardzo często alianci mylili z czołgiem Tiger H1, w rzeczywistości niepotrzebnie wypełniając swoje gacie.",
        zrodlo: "https://en.wikipedia.org/wiki/Panzer_IV",
    },
    {
        src: pantera,
        nazwa: "Panther (Pantera)",
        kategoria: "niemcy",
        opis: "Niemiecki generał Heinz Guderian (nie mylić z fasolkami) porównał Pantery do szwajcarskich zegarków ze względu na to jak są skomplikowane i precyzyjne, nie ma dla czołgu gorszej obelgi. Pomimo swojej siły były prawdziwym koszmarem czy to w dowiezieniu ich na pole bitwy, czy w serwisie, sporadycznie koszmarem aliantów. Na bitwę o Kursk przygotowano 200 Panter, wie Pan ile z nich NIE zepsuło się przed dotarciem na pole bitwy? 10.",
        zrodlo: "https://tankmuseum.org/tank-nuts/tank-collection/panther",
    },
    {
        src: tygrys,
        nazwa: "Tiger (Tygrys)",
        kategoria: "niemcy",
        opis: "Tiger I był równą logistyczną kulą u nogi co Pantera, chociaż nie można mu było odmówić wytrzymałości na ostrzał i wielkiej lufy, załogi sowieckich czolgów często spotykały Tygrysy porzucone w kałużach błota, które zamarzło w skomplikowanym podwoziu Tygrysa, właśnie tak się niekiedy sprawdzały.",
        zrodlo: "https://tankmuseum.org/tank-nuts/tank-collection/tiger-i",
    },
    {
        src: leopard1,
        nazwa: "Leopard 1",
        kategoria: "niemcy",
        opis: "Niemieccy inżynierowie doskonale wiedzieli że w 1965 roku (W którym Leopard 1 wszedł do służby w Bundeswehrze) istnieje amunicja która przebije każdy pancerz, więc w nowym czołgu postanowili postawić na mobilność, siłę ognia i optykę, Leopard 1 był jak Lewandowski w szczycie formy, zawsze był pierwszy, i zawsze trafiał.",
        zrodlo: "https://www.bundeswehr.de/de/ausruestung-technik-bundeswehr/kampfpanzer-leopard-versionen-bundeswehr",
    },
    {
        src: leopard2,
        nazwa: "Leopard 2",
        kategoria: "niemcy",
        opis: "Nowoczesny następca Leoparda 1, pierwsze egzemplarze pojawiły się w Bundeswehrze w 1979 roku a jego ulepszenia dzisiaj stanowią zwyczajnie najlepszy i najbardziej uniwersalny czołg na świecie, jest wzorem do naśladowania we wszystkich aspektach jakich można oczekiwać od czołgu, prawdziwy majstersztyk Niemieckiej inżynierii.",
        zrodlo: "https://www.bundeswehr.de/de/ausruestung-technik-bundeswehr/kampfpanzer-leopard-versionen-bundeswehr",
    },
    {
        src: sherman,
        nazwa: "M4 Sherman",
        kategoria: "usa",
        opis: "II Wojna Światowa też miała swojego lidera, a to właśnie on. Co? Nie tygrys? Nawet nie t-34? Nie, sherman był uniwersalny, miał dobry pancerz, dobre działo, dużo miejsca, dobry silnik, tania produkcja masowa. Świetnie sprawdzał się WSZĘDZIE, to właśnie sherman najlepiej spełniał wymagania czołgu podstawowego w tamtych czasach, był najlepszy.",
        zrodlo: "https://en.wikipedia.org/wiki/M4_Sherman",
    },
    {
        src: m26,
        nazwa: "M26 Pershing",
        kategoria: "usa",
        opis: "M26 Pershing powstał, dlatego że amerykanie bali się Niemieckich ciężkich czołgów, które przebijały shermany na wylot, a więc oto i on, uniwersalny, dobry w większości aspektów amerykański czołg ciężki, z pancerzem tak grubym jak nie powiem co bo to szkolna praca.",
        zrodlo: "https://armyhistory.org/the-m26-pershing-heavy-tank/",
    },
    {
        src: m48,
        nazwa: "M48 Patton",
        kategoria: "usa",
        opis: "W latach 50 XX wieku wszedł do służby ten kolega, jak na amerykę przystało uniwersalny, ale to nie amerykanom przysłużył się najbardziej, a wietnamczykom, mógł strzelać bowiem amunicją kartaczową, czyli pociskami wypełnionymi tysiącami małych strzałek, jeden strzał z takiego pocisku i pół dżungli wyczyszczone z wrogów!",
        zrodlo: "https://www.benning.army.mil/armor/eARMOR/content/issues/2011/SEP_OCT/ARMORSEPOCT11Web.pdf",
    },
    {
        src: m60,
        nazwa: "M60 Patton",
        kategoria: "usa",
        opis: "M60 był rozwinięciem konstrukcji M48, dostał nową armatę, pancerz łatwiejszy w produkcji, a uniwersalnosci nie trzeba wspominać, przez wiele lat stanowił podstawę wojsk pancernych USA nawet po wydaniu bardziej nowoczesnych czołgów. A, i zagrał w The Walking Dead.",
        zrodlo: "https://www.govinfo.gov/content/pkg/GOVPUB-D5_400-PURL-gpo5913/pdf/GOVPUB-D5_400-PURL-gpo5913.pdf",
    },
    {
        src: abrams,
        nazwa: "M1 Abrams",
        kategoria: "usa",
        opis: "Abramsy jeżdżą w służbie do dzisiaj, i są MBT USA (czyli Main Battle tank), w jego późniejszych wersjach dodano do niego pancerz z siatką ze zubożonego uranu który sprawił że dla większości czołgów wroga przód Abramsa jest prawie niezniszczalny",
        zrodlo: "https://history.army.mil/Portals/143/Images/Birthday/Army_History_and_Heritage.pdf",
    },
    {
        src: kw1,
        nazwa: "KW-1",
        kategoria: "zsrr",
        opis: "Abrams nie jest nawet w jednej setnej tak trudny do zniszczenia jaki był ten radziecki potwór, KW-1 podczas swojej służby 1939 i podczas akcji Barbarossa w 1941 był tak opancerzony, że po prostu i bez ironii nie dało się go czasami zniszczyć, strzelał aż nie skończyła mu się amunicja, jechał dopóki miał paliwo. Monstrum. (Tylko działo miał malutkie...)",
        zrodlo: "https://tanks-encyclopedia.com/ww2/soviet/soviet_kv-1.php",
    },
    {
        src: t34,
        nazwa: "T-34",
        kategoria: "zsrr",
        opis: 'Radziecki sherman, i jeden z najbardziej rozpoznawalnych czołgów na świecie, dlaczego? Bo było ich tak dużo, że zaważyły o losach wojny, to t-34 nosił na swoich barkach większość radzieckich pancernych zwycięstw, ale o załogę w nim nie zadbali, ciasno i niewygodnie, dym w środku po każdym strzale, załoga która musi się kopać żeby się porozumieć, dobrze oddaje słynne słowa Stalina - "Ja ludzi mam dużo."',
        zrodlo: "https://en.wikipedia.org/wiki/T-34",
    },
    {
        src: t55,
        nazwa: "T-55",
        kategoria: "zsrr",
        opis: "Ten czołg ludzie nazwali czołgowym kałasznikowem, czyli na cześć najliczniejszego karabinu maszynowego na świecie, T-55 stanowi absolutny rekord w liczebności w historii, wyprodukowano od 86 000 do 100 000 egzemplarzy, było ich tak dużo, że jakby wziąść liczbę wszystkich wyprodukowanych czołgów po zakończeniu II WŚ, T-55 byłoby więcej.",
        zrodlo: "https://en.wikipedia.org/wiki/T-54/T-55",
    },
    {
        src: t72,
        nazwa: "T-72",
        kategoria: "zsrr",
        opis: "Zwykła modernizacja, ale piekielnie udana, został zaprojektowany tak, aby dobrze sprawdzić się w warunkach wojny atomowej, miał system PAZ (Aparatura Ochrony Przedatomowej), gdy system wykryje promieniowanie gamma lub błysk jądrowy natychmiast odcina załodze dopływ powietrza z zewnątrz, uruchamia specjalne filtry i wyłącza wentylatory, zamyka żaluzje i włazy, ciekawe chociaż na szczęście nie używane. Może i nie była to jego główna funkcja, to jest ciekawsza niż pancerz i armata.",
        zrodlo: "https://odin.tradoc.army.mil/WEG/Asset/T-72_Russian_Main_Battle_Tank_",
    },
    {
        src: t90,
        nazwa: "T-90",
        kategoria: "zsrr",
        opis: 'USA ma Abramsa, Niemcy Leoparda 2, a Rosja T-90, ma charakterystyczne "czerwone oczy szatana" (System Sztora-1), wysyła sygnały podczerwieni aby oszukać i oślepiać układy naprowadzania wrogich pocisków rakietowych zmuszając je do skręcania, bardzo dobry pancerz chroni nawet przed nowoczesnymi pociskami, zdecydowanie nie odstaje od oponentów w swojej lidze, ze swojego 12.5 centymetrowego działa może nawet wystrzeliwać rakiety kierowane, dokładnie te które wrogom oślepia.',
        zrodlo: "https://odin.tradoc.army.mil/WEG/Asset/T-90A_T-90S_Russian_Main_Battle_Tank_MBT",
    },
];

const kategorie = [
    { id: "wszystkie", etykieta: "Wszystkie" },
    { id: "niemcy",    etykieta: "Niemcy" },
    { id: "usa",       etykieta: "USA" },
    { id: "zsrr",      etykieta: "ZSRR / Rosja" },
];

const opisyKategorii = {
    niemcy: "NIEMCY",
    usa:    "STANY ZJEDNOCZONE",
    zsrr:   "ZSRR / ROSJA",
};

const CZAS_ANIMACJI = 280;

function Galeria() {
    const [filtr, setFiltr] = useState("wszystkie");
    const [indeks, setIndeks] = useState(0);
    const [otwarta, setOtwarta] = useState(false);

    const refLightbox = useRef(null);
    const refKarta = useRef(null);
    const czyAnimuje = useRef(false);

    const lista = filtr === "wszystkie" ? czolgi : czolgi.filter((c) => c.kategoria === filtr);

    const aktualny = lista[indeks] ?? null;

    useEffect(() => {
        const $lb = $(refLightbox.current);

        if (otwarta) {
            $lb.stop(true, true).hide().fadeIn(CZAS_ANIMACJI);
        } else {
            $lb.stop(true, true).fadeOut(CZAS_ANIMACJI);
        }
    }, [otwarta]);

    useEffect(() => {
        if (!otwarta) return;

        function obsluzKlawisz(e) {
            if (e.key === "Escape") zamknijLightbox();
            if (e.key === "ArrowLeft") zmienZdjecie(-1);
            if (e.key === "ArrowRight") zmienZdjecie(1);
        }

        window.addEventListener("keydown", obsluzKlawisz);
        return () => window.removeEventListener("keydown", obsluzKlawisz);
    }, [otwarta, indeks, filtr]);

    const zmienZdjecie = useCallback((krok) => {
        if (czyAnimuje.current || lista.length < 2) return;

        czyAnimuje.current = true;
        const $karta = $(refKarta.current);

        $karta.stop(true, true).fadeOut(CZAS_ANIMACJI, () => {
            setIndeks((obecny) => (obecny + krok + lista.length) % lista.length);
            $karta.fadeIn(CZAS_ANIMACJI, () => {
                czyAnimuje.current = false;
            });
        });
    }, [lista.length]);

    function otworzLightbox(i) {
        setIndeks(i);
        setOtwarta(true);
    }

    function zamknijLightbox() {
        setOtwarta(false);
    }

    function wybierzFiltr(id) {
        czyAnimuje.current = false;
        setFiltr(id);
        setIndeks(0);
    }

    return (
        <main className="strona">
            <header className="naglowek">
                <p className="nadtytul">GALERIA PANCERNYCH BESTII</p>
                <h1>Najbardziej znane czołgi świata</h1>
                <p className="podtytul">Od II wojny światowej po współczesność.</p>
            </header>

            <nav className="filtry" aria-label="Filtruj czołgi">
                {kategorie.map((kategoria) => (
                    <button
                        key={kategoria.id}
                        type="button"
                        className={filtr === kategoria.id ? "aktywny" : ""}
                        aria-pressed={filtr === kategoria.id}
                        onClick={() => wybierzFiltr(kategoria.id)}
                    >
                        {kategoria.etykieta}
                    </button>
                ))}
            </nav>

            <section className="galeria" aria-label="Galeria czołgów">
                {lista.map((czolg, i) => (
                    <button
                        key={czolg.nazwa}
                        type="button"
                        className="galeria-element"
                        onClick={() => otworzLightbox(i)}
                        aria-label={`Pokaż szczegóły: ${czolg.nazwa}`}
                    >
                        <span className="miniatura">
                            <img src={czolg.src} alt="" loading="lazy" />
                            <span className="znacznik">ZOBACZ SZCZEGÓŁY ↗</span>
                        </span>
                        <span className="podpis-czolgu">{czolg.nazwa}</span>
                    </button>
                ))}
            </section>

            <div
                ref={refLightbox}
                className="lightbox"
                style={{ display: "none" }}
                onClick={zamknijLightbox}
                role="dialog"
                aria-modal="true"
                aria-label="Podgląd czołgu"
            >
                <button
                    type="button"
                    className="zamknij"
                    aria-label="Zamknij podgląd"
                    onClick={zamknijLightbox}
                >
                    ×
                </button>

                <button
                    type="button"
                    className="strzalka lewa"
                    aria-label="Poprzedni czołg"
                    disabled={lista.length < 2}
                    onClick={(e) => { e.stopPropagation(); zmienZdjecie(-1); }}
                >
                    <span className="strzalkaSpan">&lt;</span>
                </button>

                <div
                    ref={refKarta}
                    className="karty-viewport"
                    onClick={(e) => e.stopPropagation()}
                >
                    {aktualny && (
                        <section className="lightbox-tresc">
                            <div className="zdjecie-kontener">
                                <img src={aktualny.src} alt={aktualny.nazwa} />
                            </div>
                            <article className="opis-czolgu">
                                <p className="nadtytul">{opisyKategorii[aktualny.kategoria]}</p>
                                <h2>{aktualny.nazwa}</h2>
                                <p className="opis">{aktualny.opis}</p>
                                <a
                                    href={aktualny.zrodlo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Źródło informacji ↗
                                </a>
                                <p className="licznik">{indeks + 1} / {lista.length}</p>
                            </article>
                        </section>
                    )}
                </div>

                <button
                    type="button"
                    className="strzalka prawa"
                    aria-label="Następny czołg"
                    disabled={lista.length < 2}
                    onClick={(e) => { e.stopPropagation(); zmienZdjecie(1); }}
                >
                    <span className="strzalkaSpan">&gt;</span>
                </button>
            </div>

            <footer className="stopka">Jakub Sasin</footer>
        </main>
    );
}

export default Galeria;
