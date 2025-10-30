
// Questions data
const questions = [
    {
        question: "How often do you exercise?",
        options: [
            { text: "Daily", score: 10 },
            { text: "3-5 times a week", score: 8 },
            { text: "1-2 times a week", score: 5 },
            { text: "Rarely or never", score: 0 }
        ]
    },
    {
        question: "How would you describe your diet?",
        options: [
            { text: "Very healthy (balanced, mostly plant-based)", score: 10 },
            { text: "Moderately healthy (balanced with occasional treats)", score: 7 },
            { text: "Somewhat unhealthy (frequent processed foods)", score: 3 },
            { text: "Very unhealthy (mostly fast food, high sugar)", score: 0 }
        ]
    },
    {
        question: "How many hours of sleep do you typically get?",
        options: [
            { text: "7-9 hours", score: 10 },
            { text: "6-7 hours", score: 7 },
            { text: "5-6 hours", score: 4 },
            { text: "Less than 5 hours or more than 9 hours", score: 1 }
        ]
    },
    {
        question: "Do you smoke?",
        options: [
            { text: "Never", score: 10 },
            { text: "Occasionally", score: 4 },
            { text: "Regularly", score: 0 }
        ]
    },
    {
        question: "How would you rate your stress levels?",
        options: [
            { text: "Very low (rarely stressed)", score: 10 },
            { text: "Moderate (sometimes stressed)", score: 7 },
            { text: "High (often stressed)", score: 3 },
            { text: "Very high (constantly stressed)", score: 0 }
        ]
    }
];

// Variables
let currentQuestion = 0;
let totalScore = 0;
let maxPossibleScore = 0;
let isSpinning = false;
let selectedValue = 0;
const baseAge = 75;

// DOM Elements
const progressBar = document.getElementById('progress');
const questionContainer = document.getElementById('question-container');
const quizSection = document.getElementById('quiz-section');
const wheelSection = document.getElementById('wheel-section');
const resultsSection = document.getElementById('results-section');
const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resultContainer = document.getElementById('result-container');
const predictedAgeElement = document.getElementById('predicted-age');
const ageMessageElement = document.getElementById('age-message');
const healthScoreBar = document.getElementById('health-score-bar');
const healthScoreValue = document.getElementById('health-score-value');
const healthAdvice = document.getElementById('health-advice');
const restartButton = document.getElementById('restart-button');

// Calculate max possible score
questions.forEach(q => {
    const maxScore = Math.max(...q.options.map(o => o.score));
    maxPossibleScore += maxScore;
});

// Initialize the quiz
function initQuiz() {
    currentQuestion = 0;
    totalScore = 0;
    updateProgress(0);
    showQuestion();
}

