const englishParagraphs = [
    "The High Court of Rajasthan requires top level steno speeds. Honesty and precise transcription are essential assets for an official reporter. Practice everyday on computer keyboards with strict discipline to secure your recruitment cutoff marks.",
    "Stenography is an art of writing in shorthand format. A skilled computer operator can transcribe dense data smoothly. Do not look down at keys during your typing evaluation. Speed and absolute accuracy are calculated simultaneously."
];

const hindiParagraphs = [
    "राजस्थान उच्च न्यायालय में आशुलिपिक भर्ती परीक्षा के लिए गति एवं शुद्धता का अत्यंत महत्व है। नियमित अभ्यास ही सफलता की एकमात्र कुंजी है। टाइपिंग करते समय अपना ध्यान पूरी तरह स्क्रीन पर केंद्रित रखें।",
    "सफलता केवल कठिन परिश्रम और निरंतर अभ्यास से ही संभव है। प्रतिदिन सुबह चार बजे उठकर अपनी क्लास और स्टेनो टेस्ट को समय पर पूरा करें ताकि मेरिट लिस्ट में आपका नाम शीर्ष पर आ सके।"
];

let timerDuration = 60, timeRemaining = 60, timerId = null, isRunning = false;
let originalWords = [], typedWords = [], currentLanguage = 'en';

const textContainer = document.getElementById('textContainer');
const typingInput = document.getElementById('typingInput');
const timerVal = document.getElementById('timerVal');
const wpmVal = document.getElementById('wpmVal');
const netWpmVal = document.getElementById('netWpmVal');
const accuracyVal = document.getElementById('accuracyVal');
const fontSelect = document.getElementById('fontSelect');

function updateLayout() {
    currentLanguage = document.getElementById('langSelect').value;
    fontSelect.value = (currentLanguage === 'hi') ? "'Kruti Dev 010', 'Devlys 010', Arial" : "Arial, sans-serif";
    applyFont();
    resetEngine();
}

function applyFont() {
    textContainer.style.fontFamily = fontSelect.value;
    typingInput.style.fontFamily = fontSelect.value;
}

function resetEngine() {
    clearInterval(timerId);
    isRunning = false;
    typingInput.value = "";
    typingInput.disabled = true;
    document.getElementById('actionBtn').innerText = "START FRESH TEST";
    document.getElementById('actionBtn').style.backgroundColor = "#2ed573";
    
    let para = (currentLanguage === 'en') ? englishParagraphs[Math.floor(Math.random() * englishParagraphs.length)] : hindiParagraphs[Math.floor(Math.random() * hindiParagraphs.length)];
    originalWords = para.trim().split(/\s+/);
    renderText(0);
    
    timerDuration = parseInt(document.getElementById('timeSelect').value);
    timeRemaining = timerDuration;
    updateTimerDisplay();
    wpmVal.innerText = "0 WPM";
    netWpmVal.innerText = "0 WPM";
    accuracyVal.innerText = "100%";
}

function renderText(currentIndex) {
    let html = "";
    for(let i=0; i<originalWords.length; i++) {
        if(i === currentIndex) { html += `<span class="word-highlight">${originalWords[i]}</span> `; }
        else if(i < currentIndex) {
            html += (typedWords[i] === originalWords[i]) ? `<span class="word-correct">${originalWords[i]}</span> ` : `<span class="word-incorrect">${originalWords[i]}</span> `;
        } else { html += `<span>${originalWords[i]}</span> `; }
    }
    textContainer.innerHTML = html;
}

function updateTimerDisplay() {
    let mins = Math.floor(timeRemaining / 60), secs = timeRemaining % 60;
    timerVal.innerText = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
}

function toggleTest() {
    if(isRunning) { resetEngine(); }
    else {
        isRunning = true; typingInput.disabled = false; typingInput.value = ""; typingInput.focus();
        timerDuration = parseInt(document.getElementById('timeSelect').value); timeRemaining = timerDuration;
        document.getElementById('actionBtn').innerText = "RESET SYSTEM"; document.getElementById('actionBtn').style.backgroundColor = "#ff4757";
        typedWords = []; renderText(0);
        
        clearInterval(timerId);
        timerId = setInterval(() => {
            timeRemaining--; updateTimerDisplay(); calculateLiveStats();
            if(timeRemaining <= 0) {
                clearInterval(timerId); typingInput.disabled = true; isRunning = false;
                alert("🏁 Final Scores are locked!");
            }
        }, 1000);
    }
}

if(typingInput) {
    typingInput.addEventListener('keydown', function(e) {
        if(e.key === 'Backspace' && document.getElementById('strictBackspace').checked) e.preventDefault();
    });

    typingInput.addEventListener('input', function() {
        let val = typingInput.value;
        if(val.endsWith(" ")) {
            let word = val.trim();
            if(word.length > 0) {
                typedWords.push(word); typingInput.value = "";
                renderText(typedWords.length); calculateLiveStats();
            }
        }
    });
}

function calculateLiveStats() {
    let elapsedMins = (timerDuration - timeRemaining) / 60;
    if(elapsedMins <= 0) elapsedMins = 1/60;
    let totalCharsTyped = 0, correctWords = 0;
    for(let i=0; i<typedWords.length; i++) {
        totalCharsTyped += typedWords[i].length + 1;
        if(typedWords[i] === originalWords[i]) correctWords++;
    }
    let grossWpm = Math.round((totalCharsTyped / 5) / elapsedMins);
    let netWpm = Math.round(grossWpm - ((typedWords.length - correctWords) / elapsedMins));
    let accuracy = typedWords.length > 0 ? Math.round((correctWords / typedWords.length) * 100) : 100;
    wpmVal.innerText = (isNaN(grossWpm) || grossWpm < 0 ? 0 : grossWpm) + " WPM";
    netWpmVal.innerText = (isNaN(netWpm) || netWpm < 0 ? 0 : netWpm) + " WPM";
    accuracyVal.innerText = accuracy + "%";
}