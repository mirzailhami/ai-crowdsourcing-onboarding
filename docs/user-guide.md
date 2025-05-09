# User Guide

## Getting Started
Visit `http://localhost:3000` for local development or `https://<your-vercel-app>.vercel.app` for production.

## Launching a Challenge
1. Navigate to `/onboarding` or click "Get Started" on the homepage.
2. Follow the 7-step onboarding process:
   - **Step 1**: Define challenge title, problem statement, and type (e.g., Ideation, Innovation).
   - **Step 2**: Set audience (geographic filters, participant types, team participation, forums).
   - **Step 3**: Specify submission formats (e.g., ZIP, PDF) and documentation requirements.
   - **Step 4**: Configure prizes (prize model, amounts, non-monetary rewards; use AI recommendations).
   - **Step 5**: Set timeline (start/end dates, milestones).
   - **Step 6**: Define evaluation criteria (model, reviewers, criteria; use AI-generated rubric).
   - **Step 7**: Configure monitoring (notifications, success metrics).
3. Use the **AI Assistant** (powered by AWS Bedrock Claude 3.7 Sonnet with prompt caching) to ask questions at any step via `/api/copilot`.
4. Request human support via the "Get Support" button, which submits a help request to `/api/help`.

## Monitoring
- View notifications and success metrics in Step 7.
- Update challenge details via `PUT /api/challenges/{id}` as needed.
- Check challenge status in the database (`challenges` table).

## AI Assistant Details
- **Model**: Uses `us.anthropic.claude-3-7-sonnet-20250219-v1:0` for its advanced reasoning, support for prompt caching, and cost efficiency.
- **Why Chosen**: Selected over LLaMA 3 70B due to native prompt caching support, reducing latency and costs (90% discount on cached input tokens, per https://aws.amazon.com/blogs/machine-learning/effectively-use-prompt-caching-on-amazon-bedrock/). Claude 3.7 Sonnet offers robust natural language understanding and generation, ideal for conversational guidance.
- **Prompt Construction**: The prompt is structured as a list of messages with roles (`system` for instructions, `user` for context and queries). Cacheable parts (e.g., step instructions, form data, context) are marked with `"cache_control": {"type": "ephemeral"}`, while dynamic messages and suggestion requests remain non-cacheable.
- **Response Handling**: Responses are parsed from `content[0]["text"]`, with suggestions extracted via regex matching for a JSON array. Timestamps (`timestamp`, `createdAt`) are generated using `datetime.utcnow().isoformat() + "Z"`.
- **Prompt Caching**: Enabled to cache static prompt parts, improving performance and reducing Bedrock costs for repeated interactions.

## API Documentation
- Access Swagger UI at `http://localhost:8000/api/docs` for local development.
- Test endpoints: `/api/challenges`, `/api/copilot`, `/api/help`.

## Troubleshooting
- **API Errors**: Ensure backend is running (`http://localhost:8000/api`) and `NEXT_PUBLIC_API_URL` is set in `frontend/.env.local`.
- **Database Issues**: Verify PostgreSQL schema (`\d challenges`) matches `app/models/challenge.py`.
- **AI Assistant**: If `/api/copilot` fails, check AWS Bedrock credentials in `backend/.env.dev` and model access (`us.anthropic.claude-3-7-sonnet-20250219-v1:0`).