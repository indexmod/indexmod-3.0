// Открываем Telegram с готовым постом
function openTelegramPost(topic) {
    const postText = `# ${topic}\n\n(Пока текст пустой. Заполните вручную.)`;
    const encodedText = encodeURIComponent(postText);
    const url = `https://t.me/indexmod?text=${encodedText}`;
    window.open(url, "_blank");
}

// Загружаем топики и создаём страницы
async function loadTopics() {
    const container = document.getElementById("topics");
    container.innerHTML = "";

    try {
        const response = await fetch("topics.txt");
        if (!response.ok) {
            container.textContent = "Не удалось загрузить topics.txt";
            return;
        }

        const text = await response.text();
        const topics = text.split("\n").map(t => t.trim()).filter(Boolean);
        topics.sort((a, b) => a.localeCompare(b, 'ru'));

        // Создаём три колонки
        const columns = [];
        for (let i = 0; i < 3; i++) {
            const col = document.createElement("div");
            col.className = "column";
            container.appendChild(col);
            columns.push(col);
        }

        // Группируем по первой букве
        const groups = {};
        topics.forEach(topic => {
            const letter = topic[0].toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(topic);
        });

        const letters = Object.keys(groups).sort();
        let colIndex = 0;

        letters.forEach(letter => {
            const groupDiv = document.createElement("div");
            groupDiv.className = "topic-group";

            const h2 = document.createElement("h2");
            h2.textContent = letter;
            groupDiv.appendChild(h2);

            groups[letter].forEach(topic => {
                const div = document.createElement("div");
                div.className = "topic";
                div.textContent = topic;
                div.onclick = () => openTelegramPost(topic);
                groupDiv.appendChild(div);
            });

            // Добавляем группу в колонку
            columns[colIndex % 3].appendChild(groupDiv);
            colIndex++;
        });

    } catch (err) {
        console.error(err);
        container.textContent = "Ошибка при загрузке топиков.";
    }
}

loadTopics();
