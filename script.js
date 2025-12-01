async function loadTopics() {
  const txt = await fetch("topics.txt").then(r => r.text());
  return txt.split("\n")
            .map(t => t.trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
}

async function renderTopics() {
  const topics = await loadTopics();
  const container = document.getElementById("topics");

  container.innerHTML = topics
    .map(t => `<div class="topic" onclick="generateArticle('${t}')">${t}</div>`)
    .join("");
}

async function generateArticle(topic) {
  const articleEl = document.getElementById("article");
  articleEl.innerHTML = `<p>Генерирую статью...</p>`;

  const prompt = `
Создай короткую структурированную статью о теме: "${topic}"
Формат:
# Заголовок
## Введение
## Основные факты
## Вывод
`;

  // ★ Вызов LLM
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Ты создаешь простые структурированные статьи." },
      { role: "user", content: prompt }
    ]
  });

  const article = completion.choices[0].message.content;

  // Рендер HTML
  articleEl.innerHTML = `
    <h2>${topic}</h2>
    <pre style="white-space: pre-wrap;">${article}</pre>

    <button onclick="downloadMD('${topic}', \`${article}\`)">⬇️ Скачать .md</button>
    <button onclick="downloadPDF('${topic}', \`${article}\`)">📄 PDF</button>
    <button onclick="uploadToGitHub('${topic}', \`${article}\`)">⬆️ Commit в GitHub</button>
  `;
}

function downloadMD(topic, text) {
  const blob = new Blob([text], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = topic + ".md";
  a.click();
}

async function downloadPDF(topic, text) {
  const blob = new Blob([text], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = topic + ".pdf";
  a.click();
}

async function uploadToGitHub(topic, text) {
  const fileName = topic.replace(/\s+/g, "-").toLowerCase() + ".md";

  const token = prompt("Введи GitHub токен (будет использован один раз):");

  const response = await fetch(`https://api.github.com/repos/indexmod/indexmod-3/contents/articles/${fileName}`, {
    method: "PUT",
    headers: {
      "Authorization": "token " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add article ${fileName}`,
      content: btoa(unescape(encodeURIComponent(text)))
    })
  });

  alert("Отправлено!");
}

renderTopics();
