let initialized = false;


export function surveyEngine() {
    if (initialized) return;
    initialized = true;


    const questions = [
        "Я завжди зважую всі варіанти перед прийняттям рішення.",
        // "Перед тим, як діяти, я перевіряю, чи правдива інформація.",
        // "Якщо мені наводять переконливі аргументи, я готовий(а) змінити свою думку.",
        // "Я знаю, як правильно розподіляти свій час, щоб не перевантажуватися.",
        // "Я майже завжди встигаю зробити все вчасно.",
        // "Я чітко розставляю пріоритети в своїй роботі.",
        // "Емоції не заважають мені приймати зважені рішення.",
        // "Після невдач я швидко беру себе в руки і рухаюся далі.",
        // "Коли я втомлений(а) або перевантажений(а), відкладаю роботу на потім.",
        // "Часом емоції беруть гору над логікою, і я приймаю поспішні рішення.",
        // "Я заряджаю свою команду енергією та мотивацією.",
        // "Часто я відчуваю, що мої ідеї не знаходять підтримки.",
        // "Я впевнено почуваюся під час публічних виступів і переговорів."
    ];

    function initSurvey() {
        const questionContainer = document.getElementById("question-container");
        const form = document.getElementById("survey-form");
        const title = document.querySelector(".survey-title");


        let currentStep = -1;
        const formData = {};

        function renderQuestion(index) {
            title.innerHTML = `Питання ${index + 1} з ${questions.length}`;


            questionContainer.innerHTML = `
        <div class="step active">
          <p>${questions[index]}</p>
          <div class="options">
            ${[1, 2, 3, 4, 5].map(num => `
              <label class="option">
                <input type="radio" name="q${index + 1}" value="${num}"><span>${num}</span>
              </label>`).join('')}
            </div>
          <button type="button" class="next-btn" disabled>${index < questions.length - 1 ? 'Далі' : 'Завершити'}</button>
        </div>
      `;

            const nextBtn = questionContainer.querySelector('.next-btn');
            const radios = questionContainer.querySelectorAll('input[type="radio"]');

            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    nextBtn.disabled = false;
                });
            });

            nextBtn.addEventListener('click', () => {
                const selected = questionContainer.querySelector('input[type="radio"]:checked').value;
                formData[`q${index + 1}`] = selected;

                currentStep++;
                if (currentStep < questions.length) {
                    renderQuestion(currentStep);
                } else {
                    form.dispatchEvent(new Event('submit'));
                }
            });
        }

        document.querySelector(".next-btn").addEventListener("click", function () {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();

            if (!name || !email) {
                alert("Будь ласка, заповніть всі поля");
                return;
            }

            formData.name = name;
            formData.email = email;

            currentStep = 0;
            document.querySelector(".step.active").classList.remove("active");
            renderQuestion(currentStep);
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            try {
                const response = await fetch("https://skiloveaisurvey-production.up.railway.app/api/survey", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const responseData = await response.json();
                document.getElementById("json-output").textContent = JSON.stringify(responseData, null, 2);
                document.getElementById("json-output").classList.remove("hidden");
                document.getElementById("message").classList.remove("hidden");
                document.getElementById("return-btn").classList.remove("hidden");
                form.classList.add("hidden");

            } catch (error) {
                console.error("Помилка запиту:", error);
            }
        });
    }

    initSurvey();
}

let htmxInitialized = false;
document.body.addEventListener("htmx:afterSettle", () => {
    if (!htmxInitialized) {
        htmxInitialized = true;
        surveyEngine();
    }
});