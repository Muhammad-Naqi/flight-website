# Flight Website - Separate Repository

This repository has been separated from the monorepo and is now completely independent.

## ✅ What's Included

- All source code (`src/` directory)
- Public assets (`public/` directory)
- Configuration files (`.gitignore`, `.prettierrc`, `.eslintrc.json`, etc.)
- Docker configuration (`Dockerfile`)
- GitHub Actions workflows (`.github/workflows/`)
- Render deployment config (`render.yaml`)
- Package dependencies (`package.json`)

## 🚀 Next Steps

### 1. Install Dependencies

```bash
cd /Users/farazhussain/Flight/flight-website
yarn install
```

### 2. Create GitHub Repository

1. Go to GitHub and create a new repository (e.g., `flight-website`)
2. Add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/flight-website.git
git push -u origin main
```

### 3. Set Up GitHub Secrets

In your GitHub repository settings, add these secrets:

- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `DOCKER_USERNAME` - Docker Hub username (optional)
- `DOCKER_PASSWORD` - Docker Hub password (optional)

### 4. Set Up Render (if using)

1. Create a new web service on Render
2. Connect it to this GitHub repository
3. Or use the `render.yaml` file for automatic setup
4. Set environment variable: `NEXT_PUBLIC_API_URL`

### 5. Test the Build

```bash
# Development
yarn dev

# Production build
yarn build
yarn start
```

## 📁 Repository Structure

```
flight-website/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── docker-build.yml
├── public/
├── src/
│   ├── app/
│   └── lib/
├── .gitignore
├── Dockerfile
├── package.json
├── README.md
└── render.yaml
```

## 🔧 Development

- **Port**: 3000 (default)
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Package Manager**: Yarn

## 📝 Notes

- This repository is completely independent from the admin repository
- No shared code or dependencies
- Can be developed, deployed, and versioned separately
