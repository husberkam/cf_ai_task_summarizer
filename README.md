# Task Summarizer – Cloudflare Workers AI (Llama 3.3)

This is a simple AI-powered application built for the Cloudflare Software Engineering Internship optional assignment.

The app lets a user paste a list of tasks into a text area. The Worker then calls the Llama 3.3 model on Workers AI to summarize the tasks into a short, organized plan. It also stores the latest task list in Workers KV as a minimal example of memory/state.

## How it works

1. On **GET** requests, the Worker returns a small HTML page with a form.
2. On **POST** requests, the Worker:
   - Reads the `tasks` field from the form.
   - Fetches the previous task list for a demo user from Workers KV (`TASKS`).
   - Sends both to the `@cf/meta/llama-3.3-70b-instruct-fp8-fast` model via `env.AI.run`.
   - Renders the summary back into the HTML page.
   - Updates the KV entry for that user.

## Tech used

- Cloudflare Workers
- Workers AI – Llama 3.3 text model
- Workers KV for simple memory/state

## Running locally (optional)

(These steps are not required for the internship assignment)

1. Install Wrangler CLI  
2. Run `wrangler login`  
3. Create a KV namespace: `wrangler kv namespace create TASKS`  
4. Put namespace into `wrangler.toml`  
5. Run the dev server: `wrangler dev`

You do **not** need to deploy or run the code to submit this assignment.
