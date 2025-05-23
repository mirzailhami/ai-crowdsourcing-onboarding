# CrowdLaunch: AI-Assisted Challenge Onboarding

**CrowdLaunch** is a web-based, AI-assisted onboarding tool that guides users through launching and monitoring crowdsourced innovation challenges. It simulates a subject matter expert, providing step-by-step guidance, AI-powered recommendations, and best practices from platforms like Topcoder, Wazoku, Kaggle, and HeroX. The tool supports first-time and experienced users with a hybrid experience combining conversational guidance and structured wizard steps.

## Features
- **7-Step Onboarding**: Define challenge (title, problem statement, type), set audience, specify submission requirements, configure prizes, set timeline, establish evaluation criteria, and monitor the challenge.
- **AI Assistance**: Powered by AWS Bedrock (Claude 3.7 Sonnet) via `/api/copilot` for rubric generation, prize recommendations, text summarization, and conversational guidance, with prompt caching for efficiency.
- **Dynamic Adaptation**: Seamlessly update challenge parameters (`PUT /api/challenges/{id}`) as user inputs change.
- **Support Requests**: Request human support via `/api/help` through a modal.
- **Frontend**: Next.js 15, Shadcn UI, Tailwind CSS, Framer Motion, deployed on Vercel.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (local via Docker Compose), AWS Bedrock, running locally via Docker Compose.

## Project Structure
```
.
├── backend
│   ├── Dockerfile
│   ├── app
│   │   ├── __init__.py
│   │   ├── api
│   │   │   ├── challenge.py
│   │   │   ├── copilot.py
│   │   │   ├── help_request.py
│   │   ├── main.py
│   │   ├── models
│   │   │   ├── base.py
│   │   │   ├── challenge.py
│   │   │   ├── help_request.py
│   │   ├── schemas
│   │   │   ├── challenge.py
│   │   │   ├── help_request.py
│   │   └── services
│   │       ├── db_service.py
│   ├── data
│   │   ├── init_db.sql
│   │   └── mock_data.sql
│   ├── requirements.txt
│   └── .env.dev
├── docker-compose.yml
├── docs
│   ├── cost-coverage-report.md
│   ├── demo-video.mp4
│   ├── user-guide.md
├── frontend
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── onboarding
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── ai-assistant.tsx
│   │   ├── challenge-summary.tsx
│   │   ├── floating-alert.tsx
│   │   ├── onboarding-steps.tsx
│   │   ├── support-modal.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui
│   ├── lib
│   │   ├── api.ts
│   │   ├── local-storage.ts
│   │   └── utils.ts
│   ├── public
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── .env.local
└── README.md
```

## Prerequisites
- **Docker and Docker Compose**: For running the backend and PostgreSQL.
- **Node.js v20+**: For the frontend.
- **Git**: To clone the repository.
- **AWS CLI**: For AWS Bedrock (AI features).

## Running Locally

### Configure AWS
1. Install AWS CLI:
   ```bash
   pip install awscli
   ```
2. Configure AWS credentials:
   ```bash
   aws configure
   ```
   - Enter AWS Access Key ID, Secret Access Key, region (`us-east-1`), output format (`json`).

### Backend Setup
1. **Create Environment File**:
   Create `backend/.env.dev`:
   ```env
   DATABASE_URL=postgresql://user:password@db:5432/challenge_db
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   - Starts PostgreSQL (`db:5432`) and FastAPI (`http://localhost:8000/api`).
   - Initializes database with `backend/data/init_db.sql` and `backend/data/mock_data.sql`.
   - Access Swagger UI at `http://localhost:8000/api/docs`.

3. **Verify**:
   - Test root: `curl http://localhost:8000/api`.
   - Test challenge creation: `curl -X POST -d '{"title":"Test","problem_statement":"Test problem","challenge_type":"Innovation"}' -H "Content-Type: application/json" http://localhost:8000/api/challenges`.
   - Test copilot: `curl -X POST -d '{"messages":[{"role":"user","content":"Test"}],"context":[],"formData":{},"step":1}' -H "Content-Type: application/json" http://localhost:8000/api/copilot`.

### Frontend Setup
1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment File**:
   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run Frontend**:
   ```bash
   npm run dev
   ```
   - App runs at `http://localhost:3000`.
   - Access onboarding at `http://localhost:3000/onboarding`.

5. **Verify**:
   - Open `http://localhost:3000/onboarding`.
   - Complete the 7-step onboarding, testing challenge creation, AI Assistant (`/api/copilot`), help requests (`/api/help`), and data persistence (`/api/challenges`).
   - Check `localStorage` for chat history (`crowdlaunch:chat-stepX`).

### Troubleshooting
- **Backend**:
  - PostgreSQL fails? Check `docker ps` for port `5432` conflicts.
  - Copilot fails? Verify AWS credentials in `backend/.env.dev` and Bedrock model access (`us.anthropic.claude-3-7-sonnet-20250219-v1:0`).
  - Schema errors? Ensure `data/init_db.sql` and `data/mock_data.sql` match `app/models/challenge.py`.
- **Frontend**:
  - API errors? Verify backend is running and `NEXT_PUBLIC_API_URL` is correct.
  - Animations missing? Ensure `framer-motion` is installed (`npm install framer-motion`).

## Sample Environment Files

### Backend (`backend/.env.dev`)
```env
DATABASE_URL=postgresql://user:password@db:5432/challenge_db
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Docker Compose
The `docker-compose.yml` runs PostgreSQL and FastAPI:
```yaml
version: '3.8'
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: challenge_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/challenge_db
    volumes:
      - ./backend:/app
      - ./backend/debug.log:/app/debug.log
    depends_on:
      - db
volumes:
  postgres_data:
```

## Deployment
- **Backend**: Deploy to AWS Elastic Beanstalk (optional, not currently used):
  - Create Elastic Beanstalk application (`challenge-onboarding`) and environment.
  - Use GitHub Actions for CI/CD.
- **Frontend**: Deploy to Vercel:
  - Link Vercel project to GitHub.
  - Set `NEXT_PUBLIC_API_URL=https://<backend-url>/api` in Vercel environment variables.
  - Use GitHub Actions for CI/CD.

## Testing
1. **Backend**:
   - Use Swagger UI (`http://localhost:8000/api/docs`) to test `/api/challenges`, `/api/copilot`, `/api/help`.
   - Verify database: `docker-compose exec db psql -U user -d challenge_db -c "SELECT * FROM challenges"`.
2. **Frontend**:
   - Test onboarding at `http://localhost:3000/onboarding`.
   - Verify challenge creation, AI Assistant, help requests, and animations.
3. **End-to-End**:
   - Complete 7 steps, check data in PostgreSQL (`challenges`, `help_requests` tables).
   - Test copilot responses and localStorage persistence.

## Deliverables
- **Demo Video**: `docs/demo-video.mp4` (<5 mins, shows onboarding, AI Assistant, help requests, Swagger UI).
- **User Guide**: `docs/user-guide.md` (usage instructions).
- **Cost Report**: `docs/cost-coverage-report.md` (Vercel, AWS costs).

## Notes
- **Dynamic Adaptation**: Challenge updates via `PUT /api/challenges/{id}`.
- **Forums**: Enabled via `enable_forums` in `challenges` table.
- **Anonymized Reviews**: Configurable via `anonymized_review` in `challenges` table.

For issues, check `backend/debug.log`.