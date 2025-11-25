# Vercel Deployment Setup Guide

This guide will help you set up automatic deployments to Vercel using GitHub Actions.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Admin access to this GitHub repository
- The CAOS project code (already done! ✅)

## Step 1: Create a Vercel Project

### Option A: Via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link the project:
   ```bash
   cd /path/to/caos
   vercel link
   ```

4. Note down the project details shown (you'll need these for secrets)

### Option B: Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `tfpickard/caos` repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click "Deploy" (this first deployment is just to create the project)

## Step 2: Get Your Vercel Credentials

### Get Vercel Token

1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it something like "GitHub Actions - CAOS"
4. Select scope: Full Account
5. Click "Create" and **copy the token immediately** (you won't see it again)

### Get Organization ID

Run this command or find it in your Vercel dashboard:
```bash
vercel whoami
```

Or via the dashboard:
1. Go to your Vercel dashboard
2. Click on your profile/team name
3. Go to Settings
4. Copy the "Team ID" (this is your ORG_ID)

### Get Project ID

#### Method 1: Via CLI
```bash
cd /path/to/caos
cat .vercel/project.json
```

#### Method 2: Via Dashboard
1. Go to your project in Vercel
2. Click Settings
3. Scroll to "Project ID"
4. Copy the ID

#### Method 3: Via Vercel API
```bash
curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects" | jq '.projects[] | select(.name=="caos") | .id'
```

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/tfpickard/caos`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | Created in Step 2 |
| `VERCEL_ORG_ID` | Your organization/team ID | Vercel Settings |
| `VERCEL_PROJECT_ID` | Your project ID | Project Settings or `.vercel/project.json` |

**Note**: `GITHUB_TOKEN` is automatically provided by GitHub Actions, no need to add it.

## Step 4: Test the Deployment

### Test Preview Deployment

1. Create a new branch:
   ```bash
   git checkout -b test-deployment
   ```

2. Make a small change (e.g., update README.md)

3. Commit and push:
   ```bash
   git add .
   git commit -m "Test GitHub Actions deployment"
   git push -u origin test-deployment
   ```

4. Create a Pull Request on GitHub

5. Check the Actions tab - you should see the workflow running

6. The bot will comment on your PR with the preview URL!

### Test Production Deployment

1. Merge your PR to the `main` branch

2. The production workflow will automatically run

3. Check the Actions tab for deployment status

4. Your site will be live at your Vercel production URL!

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain (e.g., `caos.yourdomain.com`)
3. Follow Vercel's instructions to configure DNS
4. SSL certificates are automatically provisioned

## Workflows Explained

### `vercel-preview.yml`
- **Triggers**: On pull requests to `main`
- **Action**: Deploys a preview environment
- **Features**:
  - Comments on PR with deployment URL
  - Includes quick links to all pages
  - Provides curl examples with the preview URL

### `vercel-production.yml`
- **Triggers**: On push to `main` branch
- **Action**: Deploys to production
- **Features**:
  - Runs tests (if present)
  - Creates deployment summary
  - Updates production URL

### `vercel-deploy.yml` (Alternative)
- More comprehensive workflow using Vercel CLI
- Handles both preview and production in one file
- More control over deployment process

## Troubleshooting

### "Resource not accessible by integration"
- Check that the GitHub token has proper permissions
- Go to Settings → Actions → General → Workflow permissions
- Select "Read and write permissions"

### "Project not found"
- Verify `VERCEL_PROJECT_ID` is correct
- Make sure the project exists in Vercel
- Check that `VERCEL_ORG_ID` matches the project's team

### "Invalid token"
- Regenerate your `VERCEL_TOKEN`
- Make sure you copied it correctly (no extra spaces)
- Update the GitHub secret

### Build fails
- Check the build logs in GitHub Actions
- Ensure all dependencies are in `package.json`
- Test the build locally: `npm run build`

## Manual Deployment (Fallback)

If GitHub Actions aren't working, you can deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

If you need environment variables in production:

1. Go to Vercel Project → Settings → Environment Variables
2. Add your variables
3. Redeploy for changes to take effect

For CAOS, no environment variables are currently needed! 🎉

## Monitoring

### View Deployments
- Vercel Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- GitHub Actions: Your repo → Actions tab

### View Logs
- Real-time logs in Vercel dashboard
- Build logs in GitHub Actions
- Function logs in Vercel → Deployments → [Click deployment] → Logs

## Success Checklist

- [ ] Vercel project created
- [ ] GitHub secrets configured
- [ ] Preview deployment tested
- [ ] Production deployment tested
- [ ] Custom domain configured (optional)
- [ ] Team notified of deployment URLs

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Quick Reference

### Vercel CLI Commands
```bash
vercel login              # Login to Vercel
vercel                    # Deploy to preview
vercel --prod             # Deploy to production
vercel ls                 # List deployments
vercel logs [url]         # View logs
vercel domains            # Manage domains
vercel env                # Manage environment variables
```

### GitHub Actions Commands
```bash
# Trigger workflow manually (if enabled)
gh workflow run vercel-preview.yml

# View workflow runs
gh run list

# View logs
gh run view [run-id] --log
```

---

*Ready to spread chaos across the internet! 🌀*
