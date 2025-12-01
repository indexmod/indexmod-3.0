async function loadTopics() {
    const response = await fetch("topics.txt");
    const text = await response.text();

    let topics = text.split("\n").map(t => t.trim()).filter(t => t.length > 0);
    topics.sort((a, b) => a.localeCompare(b));

    const container = document.getElementById("topics");

    let currentLetter = "";

    topics.forEach(topic => {
        const first = topic[0].toUpperCase();
        if (first !== currentLetter) {
            currentLetter = first;
            const h = document.createElement("h2");
            h.textContent = currentLetter;
            container.appendChild(h);
        }

        const div = document.createElement("div");
        div.className = "topic";
        div.textContent = topic;
        div.onclick = () => openArticle(topic);
        container.appendChild(div);
    });
}

async function generateArticle(topic) {
    // 🔥 Здесь ты подключишь свою LLM
    // Сейчас — простая заглушка
    return `
# ${topic}

Эта статья создана автоматически.
Здесь будет содержаться развернутая декларация и экспликация темы **${topic}**.
`;
}

function openArticle(topic) {
    generateArticle(topic).then(article => {
        document.getElementById("article").innerHTML =
            `<h2>${topic}</h2><pre>${article}</pre>`;
        document.getElementById("modal").style.display = "flex";

        document.getElementById("save-md").onclick = () => saveMD(topic, article);
        document.getElementById("save-pdf").onclick = () => savePDF();
    });
}

function saveMD(topic, text) {
    const blob = new Blob([text], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${topic}.md`;
    a.click();
}

function savePDF() {
    window.print();
}

document.getElementById("close-modal").onclick = () =>
    document.getElementById("modal").style.display = "none";

loadTopics();
