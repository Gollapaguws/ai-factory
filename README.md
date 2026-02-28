# AI Factory (Internal)

## Prereqs
- Docker + Docker Compose
- Node 20+

## Bootstrap (2 engineers)
make bootstrap

If `.env` does not exist yet:

cp .env.example .env

## URLs
- Web Console: http://localhost:3001
- API: http://localhost:3000

## Networking Defaults
- `web-console` and `orchestrator-api` bind to `127.0.0.1` only
- `postgres` and `redis` are internal-only (no public host ports)

## Common Commands
make build     # build images
make up        # start
make down      # stop
make reset     # wipe + rebuild
make logs      # tail logs
make verify-prod  # run production safety checks

## Reverse Proxy (Caddy)
- Use [infra/caddy/Caddyfile](infra/caddy/Caddyfile) as the starting point
- Replace the email and domains before deploying on VPS
- Keep API/Web bound to `127.0.0.1` in compose and expose only 80/443 via Caddy

## Production Verification
- Run: `make verify-prod`
- Optional HTTPS checks:
	- `WEB_DOMAIN=ai.infinitecraftmedia.com API_DOMAIN=api.ai.infinitecraftmedia.com make verify-prod`
- Script location: [scripts/verify-production.sh](scripts/verify-production.sh)

## Dev Flow
1. Create project in Web Console
2. Describe tool you want to build
3. Watch sandbox build logs
4. Preview app
5. Iterate

## Rules
- Do not add infra deps without policy update
- Never commit secrets
- AI outputs diffs only

## Features
- Natural language app creation
- Automated backend logic and infrastructure
- AI model integration (OpenAI & Anthropic)
- OAuth authentication (for 2 engineers)
- Local storage for generated projects

## Extended Features
- **App Templates Library:** Pre-built templates for dashboards, CRUD apps, and data visualizers.
- **One-Click Deployment:** Integrated Docker Compose/Kubernetes for instant local or cloud deployment.
- **Version Control Integration:** Auto-generated Git repos for each app, with commit history and rollback.
- **Custom Code Injection:** Add custom code snippets or modules to generated apps.
- **API Connector:** Drag-and-drop or natural language setup for connecting to external APIs or databases.
- **Automated Testing:** Basic test suites auto-generated for each app scaffold.
- **Usage Analytics:** Track generated app usage and gather feedback.
- **Role-Based Access:** Fine-grained permissions for different app sections or features.
- **Dark Mode & Theming:** Quick toggle for UI themes.
- **ChatOps Integration:** Slack/Discord bot to trigger app generation or deployments via chat commands.

## Advanced Features
- **Realtime Collaboration:** Simultaneous editing of app ideas or code by both engineers.
- **AI-Powered Code Review:** Automated review of generated or custom code for bugs, security, and best practices.
- **Plugin/Extension System:** Add or remove features via plugins (e.g., new templates, integrations).
- **Visual Workflow Builder:** Drag-and-drop interface to design app logic and data flows visually.
- **Secrets Management:** Secure storage and injection of API keys, passwords, and other secrets into generated apps.
- **Mobile App Generation:** Option to scaffold mobile (React Native/Flutter) apps from ideas.
- **Automated Documentation:** Auto-generate user and developer docs for each app.
- **Performance Monitoring:** Built-in tools to monitor app performance and resource usage.
- **Backup & Restore:** One-click backup and restore for generated apps and their data.
- **A/B Testing Tools:** Easily set up and analyze A/B tests for features in generated apps.

## Additional Features
- **Automated Dependency Updates:** Monitor and update dependencies in generated apps automatically.
- **Webhooks & Event Triggers:** Allow apps to react to external events or send webhooks.
- **Data Import/Export Tools:** Easily import/export data (CSV, JSON, Excel) for generated apps.

## Environment Variables
Create a `.env` file in the root directory with the following:
```
# OAuth
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_PROVIDER=google # or github, etc.
ALLOWED_USERS=email1@example.com,email2@example.com

# OpenAI
OPENAI_API_KEY=your-openai-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-key
```

## Setup
1. Clone the repository and enter the directory.
2. Configure your `.env` as above.
3. Install dependencies:
   ```
   cd apps/orchestrator-api && npm install
   cd ../web-console && npm install
   cd ../worker && npm install
   ```
4. Start services:
   ```
   make up
   ```

## Usage
- Access the Web Console in your browser.
- Log in using OAuth (only the two allowed users will be granted access).
- Enter your app idea in natural language.
- The backend will generate a scaffold and logic, using AI models as needed.
- Download or deploy your generated app locally.

## Notes
- This project is for private/internal use only.
- For AI features, ensure your API keys are valid and have sufficient quota.
- OAuth setup requires registering your app with the provider (Google, GitHub, etc.) and setting redirect URIs.

## Support
For issues, contact the two engineers maintaining this project.
