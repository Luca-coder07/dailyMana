// ---------- CONFIGURATION ----------
const VERSES_API = {
    fr: 'https://raw.githubusercontent.com/leorak98/seed-verses/main/data/fr/verses.json',
    en: 'https://raw.githubusercontent.com/leorak98/seed-verses/main/data/en/verses.json',
    mg: 'https://raw.githubusercontent.com/leorak98/seed-verses/main/data/mg/verses.json'
};

// Cache des versets par langue
const versesCache = { fr: null, en: null, mg: null };

let currentLanguage = 'fr';
let currentVersesList = [];
let isLoading = false;

// Éléments DOM
const verseTextEl = document.getElementById('verseText');
const verseRefEl = document.getElementById('verseRef');
const verseCard = document.getElementById('verseCard');
const langSelect = document.getElementById('languageSelect');
const newVerseBtn = document.getElementById('newVerseBtn');

// ---------- FONCTIONS UTILITAIRES ----------
function applyFadeAnimation() {
    verseCard.classList.remove('fade-animation');
    void verseCard.offsetWidth; // force reflow
    verseCard.classList.add('fade-animation');
    setTimeout(() => verseCard.classList.remove('fade-animation'), 350);
}

function displayVerseObject(verseObj) {
    if (!verseObj || (!verseObj.text && !verseObj.verse)) {
        verseTextEl.innerHTML = `✨ Méditation du jour ✨`;
        verseRefEl.innerHTML = `— Pause sacrée —`;
        applyFadeAnimation();
        return;
    }
    const verseContent = verseObj.text || verseObj.verse;
    const verseReference = verseObj.reference || "Référence biblique";
    verseTextEl.innerHTML = verseContent;
    verseRefEl.innerHTML = `— ${verseReference} —`;
    applyFadeAnimation();
}

function displayMessage(message, isError = false) {
    if (isError) {
        verseTextEl.innerHTML = `🕊️ ${message}`;
        verseRefEl.innerHTML = `— Veuillez réessayer —`;
    } else {
        verseTextEl.innerHTML = message;
        verseRefEl.innerHTML = `— en préparation —`;
    }
    applyFadeAnimation();
}

function showLoadingState() {
    verseTextEl.innerHTML = `<span class="loading-indicator"><span class="spinner"></span>  Méditation en route...</span>`;
    verseRefEl.innerHTML = `— un instant, s'il vous plaît —`;
    applyFadeAnimation();
}

function normalizeVersesData(rawData) {
    if (!Array.isArray(rawData) || rawData.length === 0) return [];
    return rawData.map(item => ({
        text: item.text || item.verse || null,
        reference: item.reference || item.ref || "Source biblique"
    })).filter(v => v.text);
}

async function fetchVersesForLanguage(lang) {
    const url = VERSES_API[lang];
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rawData = await response.json();
    const normalized = normalizeVersesData(rawData);
    if (normalized.length === 0) throw new Error(`Aucun verset trouvé`);
    versesCache[lang] = normalized;
    return normalized;
}

async function getVersesList(lang) {
    if (versesCache[lang] && versesCache[lang].length > 0) return versesCache[lang];
    return await fetchVersesForLanguage(lang);
}

function pickRandomVerse(versesArray) {
    if (!versesArray || versesArray.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * versesArray.length);
    return versesArray[randomIndex];
}

async function refreshRandomVerse(showLoading = true) {
    if (isLoading) return;
    isLoading = true;
    if (showLoading) showLoadingState();

    try {
        const verses = await getVersesList(currentLanguage);
        if (!verses.length) throw new Error("Aucun verset disponible");
        currentVersesList = verses;
        const randomVerse = pickRandomVerse(currentVersesList);
        if (!randomVerse) throw new Error("Échec de sélection");
        displayVerseObject(randomVerse);
    } catch (err) {
        let friendlyMsg = "📡 Connexion interrompue. Vérifie ton réseau.";
        if (err.message.includes("HTTP") || err.message.includes("fetch")) {
            friendlyMsg = "🕯️ Problème réseau. Impossible de charger les versets.";
        } else if (err.message.includes("Aucun verset")) {
            friendlyMsg = "🌸 Le fichier de versets semble vide pour cette langue.";
        } else {
            friendlyMsg = `✨ ${err.message}`;
        }
        displayMessage(friendlyMsg, true);
        currentVersesList = [];
    } finally {
        isLoading = false;
    }
}

async function onLanguageChange(newLang) {
    if (newLang === currentLanguage && versesCache[newLang]?.length) {
        if (currentVersesList.length) {
            const randomVerse = pickRandomVerse(currentVersesList);
            if (randomVerse) displayVerseObject(randomVerse);
            else await refreshRandomVerse(true);
        } else {
            await refreshRandomVerse(true);
        }
        return;
    }

    currentLanguage = newLang;
    if (versesCache[newLang]?.length) {
        currentVersesList = versesCache[newLang];
        const randomVerse = pickRandomVerse(currentVersesList);
        if (randomVerse) displayVerseObject(randomVerse);
        else await refreshRandomVerse(true);
    } else {
        await refreshRandomVerse(true);
    }
}

async function onNewVerse() {
    if (isLoading) return;
    if (!currentVersesList.length) {
        await refreshRandomVerse(true);
        return;
    }
    const randomVerse = pickRandomVerse(currentVersesList);
    if (randomVerse) displayVerseObject(randomVerse);
    else await refreshRandomVerse(true);
}

// ---------- INITIALISATION ----------
async function initApp() {
    langSelect.addEventListener('change', (e) => onLanguageChange(e.target.value));
    newVerseBtn.addEventListener('click', onNewVerse);

    currentLanguage = 'fr';
    langSelect.value = 'fr';
    showLoadingState();

    try {
        const verses = await getVersesList('fr');
        currentVersesList = verses;
        const randomVerse = pickRandomVerse(currentVersesList);
        if (randomVerse) displayVerseObject(randomVerse);
        else displayMessage("Bienvenue ! Aucun verset trouvé.", false);
    } catch (err) {
        displayMessage("🕊️ Connexion initiale impossible. Rafraîchis ou vérifie ton réseau.", true);
    }

    // Préchargement silencieux des autres langues
    setTimeout(() => {
        ['en', 'mg'].forEach(lang => {
            if (!versesCache[lang]) getVersesList(lang).catch(() => {});
        });
    }, 800);
}

initApp();
