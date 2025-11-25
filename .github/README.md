# GitHub Actions & CI/CD

This directory contains GitHub Actions workflows for automated deployment and testing.

## Workflows

### 🚀 Production Deployment (`vercel-production.yml`)
Automatically deploys to Vercel production when code is pushed to `main`.

**Triggers:**
- Push to `main` branch

**Actions:**
- Install dependencies
- Run tests
- Build project
- Deploy to Vercel production
- Create deployment summary

### 👀 Preview Deployment (`vercel-preview.yml`)
Creates preview deployments for pull requests.

**Triggers:**
- Pull requests to `main`

**Actions:**
- Install dependencies
- Build project
- Deploy to Vercel preview
- Comment on PR with deployment URL and quick links

### 🔧 Full Deployment (`vercel-deploy.yml`)
Alternative comprehensive workflow using Vercel CLI.

**Triggers:**
- Push to `main` or `claude/**` branches
- Pull requests to `main`

**Actions:**
- Pull Vercel environment
- Build project artifacts
- Deploy with appropriate environment
- Comment on PRs with deployment info

## Setup

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed instructions.

**Quick Setup:**
1. Create Vercel project
2. Add GitHub secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push code or create PR
4. Watch the magic happen! ✨

## Required Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token for deployments |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID |
| `VERCEL_PROJECT_ID` | The CAOS project ID in Vercel |

## Monitoring

- **GitHub Actions**: Repository → Actions tab
- **Vercel Deployments**: [Vercel Dashboard](https://vercel.com/dashboard)

## Disable Workflows

To temporarily disable a workflow:
1. Go to Actions tab
2. Click on the workflow name
3. Click "..." → Disable workflow

## Local Testing

Test the build locally before pushing:
```bash
npm run build
npm start
```

---

*Automated chaos deployment powered by GitHub Actions* 🌀
