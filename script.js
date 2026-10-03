document.addEventListener('DOMContentLoaded', function() {
    let quizData = {};

    fetch('Indian -quiz-data.json')
        .then(response => response.json())
        .then(data => {
            quizData = data;
            initSections();
        })
        .catch(error => console.error('Failed to load quiz data:', error));

    function initSections() {
        let sections = document.querySelectorAll('.section');
        sections.forEach((section) => {
            section.addEventListener("click", () => {
                let sectionNumber = parseInt(section.getAttribute("data-section"));
                startQuiz(sectionNumber);
            });
        });
    }

    function startQuiz(index) {
        const currentQuestions = quizData.sections[index].questions;
        let currentQuestionIndex = 0;
        let score = 0;
        let answerSelected = false;

        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("question-container").style.display = "block";
        document.getElementById("question-container").innerHTML =
            `<p id="score">Score: 0</p>
            <div id="question"></div>
            <div id="options"></div>
            <button id="next-button">Next</button>`;

        showQuestion();

        function showQuestion() {
            const question = currentQuestions[currentQuestionIndex];
            const questionElement = document.getElementById('question');
            const optionsElement = document.getElementById('options');
            questionElement.textContent = question.question;
            optionsElement.innerHTML = '';
            answerSelected = false;

            const feedbackElement = document.getElementById('feedback');
            if (feedbackElement) feedbackElement.remove();

            if (question.questionType === "mcq") {
                question.options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.textContent = option;
                    optionElement.addEventListener('click', function() {
                        if (!answerSelected) {
                            answerSelected = true;
                            optionElement.classList.add("selected");
                            checkAnswer(option, question.answer);
                            console.log("selected option", option);
                        }
                    });
                    optionsElement.appendChild(optionElement);
                });
            } else if (question.questionType === "text" || question.questionType === "number") {
                const input = document.createElement('input');
                input.type = question.questionType === "number" ? "number" : "text";
                input.placeholder = "Type your answer here...";
                const submitBtn = document.createElement('button');
                submitBtn.textContent = "Submit";
                submitBtn.addEventListener('click', function() {
                    if (!answerSelected) {
                        answerSelected = true;
                        checkAnswer(input.value.trim(), String(question.answer));
                    }
                });
                optionsElement.appendChild(input);
                optionsElement.appendChild(submitBtn);
            }
        }

        function checkAnswer(givenAnswer, correctAnswer) {
            const feedbackElement = document.createElement('div');
            feedbackElement.id = 'feedback';
            if (givenAnswer === correctAnswer || correctAnswer.toLowerCase() === givenAnswer.toLowerCase()) {
                score++;
                feedbackElement.textContent = "Correct!";
                feedbackElement.style.color = "green";
            } else {
                feedbackElement.textContent = `Wrong. Correct answer: ${correctAnswer}`;
                feedbackElement.style.color = "red";
            }
            const optionsElement = document.getElementById('options');
            optionsElement.append(feedbackElement);
            updateScore();
        }

        function updateScore() {
            document.getElementById("score").textContent = "Score: " + score;
        }

        document.getElementById("next-button").addEventListener("click", function handleNext() {
            document.getElementById("next-button").removeEventListener("click", handleNext);
            if (currentQuestionIndex >= currentQuestions.length - 1) {
                console.log("Quiz Over!");
                endQuiz();
            } else {
                currentQuestionIndex++;
                showQuestion();
                document.getElementById("next-button").addEventListener("click", handleNext);
            }
        });

        function endQuiz() {
            const questionContainer = document.getElementById('question-container');
            const quizContainer = document.getElementById('quiz-container');
            questionContainer.innerHTML =
                `<h1>Quiz Completed!</h1>
                <p>Your final score is: ${score} / ${currentQuestions.length}</p>
                <button id="home-button">Back to Home</button>`;
            document.getElementById("home-button").addEventListener("click", function() {
                questionContainer.style.display = "none";
                quizContainer.style.display = "";
            });
        }
    }
});
