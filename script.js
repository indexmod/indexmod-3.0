// Генерируем slug
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/ё/g, "e")
        .replace(/[^\w]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

// Открываем Telegram для создания поста
function generatePost(topic) {
    const slug = slugify(topic);
    const date = new Date().toISOString().slice(0, 10);

    const postText = `# ${topic}\n\n(Пока текст пустой. Заполните вручную.)`;

    // Кодируем текст для URL
    const encodedText = encodeURIComponent(postText);

    // Ссылка для публикации в телеге (пользователь подтвердит пост)
    const url = `https://t.me/indexmod?text=${encodedText}`;

    // Открываем в новой вкладке
    window.open(url, "_blank");
}

// Загружаем топики
async function loadTopics() {
    try {
        const response = await fetch("topics.txt");

        if (!response.ok) {
            console.error("Не удалось загрузить topics.txt");
            return;
        }

        const text = await response.text();
        let topics = text.split("\n").map(t => t.trim()).filter(Boolean);

        topics.sort((a, b) => a.localeCompare(b));

        const container = document.getElementById("topics");
        container.innerHTML = ""; // очистим контейнер

        let currentLetter = "";
        let columns = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
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

            div.onclick = () => generatePost(topic);

            columns[i % 3].appendChild(div);
        });

        columns.forEach(c => container.appendChild(c));

    } catch (err) {
        console.error("Ошибка загрузки топиков:", err);
    }
}

loadTopics();
