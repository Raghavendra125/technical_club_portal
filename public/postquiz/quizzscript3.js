
  const QUIZ_TIME = 10 * 60; // 10 minutes in seconds
  let timeLeft = QUIZ_TIME;
  let timer = null;
  
const quizData = [
    {
      question: ' Which of the following statements should be used to obtain a remainder after dividing 3.14 by 2.1 ?',
      options: ['rem = 3.14 % 2.1;',
        'rem = modf(3.14, 2.1);',
        'rem = fmod(3.14, 2.1);',
        'Remainder cannot be obtain in floating point division.'],
        answer: 'rem = fmod(3.14, 2.1);'
    },
    {
      question: ' Is there any difference between following declarations? 1 :	extern int fun(); 2 :	int fun();',
      options: [
        'Both are identical',
        'No difference, except extern int fun(); is probably in another file',
        'int fun(); is overrided with extern int fun();',
        'None of these'],
      answer: 'No difference, except extern int fun(); is probably in another file'
    },
    {
      question: 'What will happen if in a C program you assign a value to an array element whose subscript exceeds the size of array?',
      options: [ 
        'The element will be set to 0.',
        'The compiler would report an error.',
        'The program may crash if some important data gets overwritten.',
        'The array size would appropriately grow.'],
      answer: 'The program may crash if some important data gets overwritten.'
    },
    {
      question: 'What happens when we try to compile the class definition in following code snippet? class Birds {};class Peacock : protected Birds {};',
      options: [
       'It will not compile because class body of Birds is not defined.',
       'It will not compile because class body of Peacock is not defined.',
       'It will not compile because a class cannot be protectedly inherited from other class.',
       'It will compile succesfully.'],
      answer: 'It will compile succesfully.'
    },
    {
      question: 'Which of the following statement is correct regarding destructor of base class ?',
      options: [
        'Destructor of base class should always be static.',
        'Destructor of base class should always be virtual.',
        'Destructor of base class should not be virtual.',
        'Destructor of base class should always be private.',
      ],
      answer: 'Destructor of base class should always be virtual.'
    },
    {
      question: 'How can we make a class abstract?',
      options: [
       'By making all member functions constant.',
       'By making at least one member function as pure virtual function.',
       'By declaring it abstract using the static keyword.',
       'By declaring it abstract using the virtual keyword.',],
      answer: 'By making at least one member function as pure virtual function.'
    },
    {
      question: ' In which of the following collections is the Input/Output index-based? (1)Stack (2)Queue (3)BitArray (4)ArrayList (5)HashTable ',
      options: [
        '1 and 2 only',
        '3 and 4 only',
        '5 only',
        '1, 2 and 5 only',
        'All of the above',
      ],
      answer: '3 and 4 only'
    },
    {
      question: 'In a HashTable Key cannot be null, but Value can be.',
      options: ['True','False'],
      answer: 'True'
    },
    {
      question: ' Which of the following are valid . NET CLR JIT performance counters? (1)Total memory used for JIT compilation (2)Average memory used for JIT compilation (3)Number of methods that failed to compile with the standard JIT (4)Percentage of processor time spent performing JIT compilation (5)Percentage of memory currently dedicated for JIT compilation',
      options: ['1,5','3,4','1,2','4,5'],
      answer: '3,4'
    },
    {
      question: 'which of the following method is used to close a connection to the database ?',
      options: ['con.exit()', 'con.close()', 'con.commit()', 'con.disconnect()'],
      answer: 'con.close()'
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
            if (confirm('GO back to quiz page?')) {
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

