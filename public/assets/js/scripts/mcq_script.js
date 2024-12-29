
const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const quitBtn = document.querySelector(".quit");
const restartBtn = document.querySelector(".restart");
const quizBox = document.querySelector(".quiz_box");
const nextBtn = document.querySelector(".next_btn");
const timerDisplay = document.querySelector(".timer_sec");
const questionText = document.querySelector(".que_text");
const optionList = document.querySelector(".option_list");
const resultBox = document.querySelector(".result_box");
const leaderboardBtn = document.querySelector(".leaderboard");

// Get the email from the user_email div
const userEmail = document.getElementById("user_email").getAttribute("data-user-email");
const jobId = document.getElementById("company_id").getAttribute("data-company-id");

let currentQuestion = 0;
let timeLeft = 15;
let score = 0;
let timer;
let optionSelectedFlag = false; // Flag to check if an option was selected
// let questions = []; // Placeholder for the selected 20 questions

function getRandomQuestions(allQuestions, count) {
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  // Assuming 'allQuestions' comes from mcq_question.js
  questions = getRandomQuestions(allQuestions, 4); // Directly assign to the already declared questions
  console.log("Loaded questions:", questions);

// Start Quiz button clicked
startBtn.addEventListener("click", () => {
  infoBox.classList.add("activeInfo"); // Show rules
});

// Exit Quiz button clicked
quitBtn.addEventListener("click", () => {
  window.location.href = "/"; // Redirect to the home page
});

// Continue Quiz button clicked
restartBtn.addEventListener("click", () => {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");
  loadQuestion();
  startTimer();
});

// Next Question button clicked
nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    if (optionSelectedFlag) {
      currentQuestion++;
      loadQuestion();
      resetTimer();
      optionSelectedFlag = false; // Reset the flag for the next question
    } else {
      alert("Please select an option to proceed.");
    }
  } else {
    showResult();
  }
});

// Load question and options
function loadQuestion() {
  const current = questions[currentQuestion];
  questionText.textContent = current.question;
  optionList.innerHTML = "";
  current.options.forEach((option, index) => {
    optionList.innerHTML += `
      <div class="option" onclick="optionSelected(event, ${index})">
        <span>${option}</span>
      </div>
    `;
  });
  nextBtn.classList.remove("show"); // Hide the next button initially
}

// Option selected by the user
function optionSelected(event, selectedOptionIndex) {
  const options = optionList.querySelectorAll(".option");

  // Disable all options after selection
  options.forEach((option) => option.classList.add("disabled"));

  // Highlight the selected option
  event.target.classList.add("selected");

  // Change the background color for correct/incorrect
  if (selectedOptionIndex === questions[currentQuestion].correct) {
    event.target.style.backgroundColor = "#F6F1D3";
    score++;
  } else {
    event.target.style.backgroundColor = "#F6F1D3";
  }

  optionSelectedFlag = true; // Set flag to indicate option has been selected

  nextBtn.classList.add("show"); // Show the next button
}

// Timer logic
function startTimer() {
  timeLeft = 15;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
    } else {
      clearInterval(timer);
      autoMoveToNext();
    }
  }, 1000);
}

// Automatically move to the next question when the timer finishes
function autoMoveToNext() {
  const options = optionList.querySelectorAll(".option");

  // Disable all options when time is up
  options.forEach((option) => option.classList.add("disabled"));

  // Move to the next question
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
    resetTimer();
    optionSelectedFlag = false; // Reset flag after moving to the next question
  } else {
    showResult();
  }
}

// Reset timer for the next question
function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.textContent = timeLeft;
  startTimer();
}

// Show quiz result
function showResult() {
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");

  const waitText = resultBox.querySelector(".wait_text");
  const congratulationsText = resultBox.querySelector(".congratulations_text");
  const betterLuckText = resultBox.querySelector(".better_luck_text");
  const continueButton = resultBox.querySelector(".continue_next_round");
  const exitButton = resultBox.querySelector(".exit_btn");

  waitText.classList.remove("hidden"); // Show 'Wait for Result'
  congratulationsText.classList.add("hidden");
  betterLuckText.classList.add("hidden");
  continueButton.classList.add("hidden");
  exitButton.classList.add("hidden");

  // Send score and maxScore to backend
  fetch("/mcq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_email: userEmail,
      company_id: jobId,
      score: score,
      max_score: 4, // Max score based on selected 20 questions
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Show results after 5 seconds
      setTimeout(() => {
        waitText.classList.add("hidden");

        if (data.passed) {
          congratulationsText.classList.remove("hidden");
          continueButton.classList.remove("hidden");
        } else {
          betterLuckText.classList.remove("hidden");
          exitButton.classList.remove("hidden");
        }
      }, 5000); // 5 seconds delay
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Event listener for continue button
  continueButton.addEventListener("click", () => {
    const queryParams = new URLSearchParams({
      user_email: userEmail,
      company_id: jobId,
    }).toString();

    window.location.href = `/technical?${queryParams}`; // Redirect to the next round with query parameters
  });

  // Event listener for exit button
  exitButton.addEventListener("click", () => {
    window.location.href = "/"; // Redirect to the dashboard
  });
}
