
// Constants
const QUIZ_TIME = 10 * 60; // 10 minutes in seconds
let timeLeft = QUIZ_TIME;
let timer = null;

const quizData = [
  {
    question: 'The price of commodity X increases by 40 paise every year, while the price of commodity Y increases by 15 paise every year. If in 2001, the price of commodity X was Rs. 4.20 and that of Y was Rs. 6.30, in which year commodity X will cost 40 paise more than the commodity Y ?',
    options: ['2010', '2011', '2012', '2013'],
    answer: '2011'
  },
  {
    question: 'If a - b = 3 and a2 + b2 = 29, find the value of ab ?',
    options: ['10', '12', '15', '18'],
    answer: '10'
  },
  {
    question: 'The product of two numbers is 120 and the sum of their squares is 289. The sum of the number is:',
    options: ['20', '23', '169', 'None of these'],
    answer: '23'
  },
  {
    question: 'The salaries A, B, C are in the ratio 2 : 3 : 5. If the increments of 15%, 10% and 20% are allowed respectively in their salaries, then what will be new ratio of their salaries?',
    options: ['3:6:10', '10:11:20', '23:33:60','cannot be determined'],
    answer: '23:33:60'
  },
  {
    question: 'A goods train runs at the speed of 72 kmph and crosses a 250 m long platform in 26 seconds. What is the length of the goods train?',
    options: [
      '230 m',
      '240 m',
      '260 m',
      '270 m',
    ],
    answer: '270 m'
  },
  {
    question: 'An error 2% in excess is made while measuring the side of a square. The percentage of error in the calculated area of the square is:',
    options: ['2%', '2.02%', '4%', '4.04%'],
    answer: '4.04%'
  },
  {
    question: 'In a shower, 5 cm of rain falls. The volume of water that falls on 1.5 hectares of ground is:',
    options: [
      '75 cu.m',
      '750 cu.m',
      '7500 cu.m',
      '75000 cu.m',
    ],
    answer: '750 cu.m'
  },
  {
    question: 'The reflex angle between the hands of a clock at 10.25 is:',
    options: ['180 degree', '192 1/2 degree', '195 degree', '197 1/2 degree'],
    answer: '197 1/2 degree'
  },
  {
    question: 'A 12% stock yielding 10% is quoted at:',
    options: [
      'Rs. 83.33',
      'Rs. 110',
      'Rs. 112',
      'Rs. 120',
    ],
    answer: 'Rs.120'
  },
  {
    question: 'In how many different ways can the letters of the word DETAIL be arranged in such a way that the vowels occupy only the odd positions?',
    options: ['32', '48', '36', '60'],
    answer: '36'
  },
];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const previousButton = document.getElementById('previous');
const saveNextButton = document.getElementById('saveNext');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');
const homeButton = document.getElementById('home');
const quizControls = document.getElementById('quiz-controls');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let selectedAnswers = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    const timerDisplay = document.getElementById('time-left');
    const timerContainer = document.getElementById('timer');
    
    timer = setInterval(() => {
        timeLeft--;
        
        // Format time
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Warning when less than 1 minute
        if (timeLeft <= 60) {
            timerContainer.classList.add('warning');
        }
        
        // Auto-submit when time is up
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSubmitQuiz();
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function autoSubmitQuiz() {
    saveAnswer();
    checkAnswer();
    displayResult();
}

function initializeQuestionPalette() {
    const palette = document.getElementById('question-buttons');
    palette.innerHTML = '';
    
    for (let i = 0; i < quizData.length; i++) {
        const button = document.createElement('button');
        button.className = 'question-button';
        button.textContent = i + 1;
        button.addEventListener('click', () => jumpToQuestion(i));
        palette.appendChild(button);
    }
    updateQuestionPalette();
}

function updateQuestionPalette() {
    const buttons = document.querySelectorAll('.question-button');
    buttons.forEach((button, index) => {
        button.classList.remove('current', 'attempted');
        if (index === currentQuestion) {
            button.classList.add('current');
        }
        if (selectedAnswers[index] !== undefined) {
            button.classList.add('attempted');
        }
    });
}

function jumpToQuestion(index) {
    saveAnswer();
    currentQuestion = index;
    displayQuestion();
}

function displayQuestion() {
    const questionData = quizData[currentQuestion];
    
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = quizData.length;
    
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = questionData.question;

    const optionsElement = document.createElement('div');
    optionsElement.className = 'options';

    const shuffledOptions = [...questionData.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const label = document.createElement('label');
        label.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz';
        radio.value = option;
        if (selectedAnswers[currentQuestion] === option) {
            radio.checked = true;
        }

        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        optionsElement.appendChild(label);
    });

    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
    quizContainer.appendChild(optionsElement);

    updateQuestionPalette();
    updateButtonVisibility();
}
/*
function displayResult() {
    stopTimer(); // Stop the timer when displaying results
    
    quizContainer.style.display = 'none';
    document.querySelector('.navigation-buttons').style.display = 'none';
    //quizControls.classList.remove('hide');
    document.getElementById('quiz-controls').style.display = 'flex';
    
    const attempted = selectedAnswers.filter(a => a !== undefined).length;
    const notAttempted = quizData.length - attempted;
    const accuracy = (score / attempted) * 100 || 0;
    
    resultContainer.innerHTML = `
        <div class="result-summary">
            <div class="result-item">
                <h3>Score</h3>
                <p>${score}/${quizData.length}</p>
            </div>
            <div class="result-item">
                <h3>Attempted</h3>
                <p>${attempted}</p>
            </div>
            <div class="result-item">
                <h3>Not Attempted</h3>
                <p>${notAttempted}</p>
            </div>
            <div class="result-item">
                <h3>Accuracy</h3>
                <p>${accuracy.toFixed(1)}%</p>
            </div>
        </div>
    `;
}
    */

function initializeQuiz() {
    document.getElementById('total-questions').textContent = quizData.length;
    // Ensure quiz controls are hidden at start
    document.getElementById('quiz-controls').style.display = 'none';
    initializeQuestionPalette();
    displayQuestion();
    startTimer();
}

function saveAnswer() {
    const selectedOption = document.querySelector('input[name="quiz"]:checked');
    if (selectedOption) {
        selectedAnswers[currentQuestion] = selectedOption.value;
    }
}

function checkAnswer() {
    score = 0;
    incorrectAnswers = [];
    
    for (let i = 0; i < quizData.length; i++) {
        if (selectedAnswers[i] === quizData[i].answer) {
            score++;
        } else {
            incorrectAnswers.push({
                question: quizData[i].question,
                incorrectAnswer: selectedAnswers[i] || 'Not attempted',
                correctAnswer: quizData[i].answer
            });
        }
    }
}

function showAnswer() {
    let incorrectAnswersHtml = '';
    for (let i = 0; i < incorrectAnswers.length; i++) {
        incorrectAnswersHtml += `
            <p>
                <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
                <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
                <strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
            </p>
        `;
    }

    resultContainer.innerHTML = `
        <div class="result-summary">
            <div class="result-item">
                <h3>Final Score</h3>
                <p>${score}/${quizData.length}</p>
            </div>
        </div>
        <div class="incorrect-answers">
            <h3>Incorrect Answers:</h3>
            ${incorrectAnswersHtml}
        </div>
    `;
    
    showAnswerButton.style.display = 'none';
}

function previousQuestion() {
    if (currentQuestion > 0) {
        saveAnswer();
        currentQuestion--;
        displayQuestion();
    }
}

function nextQuestion() {
    saveAnswer();
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

function updateButtonVisibility() {
    previousButton.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
    
    if (currentQuestion === quizData.length - 1) {
        saveNextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    } else {
        saveNextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
}

function retryQuiz() {
    timeLeft = QUIZ_TIME;
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = [];
    selectedAnswers = [];
    
    quizContainer.style.display = 'block';
    document.querySelector('.navigation-buttons').style.display = 'flex';
    //quizControls.classList.add('hide');
    // Hide quiz controls again
    document.getElementById('quiz-controls').style.display = 'none';
    resultContainer.innerHTML = '';
    
    displayQuestion();
    startTimer();
}

function goHome() {
    window.location.href = '../user_home_page.html';
}

// Event listeners
window.addEventListener('load', initializeQuiz);
submitButton.addEventListener('click', () => {
    saveAnswer();
    checkAnswer();
    displayResult();
});
previousButton.addEventListener('click', previousQuestion);
saveNextButton.addEventListener('click', nextQuestion);
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswer);
homeButton.addEventListener('click', goHome);

// Add warning before leaving the page
window.addEventListener('beforeunload', (e) => {
    if (timeLeft > 0 && selectedAnswers.some(answer => answer !== undefined)) {
        e.preventDefault();
        e.returnValue = '';
    }
});
// Add this to your existing quizscript.js

async function checkLoginStatus() {
    try {
        const response = await fetch('/user');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking login status:', error);
        return null;
    }
}


// Add these functions to your existing kzkzscript.js

async function saveScore() {
    try {
        const attempted = selectedAnswers.filter(a => a !== undefined).length;
        const accuracy = (score / attempted) * 100 || 0;
        
        const response = await fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: score,
                total_questions: quizData.length,
                accuracy: accuracy.toFixed(2),
                attempted_questions: attempted
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Score saved successfully!');
            document.getElementById('saveScore').disabled = true;
            if (confirm('Go back to Quiz page ?')) {
                window.location.href = 'quizpage.html';
            }
        } else {
            alert(data.message || 'Error saving score');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving score. Please try again.');
    }
}

// Modify the existing displayResult function
function displayResult() {
    stopTimer();
    
    quizContainer.style.display = 'none';
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.getElementById('quiz-controls').style.display = 'flex';
    
    const attempted = selectedAnswers.filter(a => a !== undefined).length;
    const notAttempted = quizData.length - attempted;
    const accuracy = (score / attempted) * 100 || 0;
    
    resultContainer.innerHTML = `
        <div class="result-summary">
            <div class="result-item">
                <h3>Score</h3>
                <p>${score}/${quizData.length}</p>
            </div>
            <div class="result-item">
                <h3>Attempted</h3>
                <p>${attempted}</p>
            </div>
            <div class="result-item">
                <h3>Not Attempted</h3>
                <p>${notAttempted}</p>
            </div>
            <div class="result-item">
                <h3>Accuracy</h3>
                <p>${accuracy.toFixed(1)}%</p>
            </div>
        </div>
    `;
}

// Add event listener for save button
document.getElementById('saveScore').addEventListener('click', saveScore);

