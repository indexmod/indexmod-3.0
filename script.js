async function loadTopics() {
  const response = await fetch("topics.txt");
  const text = await response.text();
  let topics = text.split("\n").map(t => t.trim()).filter(t => t.length > 0);
  topics.sort((a, b) => a.localeCompare(b));

  const container = document.getElementById("topics");
  let currentLetter = "";

  let columns = [document.createElement("div"), document.createElement("div"), document.createElement("div")];
  columns.forEach(c => c.className = "column");

  topics.forEach((topic, i) => {
    const first = topic[0].toUpperCase();
    if (first !== currentLetter) {
      currentLetter = first;
      const h = document.createElement("h2");
      h.textContent = currentLetter;
      columns[i % 3].appendChild(h);
    }

    const div = document.createElement("div");
    div.className = "topic";
    div.textContent = topic;
    div.onclick = () => openArticle(topic);
    columns[i % 3].appendChild(div);
  });

  columns.forEach(c => container.appendChild(c));
}

// Преобразуем тему в slug
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Загружаем сгенерированную md-статью
async function openArticle(topic) {
  const slug = slugify(topic);
  const mdPath = `generated/${slug}.md`;

  try {
    const response = await fetch(mdPath);
    if (!response.ok) throw new Error("Файл не найден");
    const article = await response.text();

    document.getElementById("article").innerHTML = `<h2>${topic}</h2><pre>${article}</pre>`;
    document.getElementById("modal").style.display = "flex";

    document.getElementById("save-md").onclick = () => saveMD(topic, article);
    document.getElementById("save-pdf").onclick = () => savePDF();
  } catch (err) {
    document.getElementById("article").innerHTML = `<h2>${topic}</h2><p>Ошибка загрузки статьи: ${err.message}</p>`;
    document.getElementById("modal").style.display = "flex";
  }
}

function saveMD(topic, text) {
  const blob = new Blob([text], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${topic}.md`;
  a.click();
}

function savePDF() {
  const element = document.getElementById("article");
  if (window.html2pdf) {
    html2pdf().from(element).save();
  } else {
    window.print();
  }
}

document.getElementById("close-modal").onclick = () => {
  document.getElementById("modal").style.display = "none";
};

loadTopics();
