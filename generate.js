import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const topicsFile = path.join(process.cwd(), 'topics.txt');
const generatedDir = path.join(process.cwd(), 'generated');

// Создаём папку generated, если нет
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir);

const topics = fs.readFileSync(topicsFile, 'utf-8')
  .split('\n')
  .map(t => t.trim())
  .filter(t => t.length > 0);

async function generateArticle(topic) {
  const prompt = `
Ты — экспертный Википедия-автор, исследователь и фактчекер.
Напиши структурированную статью о теме **${topic}** в стиле Wikipedia на языке топика.
Используй реальные источники, не выдумывай данные.
`.trim();

  const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 1500, temperature: 0.3 }
    }),
  });

  const json = await response.json();
  return Array.isArray(json) ? json[0]?.generated_text || "" : json.generated_text || "";
}

(async () => {
  for (const topic of topics) {
    try {
      const slug = topic.toLowerCase().replace(/\s+/g, '-');
      const article = await generateArticle(topic);
      fs.writeFileSync(path.join(generatedDir, `${slug}.md`), article, 'utf-8');
      console.log(`✅ ${topic} -> ${slug}.md`);
    } catch (err) {
      console.error(`❌ Ошибка для топика ${topic}:`, err);
    }
  }
})();
