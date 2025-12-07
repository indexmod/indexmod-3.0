// Загружаем список топиков
async function loadTopics() {
    const response = await fetch("topics.txt");
    const text = await response.text();
    let topics = text.split("\n").map(t => t.trim()).filter(Boolean);

    topics.sort((a, b) => a.localeCompare(b));

    const container = document.getElementById("topics");
    let currentLetter = "";
    let columns = [document.createElement("div"), document.createElement("div"), document.createElement("div")];
    columns.forEach(col => col.className = "column");

    topics.forEach((topic, i) => {
        let first = topic[0].toUpperCase();
        if (first !== currentLetter) {
            currentLetter = first;
            const h = document.createElement("h2");
            h.textContent = currentLetter;
            columns[i % 3].appendChild(h);
        }

        const div = document.createElement("div");
        div.className = "topic";
        div.textContent = topic;

        div.onclick = () => generateMD(topic);

        columns[i % 3].appendChild(div);
    });

    columns.forEach(c => container.appendChild(c));
}

// Генерируем slug
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/ё/g, "e")
        .replace(/[^\w]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

// Создаём MD-файл локально
function generateMD(topic) {
    const slug = slugify(topic);
    const date = new Date().toISOString().slice(0, 10);

    const md = `---
title: "${topic}"
slug: "${slug}"
created: "${date}"
---

# ${topic}

(Пока текст пустой. Заполните вручную.)
`;

    // Локальное сохранение .md файла
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug}.md`;
    a.click();

    alert("Файл сохранён. Переместите его в папку generated/ вашего репозитория и закоммитьте.");
}

loadTopics();
