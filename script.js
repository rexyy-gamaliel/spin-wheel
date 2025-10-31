
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
let wheelNumbers = [];
let currentQuestion = 0;
let totalScore = 0;
let maxPossibleScore = 0;
let isSpinning = false;
let selectedValue = 0;
const baseAge = 0;
let lastRotation = 0;

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

function getRandomAgeNumbers(healthPercentage, currentAge) {
    // Define wheel sections based on health score
    var baseAge = 75;
    if (currentAge > baseAge) {
        baseAge = currentAge;
        healthPercentage -= 20;
    }

    let offsets = [];
    if (healthPercentage >= 80) {
        // Very healthy - mostly positive values, with median > 1
        offsets = [-1, 0, +2, +4, +6, +8, +10, +15];
    } else if (healthPercentage >= 60) {
        // Healthy - mix of positive and some negative, with median = 1
        offsets = [-3, -2, 0, +1, +3, +4, +5, +7];
    } else if (healthPercentage >= 40) {
        // Average - balanced mix, with median = 1
        offsets = [-4, -3, -1, 0, +2, +3, +5, +6];
    } else if (healthPercentage >= 20) {
        // Unhealthy - more negative values, with median < 1
        offsets = [-5, -4, -3, -2, 0, +1, +2, +3];
    } else {
        // Very unhealthy - mostly negative values, with median < 0
        offsets = [-7, -6, -5, -4, -3, -2, +1, +2];
    }

    var numbers = offsets.map(offset => Math.max(offset + baseAge, currentAge));

    return numbers;
}

// // Create wheel with sections based on health score
// function createWheel(healthPercentage, currentAge = 60) {
//     wheel.innerHTML = '';

//     var sections = getRandomAgeNumbers(healthPercentage, currentAge);

//     // Create wheel sections
//     const sectionCount = sections.length;
//     const sectionAngle = 360 / sectionCount;

//     sections.forEach((value, index) => {
//         // Create section with proper clip path
//         const section = document.createElement('div');
//         section.className = 'wheel-section';
//         section.dataset.value = value;

//         // Calculate rotation for this section
//         const rotation = index * sectionAngle;
//         section.style.transform = `rotate(${rotation}deg)`;

//         // Set color based on value
//         if (value >= 4) {
//             section.style.backgroundColor = '#A8E6CF'; // good
//         } else if (value >= 0) {
//             section.style.backgroundColor = '#D3D3D3'; // neutral
//         } else {
//             section.style.backgroundColor = '#FF8B94'; // bad
//         }

//         // Add text label
//         const text = document.createElement('div');
//         text.className = 'wheel-text';
//         text.textContent = value > 0 ? `+${value}` : value;

//         // Position text in the middle of the section, pointing toward center
//         const labelAngle = rotation + (sectionAngle / 2);
//         const radians = (labelAngle) * (Math.PI / 180);
//         const radius = 160; // Wheel radius
//         const textDistance = radius * 0.7; // Position text at 70% from center

//         const x = Math.cos(radians) * textDistance;
//         const y = Math.sin(radians) * textDistance;

//         // Position text and rotate it to point toward center
//         text.style.left = `${radius + x}px`;
//         text.style.top = `${radius + y}px`;
//         text.style.transform = `translate(-50%, -50%) rotate(${labelAngle + 90}deg)`;

//         wheel.appendChild(section);
//         wheel.appendChild(text);
//     });

