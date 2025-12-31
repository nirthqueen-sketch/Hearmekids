// speak.js - لعبة نطق الكلمة (مع شخصية عمر)

// ================== الأصوات ==================
const correctSound = new Audio('correct.wav');
const wrongSound   = new Audio('wrong.wav');

// ================== شخصية عمر ==================
const omarMessageEl = document.getElementById('omar-message');

const Omar = {
    intro: [
        'اسمع الكلمة وقولها زي ما أنا بقولها 😊',
        'جاهز نلعب؟ يلا بينا 😄'
    ],
    correct: [
        'برافو يا بطل 👏',
        'شطووور قوي!',
        'إجابة صح 👌'
    ],
    wrong: [
        'ولا يهمك 😊 جرّب تاني',
        'قريب جدًا!'
    ],
    say(type) {
        if (!omarMessageEl) return;
        const arr = this[type];
        const msg = arr[Math.floor(Math.random() * arr.length)];
        omarMessageEl.textContent = msg;
    }
};

// ================== النطق ==================
const speakWord = (text) => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    speechSynthesis.speak(utterance);
};

// ================== كلمات اللعبة ==================
const pronunciationWords = [
    "مكتبه", "عائله", "طائره", "مستشفى", "سياره", "كمبيوتر", "موز"
];

let currentWord = '';
let lastSpokenText = '';

// ================== التعرف على الصوت ==================
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

document.addEventListener('DOMContentLoaded', () => {
    const playWordBtn = document.getElementById('play-word');
    const startSpeakingBtn = document.getElementById('start-speaking');
    const spokenWordOutput = document.getElementById('spoken-word');
    const checkBtn = document.getElementById('startGame');

    const challengeWord = document.createElement('p');
    challengeWord.id = 'challenge-word';
    challengeWord.style.fontSize = '22px';
    challengeWord.style.fontWeight = 'bold';
    spokenWordOutput.before(challengeWord);

    // أول رسالة من عمر
    Omar.say('intro');

    const startNewRound = () => {
        currentWord =
            pronunciationWords[Math.floor(Math.random() * pronunciationWords.length)];
        challengeWord.textContent = `الكلمة المطلوبة: [ ${currentWord} ]`;
        spokenWordOutput.textContent = 'هنا سيظهر كلامك بعد التسجيل';
        lastSpokenText = '';
        checkBtn.disabled = true;
        Omar.say('intro');
    };

    playWordBtn.addEventListener('click', () => {
        speakWord(currentWord);
    });

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';

        startSpeakingBtn.addEventListener('click', () => {
            recognition.start();
            startSpeakingBtn.textContent = '🎤 جاري التسجيل...';
        });

        recognition.onresult = (e) => {
            lastSpokenText = e.results[0][0].transcript.trim();
            spokenWordOutput.textContent = `نطقك: ${lastSpokenText}`;
            startSpeakingBtn.textContent = '🎤 ابدأ التحدث';
            checkBtn.disabled = false;
        };

        recognition.onerror = () => {
            spokenWordOutput.textContent = 'حصل خطأ في التسجيل';
            startSpeakingBtn.textContent = '🎤 ابدأ التحدث';
        };

        checkBtn.addEventListener('click', () => {
            if (lastSpokenText === currentWord) {
                correctSound.play();
                Omar.say('correct');
                saveWordToReview(currentWord, 'لعبة نطق');
                addCoins(10); // إضافة 10 كوينز عند الإجابة الصحيحة
            } else {
                wrongSound.play();
                Omar.say('wrong');
            }
            setTimeout(startNewRound, 2500);
        });
    } else {
        spokenWordOutput.textContent =
            'المتصفح لا يدعم التعرف على الصوت';
    }

    startNewRound();
});
