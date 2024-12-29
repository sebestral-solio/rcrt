
const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const quitBtn = document.querySelector(".quit");
const restartBtn = document.querySelector(".restart");
const quizBox = document.querySelector(".quiz_box");
const nextBtn = document.querySelector(".next_btn");
const timerDisplay = document.querySelector(".timer_sec");
const questionText = document.querySelector(".que_text");
const resultBox = document.querySelector(".result_box");
const userEmail = document.getElementById("user_email").getAttribute("data-user-email");
const jobId = document.getElementById("company_id").getAttribute("data-company-id");

// Array to store the current question index
let currentQuestionIndex = 0;

// Timer
let timer;
let timeLeft = 60;

// Initialize total score
let totalScore = 0;

// Function to shuffle and pick random questions
function getRandomQuestions(allQuestions, count) {
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Sample stop words list (can be expanded as needed)
const stopWords = new Set([
    "a", "an", "the", "in", "on", "for", "of", "and", "to", "is", "it", "this", "that",
    "by", "with", "as", "at", "from", "be", "are", "was", "were", "has", "have", "had",
    "into", "up", "he", "she", "they", "them", "us", "him", "her", "I", "you", "we",
    "although", "because", "while", "where", "if", "until", "unless", "some", "any",
    "every", "each", "few", "many", "much", "no", "all", "another", "do", "does",
    "did", "doing", "done", "after", "before", "during", "under", "over", "between",
    "across", "through", "without", "very", "really", "quite", "just", "still", "perhaps",
    "even", "however", "not", "now", "then", "too", "more", "less", "quite", "such",
    "either", "neither"
]);

// Function to preprocess and remove stop words
function preprocessAnswer(answer) {
    return answer
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .filter(word => !stopWords.has(word))
        .filter(word => word.trim() !== "")
        .map(word => word.trim());
}

// Questions (assume this comes from a script like `tech_questions.js`)
console.log("Loaded questions from tech_questions.js:", allQuestions);

// Select 20 random questions
const questions = getRandomQuestions(allQuestions, 4);
console.log("Selected 10 random technical questions:", questions);

// Function to load the current question
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    document.querySelector(".total_que").textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById("answer_text").value = ""; // Clear the answer box
    resetTimer();
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

// Jaccard Similarity function
function jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / set2.size;
}

// Function to handle the next question
function handleNextQuestion() {
    const answer = document.getElementById("answer_text").value.trim();
    const question = questions[currentQuestionIndex];

    // Preprocess both user's answer and correct answer
    const processedUserAnswer = preprocessAnswer(answer);
    const processedCorrectAnswer = preprocessAnswer(question.correct_answer);

    console.log("Preprocessed User Answer:", processedUserAnswer);
    console.log("Preprocessed Correct Answer:", processedCorrectAnswer);

    // Calculate score based on Jaccard Similarity
    const similarity = jaccardSimilarity(processedUserAnswer, processedCorrectAnswer);
    const score = similarity * 100; // Use Jaccard similarity percentage as score
    totalScore += score; // Increment total score

    console.log(`Answer: ${answer}, Correct Answer: ${question.correct_answer}, Score: ${score}`);

    // Send the total score to the backend after all questions
    if (currentQuestionIndex + 1 === questions.length) {
        submitTotalScore();
    } else {
        // Otherwise, move to the next question
        currentQuestionIndex++;
        loadQuestion();
    }
}

// Function to submit total score to the backend
function submitTotalScore() {
    const maxScore = questions.length * 100; // Calculate max score based on total questions
    const answerData = {
        user_email: userEmail,
        company_id: jobId,
        total_score: totalScore,
        max_score: maxScore // Send the calculated max score
    };

    console.log("Submitting total score:", answerData);

    // Send the total score to the backend
    fetch("/technical", {
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
            showResult(data);
        })
        .catch((error) => {
            console.error("Error submitting the total score:", error);
        });
}

// Show result based on the server response
function showResult(data) {
    const resultBox = document.querySelector('.result_box');
    const congratulationsText = document.querySelector('.congratulations_text');
    const continueNextRoundBtn = document.querySelector('.continue_next_round');
    const betterLuckText = document.querySelector('.better_luck_text');
    const exitBtn = document.querySelector('.exit_btn');
    const waitText = resultBox.querySelector(".wait_text");

    resultBox.classList.add('activeResult'); // Show the result box

    // Initially show the wait text and hide other elements
    waitText.classList.remove('hidden');
    congratulationsText.classList.add('hidden');
    continueNextRoundBtn.classList.add('hidden');
    betterLuckText.classList.add('hidden');
    exitBtn.classList.add('hidden');

    // After 5 seconds, display the result
    setTimeout(() => {
        waitText.classList.add('hidden'); // Hide the wait text

        if (data.passed) {
            // Show the congratulations message and next round button
            congratulationsText.classList.remove('hidden');
            continueNextRoundBtn.classList.remove('hidden');
        } else {
            // Show the better luck next time message and exit button
            betterLuckText.classList.remove('hidden');
            exitBtn.classList.remove('hidden');
        }

        // Add the event listener here after the button becomes visible
        exitBtn.addEventListener('click', () => {
            window.location.href = '/'; // Redirect to the dashboard
        });
    }, 5000); // 5-second delay

    // Event listener for continue button
    continueNextRoundBtn.addEventListener("click", () => {
        const queryParams = new URLSearchParams({
          user_email: userEmail,
          company_id: jobId,
        }).toString();
      
        // window.location.href = `/hr?${queryParams}`; // Redirect to the next round with query parameters
        window.location.href = `/coding?${queryParams}`; // Redirect to the next round with query parameters
      });
}

// Start Quiz button clicked
startBtn.addEventListener("click", () => {
    infoBox.classList.add("activeInfo"); // Show rules
    document.querySelector(".start_btn").style.display = "none"; // Hide the start button
});

// Exit Quiz button clicked
quitBtn.addEventListener("click", () => {
    window.location.href = "/"; // Redirect to the dashboard
});

// Continue Quiz button clicked
restartBtn.addEventListener("click", () => {
    infoBox.classList.remove("activeInfo"); // Hide the rules box
    quizBox.classList.add("activeQuiz"); // Show the quiz box
    initializeQuiz(); // Reset and start the quiz
});

// Save and Next button clicked
nextBtn.addEventListener("click", () => {
    clearInterval(timer); // Stop the timer
    handleNextQuestion(); // Process the current question and move to the next
});

// Initialize the quiz
function initializeQuiz() {
    currentQuestionIndex = 0; // Start from the first question
    loadQuestion(); // Load the first question
    resultBox.classList.remove("activeResult"); // Hide the result box
    quizBox.classList.add("activeQuiz"); // Ensure the quiz box is visible
    infoBox.classList.remove("activeInfo"); // Ensure the info box is hidden
    document.querySelector(".start_btn").style.display = "none"; // Ensure the start button is hidden
}
