// script.js

// ▶ Загрузка топиков из текстового файла
async function loadTopics() {
    const response = await fetch("topics.txt");
    const text = await response.text();

    let topics = text.split("\n")
                     .map(t => t.trim())
                     .filter(t => t.length > 0);
    topics.sort((a, b) => a.localeCompare(b));

    const container = document.getElementById("topics");
    container.innerHTML = ""; // Очистка перед рендером

    const columnsContainer = document.createElement("div");
    columnsContainer.className = "columns-container";
    container.appendChild(columnsContainer);

    const colCount = 3;
    const columns = [];
    for (let i = 0; i < colCount; i++) {
        const col = document.createElement("div");
        col.className = "column";
        columnsContainer.appendChild(col);
        columns.push(col);
    }

    let currentLetter = "";
    let colIndex = 0;

    topics.forEach(topic => {
        const first = topic[0].toUpperCase();
        if (first !== currentLetter) {
            currentLetter = first;
            const h = document.createElement("h2");
            h.textContent = currentLetter;
            columns[colIndex % colCount].appendChild(h);
            colIndex++;
        }

        const div = document.createElement("div");
        div.className = "topic";
        div.textContent = topic;
        div.onclick = () => openArticle(topic);
        columns[colIndex % colCount].appendChild(div);
    });
}

// ▶ Генерация статьи через Cloudflare Worker
async function generateArticle(topic) {
    try {
        // <-- Указываем URL твоего Worker -->
        const workerURL = "https://steep-block-7d70.indexmod-ce3.workers.dev/";

        const response = await fetch(workerURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic })
        });

        const data = await response.json();

        if (!data) return "Пустой ответ от модели.";
        if (data.error) return "Ошибка модели: " + data.error;

        // Cloudflare Worker возвращает поле article
        if (data.article) return data.article;

        return JSON.stringify(data, null, 2);
    } catch (err) {
        return `Ошибка запроса: ${err.message}`;
    }
}

// ▶ Открытие статьи в модальном окне
function openArticle(topic) {
    generateArticle(topic).then(article => {
        const articleContainer = document.getElementById("article");
        articleContainer.innerHTML = `
            <h2>${topic}</h2>
            <div class="article-body">${article}</div>
        `;

        document.getElementById("modal").style.display = "flex";

        document.getElementById("save-md").onclick = () => saveMD(topic, article);
        document.getElementById("save-pdf").onclick = () => savePDF();
    });
}

// ▶ Сохранение статьи в Markdown
function saveMD(topic, text) {
    const blob = new Blob([text], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${topic}.md`;
    a.click();
}

// ▶ Сохранение статьи как PDF
function savePDF() {
    const element = document.getElementById("article");
    if (window.html2pdf) {
        html2pdf().from(element).save();
    } else {
        alert("html2pdf.js не подключен!");
    }
}

// ▶ Закрытие модалки
document.getElementById("close-modal").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

// ▶ Запуск загрузки топиков
loadTopics();
