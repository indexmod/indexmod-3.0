// Генерируем slug (для внутреннего использования)
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
        const topics = text.split("\n").map(t => t.trim()).filter(Boolean);
        topics.sort((a, b) => a.localeCompare(b));

        const container = document.getElementById("topics");
        container.innerHTML = "";

        // Создаём 3 колонки
        const columns = [];
        for (let i = 0; i < 3; i++) {
            const col = document.createElement("div");
            col.className = "column";
            columns.push(col);
            container.appendChild(col);
        }

        let currentLetter = "";
        let colIndex = 0;

        topics.forEach((topic) => {
            const firstLetter = topic[0].toUpperCase();

            // Если новая буква — создаём секцию
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;

                const group = document.createElement("div");
                group.className = "topic-group";

                const h2 = document.createElement("h2");
                h2.textContent = currentLetter;
                group.appendChild(h2);

                // Добавляем группу в колонку
                columns[colIndex % 3].appendChild(group);

                colIndex++;
            }

            // Находим последнюю группу в текущей колонке
            const currentColumn = columns[(colIndex - 1) % 3];
            const lastGroup = currentColumn.lastElementChild;

            // Создаём топик
            const div = document.createElement("div");
            div.className = "topic";
            div.textContent = topic;
            div.onclick = () => generatePost(topic);

            // Добавляем в последнюю группу
            lastGroup.appendChild(div);
        });

    } catch (err) {
        console.error("Ошибка загрузки топиков:", err);
    }
}

loadTopics();
