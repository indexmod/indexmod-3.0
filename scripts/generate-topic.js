import fs from "fs";
import fetch from "node-fetch";

const topic = process.argv[2];
if (!topic) {
  console.error("Не передан topic");
  process.exit(1);
}

const prompt = `
Напиши статью о теме "${topic}" в формате Markdown.
`;

async function generate() {
  const res = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 2000 },
    }),
  });

  const data = await res.json();
  const md = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

  if (!md) {
    console.error("Ошибка генерации", data);
    process.exit(1);
  }

  const fileName = topic.toLowerCase().replace(/\s+/g, "-") + ".md";
  fs.writeFileSync(`generated/${fileName}`, md);
  console.log("Сгенерировано:", `generated/${fileName}`);
}

generate();
