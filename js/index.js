function init() {
    import("./index.survey.js").then(module => {
        module.surveyEngine(); // Викликаємо функцію ініціалізації
    }).catch(err => console.error("Помилка завантаження index.survey.js", err));
}

// Підраховуємо кількість partials **лише один раз**
const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
let loadedPartialsCount = 0;

console.log("Total Partials:", totalPartials);

document.body.addEventListener("htmx:afterOnLoad", () => {
    loadedPartialsCount++;
    console.log(`Loaded Partials: ${loadedPartialsCount} out of ${totalPartials}`);

    if (loadedPartialsCount === totalPartials) {
        console.log("Всі partials завантажені. Ініціалізуємо опитування...");
        init();
    }
});