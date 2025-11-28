# AI Prompts Used

## 1) Coding prompt (AI-assisted coding)

"Write a Cloudflare Worker using Llama 3.3 to summarize user tasks."

This prompt was used to help generate the initial Worker code.

## 2) Runtime prompt (used inside the Worker)

"Summarize the following tasks into a short, clear plan. Group similar items together and keep the result under 5 bullet points."

This prompt is sent to the Llama 3.3 model each time the user submits tasks.
