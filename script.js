// --- 1. SALUTATIONS MULTILINGUES ---
function getGreeting() {
    const lang = navigator.language || navigator.userLanguage;
    const hour = new Date().getHours();
    const greetings = {
        'fr': { day: "Bonjour", night: "Bonsoir" },
        'en': { day: "Good morning", night: "Good evening" },
        'es': { day: "Buenos días", night: "Buenas noches" },
        'de': { day: "Guten Tag", night: "Guten Abend" }
    };
    const shortLang = lang.split('-')[0];
    const selected = greetings[shortLang] || greetings['en'];
    return (hour >= 18 || hour < 5) ? selected.night : selected.day;
}

// --- 2. HORLOGE ---
function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const d = new Date();
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        clockEl.textContent = `${h}:${m}`;
    }
}

// --- 3. METEO ---
async function getWeather() {
    const weatherBox = document.getElementById('weather-box');
    if (!weatherBox) return;
    try {
        // Détection ville par IP
        const res = await fetch('https://ipapi.co/json/').then(r => r.json());
        // Prévision météo par coordonnées
        const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${res.latitude}&longitude=${res.longitude}&current_weather=true`).then(r => r.json());
        weatherBox.textContent = `📍 ${res.city} • ${Math.round(w.current_weather.temperature)}°C`;
    } catch(e) {
        weatherBox.textContent = "📍 Online";
    }
}

// --- 4. INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Init Greeting & Clock
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = getGreeting();
    
    updateClock();
    setInterval(updateClock, 1000);
    getWeather();

    // Recherche (Google Redirection)
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = document.getElementById('query').value;
            if(q) window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
        });
    }

    // Tuiles & Overlay
    const overlay = document.getElementById('search-overlay');
    const frame = document.getElementById('browser-frame');

    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const url = tile.getAttribute('data-url');
            if (url.includes("google.com")) {
                window.location.href = url;
            } else {
                frame.src = url;
                overlay.style.display = 'flex';
            }
        });
    });

    const closeBtn = document.getElementById('close-overlay');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            frame.src = "";
        });
    }

    // Paramètres
    const trigger = document.getElementById('settings-trigger');
    const panel = document.getElementById('settings');
    
    if (trigger && panel) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== trigger) {
                panel.classList.remove('active');
            }
        });
    }

    // Thème & Fond
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('edge-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    const bgBtn = document.getElementById('bg-btn');
    if (bgBtn) {
        bgBtn.addEventListener('click', () => {
            const url = document.getElementById('bgUrl').value;
            if(url) {
                document.body.style.backgroundImage = `url('${url}')`;
                localStorage.setItem('edge-bg', url);
            }
        });
    }

    // Charger préférences sauvegardées
    if(localStorage.getItem('edge-theme') === 'light') document.body.classList.add('light-mode');
    const savedBg = localStorage.getItem('edge-bg');
    if(savedBg) document.body.style.backgroundImage = `url('${savedBg}')`;
});
