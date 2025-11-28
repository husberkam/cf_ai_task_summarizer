export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      return new Response(renderPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const tasks = (formData.get("tasks") || "").toString().trim();
      const userId = "demo-user"; // gerçek uygulamada cookie / auth vs. ile gelir

      // pull out old tasks (basit memory / state)
      const previousTasks = (await env.TASKS.get(userId)) || "";

      const runtimePrompt = `
Summarize the following tasks into a short, clear plan.
Group similar items together and keep the result under 5 bullet points.

New tasks:
${tasks}

Previous tasks (may be empty):
${previousTasks}
      `.trim();

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        {
          messages: [
            {
              role: "user",
              content: runtimePrompt,
            },
          ],
        }
      );

      // base
      const summary =
        aiResponse.response ||
        aiResponse.result ||
        JSON.stringify(aiResponse);

      // new tasks saved to KV
      await env.TASKS.put(userId, tasks);

      return new Response(renderPage(tasks, summary), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};

function renderPage(tasks = "", summary = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Task Summarizer on Cloudflare Workers AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
      max-width: 700px;
      margin: 2rem auto;
      padding: 1rem;
      background: #0f172a;
      color: #e5e7eb;
    }
    h1 {
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin-top: 0.3rem;
      margin-bottom: 0.6rem;
    }
    textarea {
      width: 100%;
      min-height: 140px;
      border-radius: 0.5rem;
      border: 1px solid #4b5563;
      padding: 0.75rem;
      resize: vertical;
      font-family: inherit;
    }
    button {
      margin-top: 0.75rem;
      padding: 0.6rem 1.2rem;
      border-radius: 0.5rem;
      border: none;
      background: #22c55e;
      color: #022c22;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover {
      background: #16a34a;
    }
    .box {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: #020617;
      border: 1px solid #1f2937;
    }
    .label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9ca3af;
      margin-bottom: 0.35rem;
    }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
      font-family: inherit;
    }
  </style>
</head>
<body>
  <h1>Task Summarizer (Cloudflare Workers AI + Llama 3.3)</h1>
  <p>Paste your tasks below (one per line). The AI will summarize them into a short, organized plan.</p>

  <form method="POST">
    <label class="label" for="tasks">Your tasks</label>
    <textarea id="tasks" name="tasks" placeholder="- Finish homework
- Study for CS exam
- Clean room
- Go grocery shopping
- Call my friend">${tasks}</textarea>
    <button type="submit">Summarize</button>
  </form>

  <div class="box">
    <div class="label">Summary</div>
    <pre>${summary || "No summary yet. Submit some tasks to see the result."}</pre>
  </div>
</body>
</html>
`;
}
