const questions = [
    {
        question: "Which game popularized the battle royale genre?",
        options: ["Fornite", "PUBG", "Apex Legends", "H1Z1"],
        answer: "B",
        explanation: "PUBG (PlayerUnknown’s Battlegrounds) was one of the first games to popularize the battle royale format, inspiring many others like Fortnite and Apex Legends."
    },
    {
        question: "In Among Us, what is the role of the player who tries to sabotage the crew?",
        options: ["Imposter", "Crewmate", "Detective", "Engineer"],
        answer: "A",
        explanation: "The Impostor’s job is to sabotage and eliminate crewmates without getting caught."
    },
    {
        question: "Which console is made by Microsoft?",
        options: ["PlayStation", "Nintendo Switch", "Xbox", "Sega Genesis"],
        answer: "C",
        explanation: "Xbox is Microsoft’s gaming console brand."
    },
    {
        question: "Which game features a blue hedgehog who runs very fast?",
        options: ["Mario Kart", "Pac-Man", "Sonic The Hedgehog", "Donkey Kong"],
        answer: "C",
        explanation: "Sonic is a blue hedgehog known for his incredible speed."
    },
    {
        question: "Which game lets you catch creatures called Pokémon?",
        options: ["Animal Crossing", "Roblox", "Stardew Valley", "Pokémon GO"],
        answer: "D",
        explanation: "Pokémon GO uses real-world locations to let players catch Pokémon."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = new Array(questions.length).fill(null);
let timerInterval;
let timeLeft = 20;

const startButton = document.getElementById("start-quiz");
const quizContent = document.getElementById("quiz-content");
const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const optionsContainer = document.getElementById("options-container");
const scoreDisplay = document.getElementById("score").querySelector("span");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const resetButton = document.getElementById("reset");
const finalScoreDisplay = document.getElementById("final-score");
const timerDisplay = document.getElementById("timer").querySelector("span");
const reviewScreen = document.getElementById("review-screen");
const downloadBtn = document.getElementById("download-btn");
const resultActions = document.querySelector(".result-actions");

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", moveToNextQuestion);
prevButton.addEventListener("click", moveToPreviousQuestion);
resetButton.addEventListener("click", resetQuiz);
downloadBtn.addEventListener("click", downloadResults);

function startQuiz() {
    startButton.style.display = "none";
    quizContent.style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);

    if (!selectedAnswers[currentQuestionIndex]) {
        startTimer();
    }

    optionsContainer.innerHTML = "";
    finalScoreDisplay.style.display = "none";
    reviewScreen.style.display = "none";
    resultActions.style.display = "none";

    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    const labels = ["A", "B", "C", "D"];
    currentQuestion.options.forEach((option, index) => {
        const optionBox = document.createElement("div");
        optionBox.className = "option-box";

        const abcdBox = document.createElement("div");
        abcdBox.className = "abcd-box";
        abcdBox.textContent = labels[index];

        const optionText = document.createElement("div");
        optionText.className = "option-text";
        optionText.textContent = option;

        optionBox.appendChild(abcdBox);
        optionBox.appendChild(optionText);
        optionsContainer.appendChild(optionBox);

        if (selectedAnswers[currentQuestionIndex] === labels[index]) {
            optionBox.classList.add(labels[index] === currentQuestion.answer ? "correct" : "incorrect");
            optionBox.classList.add("disabled");
        }

        optionBox.addEventListener("click", () => selectAnswer(labels[index], currentQuestion.answer, optionBox));
    });

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
}

function startTimer() {
    timeLeft = 20;
    timerDisplay.textContent = timeLeft;
    document.getElementById("timer").style.color = "";

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 5) {
            document.getElementById("timer").style.color = "#f44336";
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function selectAnswer(selectedOption, correctAnswer, optionElement) {
    if (selectedAnswers[currentQuestionIndex]) return;

    clearInterval(timerInterval);
    selectedAnswers[currentQuestionIndex] = selectedOption;

    const allOptions = document.querySelectorAll(".option-box");
    allOptions.forEach(opt => opt.classList.add("disabled"));

    optionElement.classList.add(selectedOption === correctAnswer ? "correct" : "incorrect");

    if (selectedOption !== correctAnswer) {
        const correctIndex = ["A", "B", "C", "D"].indexOf(correctAnswer);
        allOptions[correctIndex].classList.add("correct");
    }

    updateScore();
}

function updateScore() {
    score = selectedAnswers.reduce((total, answer, idx) =>
        answer === questions[idx].answer ? total + 1 : total, 0);
    scoreDisplay.textContent = score;
}

function moveToNextQuestion() {
    if (!selectedAnswers[currentQuestionIndex] && timeLeft > 0) {
        alert("Please select an answer before proceeding!");
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

function moveToPreviousQuestion() {
    clearInterval(timerInterval);
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function handleTimeOut() {
    if (!selectedAnswers[currentQuestionIndex]) {
        alert("Time's up! This question will be marked as unanswered.");
        selectedAnswers[currentQuestionIndex] = "TIMEOUT";

        const allOptions = document.querySelectorAll(".option-box");
        allOptions.forEach(opt => opt.classList.add("disabled"));
        questionText.innerHTML += '<div class="timeout-marker">(Time Expired)</div>';
    }
    moveToNextQuestion();
}

function showFinalScore() {
    // Clear and hide the timer
    clearInterval(timerInterval);
    document.getElementById("timer").style.display = "none";

    questionText.style.display = "none";
    questionNumber.style.display = "none";
    optionsContainer.innerHTML = "";
    prevButton.style.display = "none";
    nextButton.style.display = "none";

    const percentage = score;
    let message = "";

    if (percentage == 5) message = "Excellent!";
    else if (percentage == 4) message = "Good job!";
    else if (percentage == 3) message = "Not bad!";
    else message = "Try Again!";

    finalScoreDisplay.innerHTML = `
        <div class="completion-header">Quiz Completed</div>
        <div class="score-display">${message}</div>
        <div class="score-display">Your Score: <strong>${score}</strong></div>
    `;
    finalScoreDisplay.style.display = "block";

    showReviewScreen();
    resultActions.style.display = "flex";

    if (percentage >= 60) {
        generateConfetti();
    }
}

function showReviewScreen() {
    reviewScreen.innerHTML = "<h3>Review Your Answers:</h3>";
    reviewScreen.style.display = "block";

    questions.forEach((question, index) => {
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-item";

        const userAnswer = selectedAnswers[index];
        const isCorrect = userAnswer === question.answer;

        if (isCorrect) {
            reviewItem.classList.add("correct");
        } else if (userAnswer) {
            reviewItem.classList.add("incorrect");
        }

        reviewItem.innerHTML = `
            <strong>Q${index + 1}:</strong> ${question.question}<br>
            <span class="${isCorrect ? 'correct-text' : 'incorrect-text'}">
                Your Answer: ${userAnswer || "Not Answered"}
            </span><br>
            <span class="correct-text">Correct Answer: ${question.answer}</span><br>
            <em>${question.explanation}</em>
        `;

        reviewScreen.appendChild(reviewItem);
    });
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = new Array(questions.length).fill(null);

    // Reset timer display
    document.getElementById("timer").style.display = "";

    scoreDisplay.textContent = "0";
    finalScoreDisplay.style.display = "none";
    reviewScreen.style.display = "none";
    resultActions.style.display = "none";
    questionNumber.style.display = "block";
    prevButton.style.display = "inline-block";
    nextButton.style.display = "inline-block";
    nextButton.textContent = "Next";
    questionText.style.display = "block";

    startButton.style.display = "block";
    quizContent.style.display = "none";
}

function downloadResults() {
    let content = `Quiz Results\n\n`;
    content += `Final Score: ${score}\n\n`;

    questions.forEach((q, idx) => {
        const userAnswer = selectedAnswers[idx] || "Not Answered";
        const isCorrect = userAnswer === q.answer;

        content += `Question ${idx + 1}: ${q.question}\n`;
        content += `Your Answer: ${userAnswer} ${isCorrect ? '✓' : '✗'}\n`;
        content += `Correct Answer: ${q.answer}\n`;
        content += `Explanation: ${q.explanation}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz_results_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateConfetti() {
    const defaults = {
        spread: 70,
        ticks: 100,
        gravity: 0.5,
        decay: 0.94,
        startVelocity: 30,
        colors: ['#4361ee', '#3f37c9', '#4cc9f0', '#f72585', '#f8961e'],
        particleCount: 50,
        scalar: 1.2
    };

    confetti({
        ...defaults,
        particleCount: 100
    });

    setTimeout(() => {
        confetti({
            ...defaults,
            particleCount: 50,
            scalar: 1.5,
            angle: 60,
            spread: 55
        });
        confetti({
            ...defaults,
            particleCount: 50,
            scalar: 1.5,
            angle: 120,
            spread: 55
        });
    }, 150);
}