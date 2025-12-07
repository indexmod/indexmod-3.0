// Генерируем slug (опционально, можно оставить для своих целей)
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

    // Кодируем текст для URL
    const encodedText = encodeURIComponent(postText);

    // Ссылка на канал с текстом
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
        container.innerHTML = "";

        const columns = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];
        columns.forEach(col
