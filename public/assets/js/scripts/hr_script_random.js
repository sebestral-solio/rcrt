// Voice Recognition Setup
const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const quitBtn = document.querySelector(".quit");
const restartBtn = document.querySelector(".restart");
const quizBox = document.querySelector(".quiz_box");
const nextBtn = document.querySelector(".next_btn");
const timerDisplay = document.querySelector(".timer_sec");
const questionText = document.querySelector(".que_text");
const resultBox = document.querySelector(".result_box");
const answerInput = document.getElementById("answer_text");
const startRecordingBtn = document.querySelector(".start_recording");

// User and Job Info
const userEmail = document.getElementById("user_email")?.getAttribute("data-user-email");
const jobId = document.getElementById("company_id")?.getAttribute("data-company-id");

// Questions Array and Randomization
let questions = []; // Placeholder for selected random questions
let currentQuestionIndex = 0;

// Timer
let timer;
let timeLeft = 30; // Start timer with 30 seconds

// Initialize total score
let totalScore = 0;

// Check for browser support of SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one recognition
    recognition.lang = 'en-US'; // Language for recognition
    recognition.interimResults = false; // Don't return partial results
    recognition.maxAlternatives = 1; // Limit to 1 best guess result
}

// Start Recording Button Clicked
startRecordingBtn.addEventListener("click", function () {
    recognition.start(); // Start speech recognition

    startRecordingBtn.textContent = "Recording..."; // Change button text to indicate recording is in progress

    // When speech recognition has a result
    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript; // Get the recognized text
        console.log("Recognized Text:", transcript);

        // Fill the answer input with the recognized text
        answerInput.value = transcript;
        startRecordingBtn.textContent = "Start Recording"; // Reset button text
    };

    // Handle errors
    recognition.onerror = function (event) {
        console.error("Speech Recognition Error:", event.error);
        startRecordingBtn.textContent = "Start Recording"; // Reset button text
    };
});

// Function to shuffle and select random questions
function getRandomQuestions(allQuestions, count) {
    if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        console.error("Error: 'allQuestions' is not a valid array.");
        return [];
    }
    const shuffled = allQuestions.sort(() => Math.random() - 0.5); // Shuffle the array randomly
    return shuffled.slice(0, count); // Return the first 'count' questions
}

// Function to load the current question
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];

        // Check if the question is defined and has a 'question' property
        if (question && question.question) {
            questionText.textContent = question.question; // Display the question text
            document.querySelector(".total_que").textContent = 
                `Question ${currentQuestionIndex + 1} of ${questions.length}`;
            document.getElementById("answer_text").value = ""; // Clear the answer box
            resetTimer(); // Reset the timer for the next question
        } else {
            console.error("Invalid question format or missing question text:", question);
            questionText.textContent = "Error: Unable to load question.";
        }
    } else {
        console.error("Question index out of bounds.");
        questionText.textContent = "No more questions available.";
    }
}

// Function to reset the timer
function resetTimer() {
    timeLeft = 30; // Reset to 30 seconds
    timerDisplay.textContent = timeLeft;

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleNextQuestion(); // Automatically move to the next question when time is up
        }
    }, 1000);
}

// Function to handle the next question
function handleNextQuestion() {
    if (!questions || currentQuestionIndex >= questions.length) {
        console.error("Error: No more questions to handle.");
        return;
    }

    const userAnswer = answerInput.value.trim();
    const question = questions[currentQuestionIndex];

    if (!question || !question.correct_answer) {
        console.error("Error: Invalid question data.", question);
        return;
    }

    // Send data to the backend after each question
    const answerData = {
        user_email: userEmail,
        company_id: jobId,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        question_index: currentQuestionIndex + 1, // Pass the current question index
    };

    console.log("Submitting answer for question:", currentQuestionIndex + 1, answerData);

    fetch("/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData),
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Response from backend:", data);
            if (data.questionScore) {
                totalScore += data.questionScore; // Add the backend-calculated score
            }
            if (currentQuestionIndex + 1 === questions.length) {
                showResult(data);
            } else {
                currentQuestionIndex++; // Increment to the next question
                loadQuestion(); // Load the next question
            }
        })
        .catch((error) => {
            console.error("Error submitting the answer:", error);
        });
}

// Function to show the result
function showResult(data) {
    resultBox.classList.add('activeResult'); // Show the result box
    // Display pass/fail status and allow navigation
    document.querySelector(".congratulations_text")?.classList.remove('hidden');
    document.querySelector(".continue_next_round_btn")?.classList.remove('hidden');
}

// Event Listeners for quiz flow
startBtn.addEventListener("click", () => {
    infoBox.classList.add("activeInfo");
});

quitBtn.addEventListener("click", () => {
    window.location.href = "/";
});

restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    totalScore = 0;
    loadQuestion();
    quizBox.classList.add("activeQuiz");
    resultBox.classList.remove("activeResult");
});

nextBtn.addEventListener("click", () => {
    clearInterval(timer); // Clear the timer to prevent overlap
    handleNextQuestion(); // Move to the next question
});

// Initialize the quiz
function initializeQuiz() {
    if (Array.isArray(allQuestions) && allQuestions.length > 0) {
        currentQuestionIndex = 0; // Start from the first question

        // Fetch 5 random questions from hr_question.js
        questions = getRandomQuestions(allQuestions, 5);

        if (questions.length > 0) {
            loadQuestion(); // Load the first question
            resultBox.classList.remove("activeResult"); // Hide the result box
            quizBox.classList.add("activeQuiz"); // Ensure the quiz box is visible
            infoBox.classList.remove("activeInfo"); // Ensure the info box is hidden
            document.querySelector(".start_btn").style.display = "none"; // Hide the start button
        } else {
            console.error("No questions available after randomization.");
            questionText.textContent = "Error: No questions available.";
        }
    } else {
        console.error("All questions are missing or not properly defined.");
        questionText.textContent = "Error: Unable to initialize the quiz.";
    }
}

// Ensure next button works when timer finishes
function timerFinished() {
    if (timeLeft <= 0) {
        handleNextQuestion(); // Trigger the next question when the timer ends
    }
}
