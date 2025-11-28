export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response(renderPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const tasks = (formData.get("tasks") || "").toString();

      const previousTasks = (await env.TASKS.get("demo-user")) || "";

      const runtimePrompt = `
Summarize the following tasks into a short, clear plan.
Group similar items together and keep the result under 5 bullet points.

New tasks:
${tasks}

Previous tasks:
${previousTasks}
      `;

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        {
          messages: [
            { role: "user", content: runtimePrompt }
          ],
        }
      );

      const summary =
        aiResponse.response ||
        aiResponse.result ||
        JSON.stringify(aiResponse);

      await env.TASKS.put("demo-user", tasks);

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
<html>
<head>
  <meta charset="UTF-8" />
  <title>Task Summarizer</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 2rem auto; }
    textarea { width: 100%; height: 140px; }
    pre { background: #f4f4f4; padding: 1rem; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Cloudflare Workers AI – Task Summarizer</h1>

  <form method="POST">
    <textarea name="tasks" placeholder="Write your tasks here...">${tasks}</textarea>
    <button type="submit">Summarize</button>
  </form>

  <h2>Summary</h2>
  <pre>${summary || "No summary yet."}</pre>
</body>
</html>
`;
}
