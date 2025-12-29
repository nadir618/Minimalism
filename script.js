// --- GESTION DES LANGUES ---
function getGreeting() {
    const lang = navigator.language || navigator.userLanguage;
    const hour = new Date().getHours();
    
    // Définition des salutations par langue
    const greetings = {
        'fr': { day: "Bonjour", night: "Bonsoir" },
        'en': { day: "Good morning", night: "Good evening" },
        'es': { day: "Buenos días", night: "Buenas noches" },
        'de': { day: "Guten Tag", night: "Guten Abend" },
        'it': { day: "Buongiorno", night: "Buonasera" }
    };

    // On récupère le code de langue court (ex: "fr" au lieu de "fr-FR")
    const shortLang = lang.split('-')[0];
    
    // On choisit la langue ou on prend l'anglais par défaut
    const selected = greetings[shortLang] || greetings['en'];
    
    // On retourne "Bonjour" ou "Bonsoir" selon l'heure (nuit après 18h)
    return (hour >= 18 || hour < 5) ? selected.night : selected.day;
}

// --- INITIALISATION (À mettre dans ton DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // ... tes autres codes ...

    // Mise à jour du message de bienvenue
    const greetingElement = document.querySelector('h1'); // Cible ton <h1>
    if (greetingElement) {
        greetingElement.textContent = getGreeting();
    }
    
    // ... suite du code ...
});
