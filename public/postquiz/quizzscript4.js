  // Constants
  const QUIZ_TIME = 10 * 60; // 10 minutes in seconds
  let timeLeft = QUIZ_TIME;
  let timer = null;
const quizData = [
    {
      question: 'Remember,you are looking for the word that does NOT belong in the same group as the others.Sometimes, all four words seem to fit in the same group. If so, look more closely to further narrow your classification.\n1.Which word does NOT belong with the others?',
      options: ['two', 'three', 'three', 'eight'],
      answer: 'three'
    },
    {
      question:  'Read each definition and all four choices carefully, and find the answer that provides the best example of the given definition.People speculate when they consider a situation and assume something to be true based on inconclusive evidence. Which situation below is thebestexample of Speculation ?',
      options: [
        'Francine decides that it would be appropriate to wear jeans to her new office on Friday after reading about "Casual Fridays" in her employee handbook.',
        'Mary spends thirty minutes sitting in traffic and wishes that she took the train instead of driving.',
        'After consulting several guidebooks and her travel agent, Jennifer feels confident that the hotel she has chosen is first-rate.',
        'When Emily opens the door in tears, Theo guesses that she is had a death in her family.'],
      answer: 'When Emily opens the door in tears, Theo guesses that she is had a death in her family.',
    },
    {
      question: 'Each problem consists of three statements. Based on the first two statements, the third statement may be true, false, or uncertain. \n1. Middletown is north of Centerville. \n2. Centerville is east of Penfield. \n3.Penfield is northwest of Middletown.\nIf the first two statements are true, the third statement is ',
      options: ['True','False','Uncertain'],
      answer: 'False'
    },
    {
      question: 'Statement:\nThe government has decided to pay compensation to the tune of Rs. 1 lakh to the family members of those who are killed in railway accidents.\nAssumptions:\nThe government has enough funds to meet the expenses due to compensation.\nThere may be reduction in incidents of railway accidents in near future.',
      options: [
        'Only assumption I is implicit',
        'Only assumption II is implicit',
        'Either I or II is implicit',
        'Neither I nor II is implicit',
        'Both I and II are implicit],'],
      answer: 'Only assumption I is implicit'
    },
    {
      question: 'Statement:\nNo regular funds have been provided for welfare activities in this year budget of the factory.\nAssumptions:\nThe factory does not desire to carry out welfare this year.\nBudgetary provision is necessary for carrying put welfare activities.',
      options: [
        'Only assumption I is implicit',
        'Only assumption II is implicit',
        'Either I or II is implicit',
        'Neither I nor II is implicit',
        'Both I and II are implicit'],  
      answer:'Both I and II are implicit'
    },
    {
      question: 'Statement:\nThe alert villagers caught a group of dreaded dacoits armed with murderous weapons.\nCourses of Action:\nThe villagers should be provided sophisticated weapons.\nThe villagers should be rewarded for their courage and unity.',
      options: [
      'Only I follows',
      'Only II follows',
      'Either I or II follows',
      'Neither I nor II follows',
      'Both I and II follow'],
      answer: 'Both I and II follow'
    },
    {
      question: 'Statements:\nSome men are educated. Educated persons prefer small families.\nConclusions:\nAll small families are educated.Some men prefer small families.',
      options: [
        'Only conclusion I follows',
        'Only conclusion II follows',
        'Either I or II follows',
        'Neither I nor II follows',
        'Both I and II follow'
      ],
      answer: 'Only conclusion II follows'
    },
    {
      question: 'Statement:\nShould we scrap the system of formal education beyond graduation?\nArguments:\nYes. It will mean taking employment at an early date.\nNo. It will mean lack of depth of knowledge.',
      options: [
        'Only argument I is strong',
        'Only argument II is strong',
        'Either I or II is strong',
        'Neither I nor II is strong',
        'Both I and II are strong'],
      answer: 'Only argument II is strong'
    },
    {
      question: 'Statement:\nShould all the drugs patented and manufactured in Western countries be first tried out on sample basis before giving licence for sale to general public in India?\nArguments:\nYes.Many such drugs require different doses and duration for Indian population and hence it is necessary.\nNo.This is just not feasible and hence cannot be implemented.',
      options: [
         'Only argument I is strong',
        'Only argument II is strong',
        'Either I or II is strong',
        'Neither I nor II is strong',
        'Both I and II are strong'],
      answer: 'Only argument I is strong'
    },
    {
      question: 'Statement:\nThe State Government has abolished the scheme of providing concessional air ticket to students.\nAssumptions:\nStudents will not travel by air in future.\nThe students who resort to travel by air can bear the expenses of air ticket.',
      options: [
        'Only assumption I is implicit',
        'Only assumption II is implicit',
        'Either I or II is implicit',
        'Neither I nor II is implicit',
        'Both I and II are implicit'
      ],
      answer: 'Only assumption II is implicit'
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
            if (confirm('Go back to quiz page ?')) {
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

