// Constants
const QUIZ_TIME = 10 * 60; // 10 minutes in seconds
let timeLeft = QUIZ_TIME;
let timer = null;

// Quiz data remains the same...
const quizData = [
    // ... existing quiz data ...
    {
        question: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train',
        options: ['50 metres', '180 metres', '324 metres', '150 metres'],
        answer: '150 metres'
      },
      {
        question: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:',
        options: ['45 km/h', '50 km/h', '54 km/h', '55 km/h'],
        answer: '50 km/h'
      },
      {
        question: ' A jogger running at 9 kmph alongside a railway track in 240 metres ahead of the engine of a 120 metres long train running at 45 kmph in the same direction. In how much time will the train pass the jogger?',
        options: ['3.6 sec', '18 sec', '36 sec', '72 sec'],
        answer: '36 sec'
      },
      {
        question: 'A train travelling at a speed of 75 mph enters a tunnel 31/2 miles long. The train is 1/4 mile long. How long does it take for the train to pass through the tunnel from the moment the front enters to the moment the rear emerges?',
        options: ['2.5 min', '3 min', '3,2 min','3.5 min'],
        answer: '3.2 min'
      },
      {
        question: 'A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour ?',
        options: [
          '7.2','3.6','8.4','10'],
        answer: '7.2'
      },
      {
        question: ' An aeroplane covers a certain distance at a speed of 240 kmph in 5 hours. To cover the same distance in 1 hours, it must travel at a speed of:',
        options: ['300 kmph', '360 kmph', '600 kmph', '720 kmph'],
        answer: '720 kmph'
      },
      {
        question: 'Two towns are connected by railway. Can you find the distance between them? I.The speed of the mail train is 12 km/hr more than that of an express train. II.A mail train takes 40 minutes less than an express train to cover the distance.',
        
        options: [
          'I alone sufficient while II alone not sufficient to answer',
          'I alone sufficient while I alone not sufficient to answer',
          'Either I or II alone sufficient to answer',
          'Both I and II are necessary to answer',
          'Both I and II are not sufficient to answer'
        ],
        answer: 'Both I and II are not sufficient to answer'
      },
      {
        question: ' How much time did X take to reach the destination? I.The ratio between the speed of X and Y is 3 : 4.II.Y takes 36 minutes to reach the same destination.',
        options: [
          'I alone sufficient while II alone not sufficient to answer',
          'I alone sufficient while I alone not sufficient to answer',
          'Either I or II alone sufficient to answer',
          'Both I and II are not sufficient to answer',
          'Both I and II are necessary to answer'
        ],
        answer: 'Both I and II are necessary to answer'
      },
      {
        question: 'Two ships are sailing in the sea on the two sides of a lighthouse. The angle of elevation of the top of the lighthouse is observed from the ships are 30° and 45° respectively. If the lighthouse is 100 m high, the distance between the two ships is:',
        options: [
          '173 m',
          '200 m',
          '273 m',
          '300 m'
        ],
        answer: '273 m'
      },
      {
        question: ' A man standing at a point P is watching the top of a tower, which makes an angle of elevation of 30° with the mans eye.The man walks some distance towards the tower to watch its top and the angle of the elevation becomes 60°. What is the distance between the base of the tower and the point P?',
        options: ['43 units', '8 units', '12 units', 'Data inadequate','none of these'],
        answer: 'Data indequate'
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
    window.location.href = 'quizpage.html';
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
// Add this to your existing kzkzscript.js

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
            if (confirm('View the leaderboard?')) {
                window.location.href = 'leaderboard.html';
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

