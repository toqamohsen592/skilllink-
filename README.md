# SkillLink Frontend

Vue 3 + Vite frontend for the SkillLink platform.

## Requirements

- Node.js 18+
- npm

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Backend API

The app connects to:

```
https://skilllinkapi.ddns.net
```

Configured in `src/services/api.js`.

## Auth flow

1. **Sign up** at `/signup` → creates account on the API and logs you in automatically
2. **Login** at `/login` with your real email and password
3. Student accounts use API type `user`
4. Client accounts use API type `client`

## Profile save

- With login: data is saved to the backend database
- Without login: data is saved locally in the browser only (for testing)

## Deploy to Vercel

1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Set **Root Directory** to `my-skilllink` if the repo contains the whole `Skill-Link-main` folder
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy

`vercel.json` is included for Vue Router SPA routing.

## Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site**
3. Connect the repository
4. Netlify reads settings from `netlify.toml`
5. Deploy

## Push to GitHub

From the `my-skilllink` folder:

```bash
git init
git add .
git commit -m "Prepare SkillLink frontend for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Do **not** commit:

- `node_modules/`
- `.env` files with secrets
- `dist/` (optional — platforms build it automatically)

## Important pages

| Page | URL |
|------|-----|
| Home | `/` |
| Login | `/login` |
| Sign up | `/signup` |
| Student settings | `/settings` |
| Student profile | `/profile` |
| Client settings | `/client-settings` |
| Client profile | `/client-profile` |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Failed to save profile | Login first at `/login` |
| Profile empty after refresh | Use login so data saves to the server |
| 401 Unauthorized | Token missing or expired — login again |
| Blank page after deploy | Check SPA rewrite rules in `vercel.json` / `netlify.toml` |
