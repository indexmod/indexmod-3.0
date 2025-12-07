// Загружаем топики и генерируем страницу
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

            // Если новая буква — создаём группу
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;

                const group = document.createElement("div");
                group.className = "topic-group";

                const h2 = document.createElement("h2");
                h2.textContent = currentLetter;
                group.appendChild(h2);

                columns[colIndex % 3].appendChild(group);
                colIndex++;
            }

            // Добавляем топик в последнюю группу колонки
            const currentColumn = columns[(colIndex - 1) % 3];
            const lastGroup = currentColumn.lastElementChild;

            const div = document.createElement("div");
            div.className = "topic";
            div.textContent = topic;

            lastGroup.appendChild(div);
        });

    } catch (err) {
        console.error("Ошибка загрузки топиков:", err);
    }
}

loadTopics();