// Show current question
function showQuestion() {
    const question = questions[currentQuestion];

    questionContainer.classList.add('hidden');

    setTimeout(() => {
        questionContainer.innerHTML = `
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">Question ${currentQuestion + 1} of ${questions.length}</h2>
                    <p class="text-gray-700 mb-6">${question.question}</p>
                    <div class="space-y-3">
                        ${question.options.map((option, index) => `
                            <button class="option-btn w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-indigo-50 transition-colors" 
                                    data-score="${option.score}">
                                <div class="flex items-center">
                                    <div class="w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-400 mr-3">
                                        <span class="option-number">${index + 1}</span>
                                    </div>
                                    <span>${option.text}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                `;

        // Add event listeners to options
        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', handleOptionClick);
        });

        questionContainer.classList.remove('hidden');
    }, 300);
}

// Handle option click
function handleOptionClick(e) {
    const selectedScore = parseInt(e.currentTarget.dataset.score);
    totalScore += selectedScore;

    // Highlight selected option
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-100', 'border-indigo-500');
        btn.disabled = true;
    });

    e.currentTarget.classList.add('bg-indigo-100', 'border-indigo-500');

    // Move to next question or show wheel
    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
            updateProgress((currentQuestion / questions.length) * 50);
        } else {
            showWheel();
            updateProgress(50);
        }
    }, 700);
}

// Update progress bar
function updateProgress(percentage) {
    progressBar.style.width = `${percentage}%`;
}

// Show wheel section
function showWheel() {
    quizSection.classList.add('hidden');
    wheelSection.classList.remove('hidden');

    // Calculate health score percentage
    const healthPercentage = Math.round((totalScore / maxPossibleScore) * 100);

    // Create wheel sections based on health score
    createWheel(healthPercentage);
}

// Create wheel with sections based on health score
function createWheel(healthPercentage) {
    wheel.innerHTML = '';

    // Define wheel sections based on health score
    let sections = [];

    if (healthPercentage >= 80) {
        // Very healthy - mostly positive values, with median > 1
        sections = [+15, +8, +4, +10, +2, -1, +6, +1];
    } else if (healthPercentage >= 60) {
        // Healthy - mix of positive and some negative, with median = 1
        sections = [+7, +3, -2, +5, +1, -3, +4, 0];
    } else if (healthPercentage >= 40) {
        // Average - balanced mix, with median = 1
        sections = [+5, -3, +6, -4, +2, -1, +3, 0];
    } else if (healthPercentage >= 20) {
        // Unhealthy - more negative values, with median < 1
        sections = [-3, +2, -5, +3, -6, +1, -4, 0];
    } else {
        // Very unhealthy - mostly negative values, with median < 0
        sections = [-7, -5, -6, +1, -4, -2, +2, -3];
    }

    // Create wheel sections
    const sectionCount = sections.length;
    const sectionAngle = 360 / sectionCount;

    sections.forEach((value, index) => {
        // Create section with proper clip path
        const section = document.createElement('div');
        section.className = 'wheel-section';
        section.dataset.value = value;

        // Calculate rotation for this section
        const rotation = index * sectionAngle;
        section.style.transform = `rotate(${rotation}deg)`;

        // Set color based on value
        if (value >= 4) {
            section.style.backgroundColor = '#A8E6CF'; // good
        } else if (value >= 0) {
            section.style.backgroundColor = '#D3D3D3'; // neutral
        } else {
            section.style.backgroundColor = '#FF8B94'; // bad
        }

        // Add text label
        const text = document.createElement('div');
        text.className = 'wheel-text';
        text.textContent = value > 0 ? `+${value}` : value;

        // Position text in the middle of the section, pointing toward center
        const labelAngle = rotation + (sectionAngle / 2);
        const radians = (labelAngle) * (Math.PI / 180);
        const radius = 160; // Wheel radius
        const textDistance = radius * 0.7; // Position text at 70% from center

        const x = Math.cos(radians) * textDistance;
        const y = Math.sin(radians) * textDistance;

        // Position text and rotate it to point toward center
        text.style.left = `${radius + x}px`;
        text.style.top = `${radius + y}px`;
        text.style.transform = `translate(-50%, -50%) rotate(${labelAngle + 90}deg)`;

        wheel.appendChild(section);
        wheel.appendChild(text);
    });

    // Add spin event listener
    spinButton.addEventListener('click', spinWheel);
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'Spinning...';
    spinButton.classList.add('opacity-50');

    // Random rotation (5-10 full rotations + random section)
    const sections = 8; // Fixed number of sections
    const sectionAngle = 360 / sections;
    const randomSection = Math.floor(Math.random() * sections);
    const extraDegrees = randomSection * sectionAngle;
    const totalDegrees = 1800 + extraDegrees + Math.floor(Math.random() * sectionAngle);

    // Apply rotation
    wheel.style.transform = `rotate(${totalDegrees}deg)`;

    // Get the selected value after spinning
    setTimeout(() => {
        // Calculate which section is at the top (opposite of the rotation)
        const normalizedDegrees = totalDegrees % 360;
        const sectionIndex = Math.floor((360 - normalizedDegrees) / sectionAngle) % sections;

        // Get all sections and find the selected one
        const allSections = document.querySelectorAll('.wheel-section');
        selectedValue = parseInt(allSections[sectionIndex].dataset.value);

        // Show results after a short delay
        setTimeout(() => {
            showResults();
            updateProgress(100);
        }, 500);
    }, 5000); // Match the CSS transition duration
}

// Show results
function showResults() {
    wheelSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Calculate predicted age
    const predictedAge = baseAge + selectedValue;

    // Calculate health score percentage
    const healthPercentage = Math.round((totalScore / maxPossibleScore) * 100);

    // Update health score display
    healthScoreBar.style.width = `${healthPercentage}%`;
    healthScoreValue.textContent = `${healthPercentage}%`;

    // Set health advice based on score
    if (healthPercentage >= 80) {
        healthAdvice.textContent = "Excellent lifestyle choices! Keep up the great work.";
    } else if (healthPercentage >= 60) {
        healthAdvice.textContent = "Good habits overall. Small improvements could make a big difference.";
    } else if (healthPercentage >= 40) {
        healthAdvice.textContent = "Consider making some lifestyle changes to improve your health.";
    } else if (healthPercentage >= 20) {
        healthAdvice.textContent = "Your current habits may be impacting your health. Consider consulting a healthcare professional.";
    } else {
        healthAdvice.textContent = "Your lifestyle choices need significant improvement. Please consider seeking professional health advice.";
    }

    // Set age message
    if (selectedValue > 0) {
        ageMessageElement.textContent = `Congratulations! Your lifestyle choices may add ${selectedValue} years to the average lifespan.`;
        ageMessageElement.className = "text-green-600 mb-6";
        createConfetti();
    } else if (selectedValue < 0) {
        ageMessageElement.textContent = `Your current lifestyle choices may reduce your lifespan by ${Math.abs(selectedValue)} years from the average.`;
        ageMessageElement.className = "text-red-600 mb-6";
    } else {
        ageMessageElement.textContent = "Your lifestyle choices align with the average lifespan expectancy.";
        ageMessageElement.className = "text-gray-600 mb-6";
    }

    // Animate the age counter
    animateCounter(predictedAgeElement, baseAge, predictedAge, 1500);

    // Show result container with animation
    setTimeout(() => {
        resultContainer.classList.remove('hidden');
    }, 300);
}

// Animate counter from start to end value
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            element.textContent = end;
        }
    }

    requestAnimationFrame(animation);
}

// Create confetti effect for positive results
function createConfetti() {
    const confettiCount = 100;
    const colors = ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;

        resultsSection.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Restart the quiz
restartButton.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    isSpinning = false;
    spinButton.disabled = false;
    spinButton.textContent = 'SPIN THE WHEEL';
    spinButton.classList.remove('opacity-50');
    wheel.style.transform = 'rotate(0deg)';
    initQuiz();
});

// Initialize the quiz on page load
initQuiz();