//     // Add spin event listener
//     spinButton.addEventListener('click', spinWheel);
// }

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
    // if (healthPercentage >= 80) {
    //     healthAdvice.textContent = "Excellent lifestyle choices! Keep up the great work.";
    // } else if (healthPercentage >= 60) {
    //     healthAdvice.textContent = "Good habits overall. Small improvements could make a big difference.";
    // } else if (healthPercentage >= 40) {
    //     healthAdvice.textContent = "Consider making some lifestyle changes to improve your health.";
    // } else if (healthPercentage >= 20) {
    //     healthAdvice.textContent = "Your current habits may be impacting your health. Consider consulting a healthcare professional.";
    // } else {
    //     healthAdvice.textContent = "Your lifestyle choices need significant improvement. Please consider seeking professional health advice.";
    // }

    let roundDownToMultipleOf5 = (n) => Math.floor(n / 5) * 5;

    if (healthPercentage >= 75) {
        let sentences = [
            "If your lifestyle keeps up, your doctor's going to start asking you for advice when you hit 70!",
            `At this rate, you'll still be doing yoga at age ${roundDownToMultipleOf5(predictedAge - 5)} while the rest of us are negotiating with our knees!`,
            "Keep it up and you'll be the oldest person to ever try skydiving!",
            "Your lifestyle is so good, even your future self is sending you thank-you notes!"
        ];
        healthAdvice.textContent = sentences[Math.floor(Math.random() * sentences.length)];
    } else if (healthPercentage >= 50) {
        let sentences = [
            "With habits like these, you might just outlive your houseplants!",
            "Keep going! Your future self is counting on you to remember where you left your keys at 70.",
            `Keep going! At this rate, you'll be the one giving health advice at ${roundDownToMultipleOf5(predictedAge - 5)}!`,
            `Sure, your lifestyle isn't picture-perfect, but it's real — and that's exactly why you'll be smiling strong at ${roundDownToMultipleOf5(predictedAge-10)}.`
        ];
        healthAdvice.textContent = sentences[Math.floor(Math.random() * sentences.length)];
    } else {
        let sentences = [
            "At this rate, your future self will be asking you for a refund on your life choices!",
            "Your body's holding up like an old laptop — still running somehow, but maybe a few updates before retirement would help",
            `You don't need to be perfect — just one healthy choice a day and ${predictedAge} will turn into a checkpoint, not a finish line.`,
            `You've already made it this far living on pure chaos; imagine what you could do if you gave your body a little backup before ${roundDownToMultipleOf5(predictedAge - 10)}!`,
        ];
        healthAdvice.textContent = sentences[Math.floor(Math.random() * sentences.length)];
    }

    let averageLifespan = 75;
    let lifespanDiff = predictedAge - averageLifespan;
    // Set age message
    if (lifespanDiff > 0) {
        ageMessageElement.textContent = `Congratulations! Your lifestyle choices may add ${selectedValue} years to the average lifespan.`;
        ageMessageElement.className = "text-green-600 mb-6";
        createConfetti();
    } else if (lifespanDiff < 0) {
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

function interpolateColor(color1, color2, k) {
    // Ensure k is between 0 and 100
    k = Math.max(0, Math.min(100, k));

    // Convert hex color to RGB components
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    // Extract RGB from hex using bit shifts
    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    // Compute interpolation factor (0–1)
    const t = k / 100;

    // Linear interpolation for each channel
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    // Convert back to hex and return
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)}`;
}


function createWheel(healthPercentage, currentAge = 60) {
    const svg = document.getElementById('wheelSvg');
    const centerX = 150;
    const centerY = 150;
    const radius = 140;
    var _wheelNumbers = getRandomAgeNumbers(healthPercentage, currentAge);
    wheelNumbers = _wheelNumbers
    const segments = _wheelNumbers.length;
    const anglePerSegment = 360 / segments;

    // Clear existing content
    svg.innerHTML = '';

    // Create segments
    wheelNumbers.forEach((num, i) => {
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;

        // Create path for segment
        const startAngleRad = (startAngle - 90) * Math.PI / 180;
        const endAngleRad = (endAngle - 90) * Math.PI / 180;

        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);

        const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        // Determine color based on number value
        const number = num;
        // let color;
        // if (number >= 85) color = '#10b981'; // green-500
        // else if (number >= 77) color = '#84cc16'; // lime-500
        // else if (number >= 70) color = '#eab308'; // yellow-500
        // else if (number >= 65) color = '#f97316'; // orange-500
        // else color = '#ef4444'; // red-500
        let color = interpolateColor('#ef4444', '#10b981', (number - currentAge + 7) * 10);

        // Create segment path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);

        // Add text
        const textAngle = startAngle + anglePerSegment / 2;
        const textAngleRad = (textAngle - 90) * Math.PI / 180;
        const textRadius = radius * 0.7;
        const textX = centerX + textRadius * Math.cos(textAngleRad);
        const textY = centerY + textRadius * Math.sin(textAngleRad);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('transform', `rotate(${textAngle}, ${textX}, ${textY})`);
        text.textContent = number > 0 ? `+${number}` : number.toString();
        svg.appendChild(text);
    })
}

// Spin button handler
document.getElementById('spin-button').addEventListener('click', function () {
    if (isSpinning) return;

    isSpinning = true;
    this.disabled = true;
    this.textContent = 'Spinning...';
    this.classList.add('opacity-50');

    // // Random spin (3-8 full rotations plus random position)
    const sections = wheelNumbers.length;
    const sectionAngle = 360 / sections;
    // const randomSection = Math.floor(Math.random() * sections);
    // const extraDegrees = randomSection * sectionAngle;
    // const totalDegrees = 1800 + extraDegrees + Math.floor(Math.random() * sectionAngle);

    const spins = 3 + Math.random() * 5;
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;
    lastRotation = totalRotation;

    // Calculate which segment we land on
    const normalizedAngle = (360 - (finalAngle % 360)) % 360;
    const segmentIndex = Math.floor(normalizedAngle / (360 / wheelNumbers.length));
    selectedNumber = wheelNumbers[segmentIndex];

    // Apply spin animation
    const wheelSvg = document.getElementById('wheelSvg');
    wheelSvg.style.setProperty('--spin-degrees', `${totalRotation}deg`);
    wheelSvg.classList.add('spin-animation');

    // // Show result after animation
    // setTimeout(() => {
    //     document.getElementById('landedNumber').textContent = selectedNumber > 0 ? `+${selectedNumber}` : selectedNumber;
    //     document.getElementById('spinResult').classList.remove('hidden');

    //     // Show continue button
    //     setTimeout(() => {
    //         showResults();
    //     }, 1500);
    // }, 3000);


    // Get the selected value after spinning
    setTimeout(() => {
        // document.getElementById('landedNumber').textContent = selectedNumber > 0 ? `+${selectedNumber}` : selectedNumber;
        // document.getElementById('spinResult').classList.remove('hidden');

        // Calculate which section is at the top (opposite of the rotation)
        // const normalizedDegrees = totalDegrees % 360;
        const normalizedDegrees = totalRotation % 360;
        const sectionIndex = Math.floor((360 - normalizedDegrees) / sectionAngle) % sections;

        // Get all sections and find the selected one
        // const allSections = document.querySelectorAll('.wheel-section');
        // console.log(allSections)
        // console.log(allSections[sectionIndex])
        // selectedValue = parseInt(allSections[sectionIndex].dataset.value);
        selectedValue = wheelNumbers[sectionIndex];

        // Show results after a short delay
        setTimeout(() => {
            showResults();
            updateProgress(100);
        }, 500);
    }, 5000); // Match the CSS transition duration
});

// Restart the quiz
restartButton.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    isSpinning = false;
    spinButton.disabled = false;
    spinButton.textContent = 'SPIN THE WHEEL';
    spinButton.classList.remove('opacity-50');
    // wheelSvg.style.transform = 'rotate(0deg)';
    // wheelSvg.style.setProperty('--spin-degrees', `${-1 * lastRotation}deg`);
    wheelSvg.classList.remove('spin-animation');
    initQuiz();
});

// Initialize the quiz on page load
initQuiz();