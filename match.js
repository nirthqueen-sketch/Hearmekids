// match.js - لعبة مطابقة الكلمات مع شخصية عمر

// ----------------------------------------------------------------
// الأصوات
const correctSound = new Audio('correct.wav');
const wrongSound   = new Audio('wrong.wav');

// ----------------------------------------------------------------
// رسائل شخصية عمر
const correctMessages = [
    "برافو يا بطل 👏",
    "شطووور قوي!",
    "إجابة صح 👌"
];

const wrongMessages = [
    "ولا يهمك 😊 جرّب تاني",
    "قريب جدًا"
];

let omarMessage;

// ----------------------------------------------------------------
// بيانات اللعبة
const matchData = [
    { word: "تفاحه", image: "apple.jpg" },
    { word: "قلم", image: "pencil.png" },
    { word: "كوب", image: "cup.jpg" },
    { word: "كرة", image: "ball.jpg" },
    { word: "كتاب", image: "book.jpg" },
];

let currentMatch = {};

document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    omarMessage = document.getElementById('omar-message');

    const challengeWordP = document.createElement('p');
    challengeWordP.id = 'challenge-word';
    gameArea.before(challengeWordP);

    // ----------------------------------------------------------------
    // بدء جولة جديدة
    const startNewRound = () => {
        gameArea.innerHTML = ''; 
        if (omarMessage) omarMessage.textContent = "ركز كده وشوف الصح 😊";

        const randomIndex = Math.floor(Math.random() * matchData.length);
        currentMatch = matchData[randomIndex];
        
        challengeWordP.textContent = `أي صورة تمثل: ${currentMatch.word}؟`;
        
        let options = [currentMatch];
        const wrongOptions = matchData.filter(item => item.word !== currentMatch.word);

        for (let i = 0; i < 2 && wrongOptions.length > 0; i++) {
            const randomWrongIndex = Math.floor(Math.random() * wrongOptions.length);
            options.push(wrongOptions.splice(randomWrongIndex, 1)[0]);
        }

        options.sort(() => Math.random() - 0.5);

        options.forEach(option => {
            const imgButton = document.createElement('img');
            imgButton.src = option.image;
            imgButton.alt = option.word;
            imgButton.dataset.word = option.word;
            imgButton.classList.add('match-option');
            
            imgButton.addEventListener('click', checkAnswer);
            gameArea.appendChild(imgButton);
        });
    };

    // ----------------------------------------------------------------
    // التحقق من الإجابة
    const checkAnswer = (e) => {
        const selectedWord = e.target.dataset.word;

        if (selectedWord === currentMatch.word) {
            correctSound.currentTime = 0;
            correctSound.play();

            if (omarMessage) {
                omarMessage.textContent =
                    correctMessages[Math.floor(Math.random() * correctMessages.length)];
            }

            challengeWordP.textContent = `✅ صحيح! هذه هي صورة ${currentMatch.word}.`;
            e.target.style.border = '4px solid green';
            saveWordToReview(currentMatch.word, "لعبة مطابقة");
            addCoins(10); // إضافة 10 كوينز عند الإجابة الصحيحة

        } else {
            wrongSound.currentTime = 0;
            wrongSound.play();

            if (omarMessage) {
                omarMessage.textContent =
                    wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
            }

            challengeWordP.textContent = `❌ خطأ. هذه صورة ${selectedWord}. حاول مرة أخرى.`;
            e.target.style.border = '4px solid red';
        }

        document.querySelectorAll('.match-option')
            .forEach(img => img.removeEventListener('click', checkAnswer));

        setTimeout(startNewRound, 2000);
    };

    // ----------------------------------------------------------------
    startNewRound();
});
