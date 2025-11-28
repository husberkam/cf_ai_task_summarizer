# AI Prompts Used

## 1) Coding prompt (AI-assisted coding)

"Write a Cloudflare Worker using Llama 3.3 to summarize user tasks."

I used this prompt with an AI assistant to help me generate and refine the initial version of the Worker code.

## 2) Runtime prompt (used inside the Worker)

"Summarize the following tasks into a short, clear plan. Group similar items together and keep the result under 5 bullet points."

This prompt is sent from the Worker to the Llama 3.3 model to generate the summary for the user’s task list.
