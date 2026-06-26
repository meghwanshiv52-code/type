 // ==========================================
// 📚 MASTER POOL (Base Paragraphs for Generator)
// ==========================================
const basePool = [
    {
        hindi: "हमारा देश महान स्त्रियों और पुरुषों का देश है जिन्होंने देश के लिए ऐसे आदर्श कार्य किए हैं जिन्हें भारतवासी सदा याद रखेंगे। कई महापुरुषों ने हमारी आजादी की लड़ाई में अपना सब कुछ अर्पण कर दिया।",
        english: "Our country is a land of great men and women who have done such exemplary deeds for the nation that Indians will always remember them. Many great men sacrificed everything in our freedom struggle."
    },
    {
        hindi: "याचिकाकर्ता की ओर से उपस्थित विद्वान अधिवक्ता ने तर्क दिया कि अधीनस्थ न्यायालय का निर्णय साक्ष्यों के विपरीत है। धारा 144 के तहत जारी आदेश को निरस्त किया जाना चाहिए क्योंकि यह अधिकारों का हनन है।",
        english: "The learned counsel appearing for the petitioner argued that the judgment of the subordinate court is contrary to the evidence. The order issued under Section 144 must be quashed as it violates rights."
    },
    {
        hindi: "सफलता केवल कठिन परिश्रम और निरंतर अभ्यास से ही संभव है। सरकारी नौकरी प्राप्त करने के लिए आपको मानसिक रूप से मजबूत होना पड़ेगा और अपनी गलतियों से सीखना होगा। प्रतिदिन सुबह उठकर टाइपिंग करें।",
        english: "Success is possible only through hard work and continuous practice. To get a government job, you have to be mentally strong and learn from your mistakes. Practice typing every morning."
    },
    {
        hindi: "अभियुक्त को भारतीय दंड संहिता की धारा 302 और 34 के तहत दोषी ठहराया गया है। जमानत याचिका को खारिज करते हुए न्यायालय ने कहा कि अपराध अत्यंत गंभीर प्रकृति का है और साक्ष्यों से छेड़छाड़ संभव है।",
        english: "The accused has been convicted under sections 302 and 34 of the Indian Penal Code. Rejecting the bail plea, the court stated that the offense is of a very serious nature and tampering with evidence is possible."
    },
    {
        hindi: "विवादित संपत्ति का मालिकाना हक वादी के पास है। प्रतिवादी ने फर्जी दस्तावेजों के आधार पर कब्जा करने का प्रयास किया था, जिसे अवैध घोषित किया जाता है। प्रशासन को बेदखली के आदेश दिए जाते हैं।",
        english: "The ownership of the disputed property lies with the plaintiff. The defendant attempted to take possession on the basis of forged documents, which is declared illegal. Eviction orders are given to the administration."
    }
];

// ==========================================
// ⚙️ THE 450 EXERCISE AUTO-GENERATOR
// ==========================================
const exercises = [];

// YEH LOOP EXACT 450 EXERCISES BANAYEGA
for (let i = 1; i <= 450; i++) {
    let type = (i % 2 === 0) ? "Legal Court Matter" : "Normal Exam Matter";
    let baseText = basePool[i % basePool.length]; 
    
    exercises.push({
        id: i,
        title: `Exercise ${i} - ${type}`,
        hindi: baseText.hindi,
        english: baseText.english
    });
}

// ==========================================
// ⚙️ SYSTEM LOGIC (DASHBOARD & TYPING)
// ==========================================
const dashboardScreen = document.getElementById('dashboardScreen');
const testScreen = document.getElementById('testScreen');
const exerciseList = document.getElementById('exerciseList');
const textContainer = document.getElementById('textContainer');
const typingInput = document.getElementById('typingInput');
const timerVal = document.getElementById('timerVal');
const testTitle = document.getElementById('testTitle');
const timeSelect = document.getElementById('timeSelect');

let currentText = "", originalWords = [], typedWords = [];
let timerDuration = 600, timeRemaining = 600, timerId = null, isRunning = false;
let currentLang = 'english'; 

function loadDashboard() {
    exerciseList.innerHTML = "";
    // Creates 450 rows in the UI
    exercises.forEach((ex, index) => {
        let row = document.createElement('div');
        row.className = 'exercise-row';
        row.innerHTML = `
            <div class="ex-title">${ex.title}</div>
            <div class="btn-group">
                <button class="btn-english" onclick="startTest(${index}, 'english')">English</button>
                <button class="btn-hindi" onclick="startTest(${index}, 'hindi')">Hindi</button>
            </div>
        `;
        exerciseList.appendChild(row);
    });
}

function startTest(index, lang) {
    dashboardScreen.style.display = "none";
    testScreen.style.display = "block";
    currentLang = lang;
    
    let ex = exercises[index];
    testTitle.innerText = ex.title + " (" + lang.toUpperCase() + ")";
    currentText = lang === 'hindi' ? ex.hindi : ex.english;
    
    if(lang === 'hindi') {
        textContainer.style.fontFamily = "'Mangal', Arial, sans-serif";
        typingInput.style.fontFamily = "'Mangal', Arial, sans-serif";
    } else {
        textContainer.style.fontFamily = "Arial, sans-serif";
        typingInput.style.fontFamily = "Arial, sans-serif";
    }
    
    resetEngine();
}

function goBack() {
    clearInterval(timerId);
    testScreen.style.display = "none";
    dashboardScreen.style.display = "block";
}

function resetEngine() {
    clearInterval(timerId);
    isRunning = false;
    typingInput.value = "";
    typingInput.disabled = false;
    
    originalWords = currentText.trim().split(/\s+/);
    typedWords = [];
    renderText(0);
    
    timerDuration = parseInt(timeSelect.value);
    timeRemaining = timerDuration;
    updateTimerDisplay();
    document.getElementById('wpmVal').innerText = "0 WPM";
    document.getElementById('netWpmVal').innerText = "0 WPM";
    document.getElementById('accuracyVal').innerText = "100%";
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

typingInput.addEventListener('input', function() {
    if(!isRunning && typingInput.value.trim().length > 0) {
        isRunning = true;
        timerId = setInterval(() => {
            timeRemaining--; updateTimerDisplay(); calculateLiveStats();
            if(timeRemaining <= 0) {
                clearInterval(timerId); typingInput.disabled = true; isRunning = false;
                alert("🏁 Test Time Over!");
            }
        }, 1000);
    }
    
    let val = typingInput.value;
    if(val.endsWith(" ")) {
        let word = val.trim();
        if(word.length > 0) {
            typedWords.push(word); typingInput.value = "";
            renderText(typedWords.length); calculateLiveStats();
        }
    }
});

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
    
    document.getElementById('wpmVal').innerText = (grossWpm > 0 ? grossWpm : 0) + " WPM";
    document.getElementById('netWpmVal').innerText = (netWpm > 0 ? netWpm : 0) + " WPM";
    document.getElementById('accuracyVal').innerText = accuracy + "%";
}

timeSelect.addEventListener('change', resetEngine);
window.onload = loadDashboard;