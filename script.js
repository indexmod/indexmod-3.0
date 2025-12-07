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
    const postText = `# ${topic}\n\n(Пока текст пустой. Заполните вручную.)`;
    const encodedText = encodeURIComponent(postText);
    const url = `https://t.me/indexmod?text=${encodedText}`;
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
        container.innerHTML = "";

        const columns = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
        columns.forEach(col => col.className = "column");

        let currentLetter = "";

        topics.forEach((topic, i) => {
            let first = topic[0].toUpperCase();

            if (first !== currentLetter) {
                currentLetter = first;
                const h2 = document.createElement("h2");
                h2.textContent = currentLetter;

                // создаём секцию для буквы
                const group = document.createElement("div");
                group.className = "topic-group";
                group.appendChild(h2);

                columns[i % 3].appendChild(group);
            }

            const div = document.createElement("div");
            div.className = "topic";
            div.textContent = topic;
            div.onclick = () => generatePost(topic);

            // добавляем в последнюю секцию буквы
            const lastGroup = columns[i % 3].lastElementChild;
            lastGroup.appendChild(div);
        });

        columns.forEach(c => container.appendChild(c));

    } catch (err) {
        console.error("Ошибка загрузки топиков:", err);
    }
}

loadTopics();
