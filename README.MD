# FINAL SUBMISSION BELAJAR FUNDAMENTAL FRONT END WEB DEVELOPMENT DICODING

<div align="center">

[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=Toru45_belajar-fundamental-front-end) [![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=Toru45_belajar-fundamental-front-end)](https://sonarcloud.io/summary/new_code?id=Toru45_belajar-fundamental-front-end)

</div>

## What I Learned
1. HTML Form Lanjutan HTML Form Lanjutan
2. Teknik Layouting dengan CSS Grid
3. Web Component
4. Package Manager untuk Aplikasi Web
5. Module Bundler
6. Asynchronous JavaScript Request

## Submission Criteria
Kindly check my [Notion Link](https://www.notion.so/Kriteria-Submission-Belajar-Fundamental-Front-End-Web-Development-223d83fecd52802fae1dde49749ece62?source=copy_link)

## How To Install

### Option 1: Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Toru45/belajar-fundamental-front-end.git
   cd belajar-fundamental-front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run serve
   ```
   The application will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

### Option 2: Docker Deployment

1. **Build and run with Docker**
   ```bash
   docker build -t mynotes-app .
   docker run -p 8080:8080 mynotes-app
   ```
   The application will be available at `http://localhost:8080`

2. **Using Docker Compose (recommended)**
   ```bash
   # For production
   docker-compose up mynotes-app
   
   # For development
   docker-compose --profile dev up mynotes-dev
   ```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Pipeline Flow
1. **SonarCloud Analysis** - Code quality check and security scan
2. **Production Deployment** - Deploy to Vercel after successful CI

### Deployment Environment
- **Production**: Automatic deployment to production when merged to `master` branch and SonarCloud analysis passes

### Required Secrets
To set up the deployment pipeline, add these secrets to your GitHub repository:

```bash
SONAR_TOKEN=your_sonar_token
VERCEL_TOKEN=your_vercel_token
```

### Available Scripts
- `npm run start-dev` - Start development server with webpack-dev-server
- `npm run build` - Build the application for production
- `npm run serve` - Start development server and open in browser
- `npm run format` - Format code with Prettier