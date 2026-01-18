# Flight Travel Agency - Website

Public website for Flight Travel Agency built with Next.js.

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn

### Installation

```bash
# Install dependencies
yarn install

# Run development server (port 3000)
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## Docker

### Build Docker Image

```bash
# Build website
docker build -f Dockerfile -t flight-website .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-api-url.com flight-website
```

## Deployment

### Render

The project includes a `render.yaml` file for deployment on Render. Set up your service on Render and configure the environment variables:

- `NEXT_PUBLIC_API_URL` - Your backend API URL

### GitHub Actions

The project includes CI/CD workflows:

- **CI** (`ci.yml`): Runs on every push/PR - checks formatting, linting, and builds
- **Docker Build** (`docker-build.yml`): Builds and pushes Docker images

#### Required GitHub Secrets

- `DOCKER_USERNAME` - Docker Hub username (optional, for Docker builds)
- `DOCKER_PASSWORD` - Docker Hub password (optional, for Docker builds)
- `NEXT_PUBLIC_API_URL` - Backend API URL (optional, defaults to localhost)

## Scripts

- `yarn dev` - Run development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linter
- `yarn format` - Format all files with Prettier
- `yarn format:check` - Check if files are formatted

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Code Quality**: ESLint, Prettier, Husky
