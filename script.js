// --- FONCTIONS ---
function openSearch(query) {
    // Redirection vers Google (le mode iframe est souvent bloqué par Google pour sécurité)
    // Mais on garde l'overlay pour les autres tuiles qui l'autorisent
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function openFrame(url) {
    const overlay = document.getElementById('search-overlay');
    const frame = document.getElementById('browser-frame');
    
    // Si c'est Google, on redirige directement car l'iframe sera blanche
    if (url.includes("google.com")) {
        window.location.href = url;
    } else {
        frame.src = url;
        overlay.style.display = 'flex';
    }
}

function closeFrame() {
    document.getElementById('search-overlay').style.display = 'none';
    document.getElementById('browser-frame').src = "";
}

function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const d = new Date();
        clockEl.textContent = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
    }
}

async function getWeather() {
    const weatherBox = document.getElementById('weather-box');
    try {
        const res = await fetch('https://ipapi.co/json/').then(r => r.json());
        const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${res.latitude}&longitude=${res.longitude}&current_weather=true`).then(r => r.json());
        weatherBox.textContent = `📍 ${res.city} • ${Math.round(w.current_weather.temperature)}°C`;
    } catch(e) {
        weatherBox.textContent = "📍 Paris • 18°C";
    }
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateClock, 1000);
    updateClock();
    getWeather();

    // Recherche Google
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = document.getElementById('query').value;
        if(q) openSearch(q);
    });

    // Tuiles
    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('click', () => {
            openFrame(tile.getAttribute('data-url'));
        });
    });

    // Boutons Paramètres
    const trigger = document.getElementById('settings-trigger');
    const panel = document.getElementById('settings');
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });

    document.getElementById('theme-btn').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('edge-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    document.getElementById('bg-btn').addEventListener('click', () => {
        const url = document.getElementById('bgUrl').value;
        if(url) {
            document.body.style.backgroundImage = `url('${url}')`;
            localStorage.setItem('edge-bg', url);
        }
    });

    document.getElementById('close-overlay').addEventListener('click', closeFrame);

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== trigger) {
            panel.classList.remove('active');
        }
    });

    // Charger préférences
    if(localStorage.getItem('edge-theme') === 'light') document.body.classList.add('light-mode');
    const savedBg = localStorage.getItem('edge-bg');
    if(savedBg) document.body.style.backgroundImage = `url('${savedBg}')`;
});