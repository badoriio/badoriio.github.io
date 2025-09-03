# 🚀 GitHub Pages Deployment Guide

This document explains the optimized GitHub Pages deployment workflow for the Badoriio Terminal Portfolio.

## 📋 Overview

The deployment process uses GitHub Actions to build and deploy the site efficiently with the following features:

### ✨ Key Optimizations

1. **Smart Caching**
    - NPM dependencies caching
    - TypeScript build cache
    - Build artifacts caching with content-based keys

2. **Performance Monitoring**
    - Bundle size analysis and reporting
    - Lighthouse CI audits on PRs
    - Performance budget enforcement

3. **Quality Assurance**
    - TypeScript type checking
    - ESLint with auto-fix
    - Comprehensive test suite
    - Security scanning

4. **Efficient Workflows**
    - Concurrent job execution
    - Conditional deployments
    - Smart artifact management

## 🔧 Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:** Push to `main`/`dev`, Pull Requests

**Jobs:**

- **Test & Lint** (Node 18.x, 20.x)
- **Build** (Production build with caching)
- **Lighthouse Audit** (PR only)
- **Security Scan** (PR only)
- **Performance Budget** (PR only)

### 2. Deploy Pipeline (`.github/workflows/deploy.yml`)

**Triggers:** Push to `main`, Manual dispatch

**Jobs:**

- **Build & Test** (Quality checks + build)
- **Deploy** (GitHub Pages deployment)

## 📊 Performance Budgets

| Asset Type   | Warning Threshold | Error Threshold |
| ------------ | ----------------- | --------------- |
| JavaScript   | 250KB             | 500KB           |
| CSS          | 50KB              | 100KB           |
| Total Bundle | 500KB             | 1MB             |

## 🏗️ Build Process

1. **Dependencies:** `npm ci --prefer-offline --no-audit`
2. **Type Check:** `npm run type-check`
3. **Linting:** `npm run lint:check`
4. **Testing:** `npm run test:ci`
5. **Build:** `npm run build` (with NODE_ENV=production)
6. **Optimization:** File permissions, bundle analysis
7. **Deployment:** GitHub Pages artifact upload

## 🔍 Quality Checks

### Lighthouse Audits

- Performance: 90% minimum
- Accessibility: 90% minimum (error on failure)
- Best Practices: 90% minimum
- SEO: 90% minimum
- PWA: 80% minimum

### Security Scans

- NPM audit (high severity issues)
- Snyk security scanning (if token available)

## 📈 Monitoring & Reporting

### Build Reports Include:

- Bundle size breakdown with status indicators
- Coverage reports (uploaded to Codecov)
- Lighthouse scores and recommendations
- Security vulnerability reports

### GitHub Pages Settings

To configure GitHub Pages properly:

1. Go to repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Ensure branch protection rules allow the deploy workflow

### 🌐 Custom Domain Configuration (badori.io)

This repository is configured with a custom domain:

**Domain:** `badori.io`
**CNAME File:** Automatically deployed with each build
**SSL/HTTPS:** Enforced by GitHub Pages

#### DNS Configuration Required:

```
# DNS records for badori.io domain:
Type: CNAME
Name: www
Value: badoriio.github.io

Type: A (for root domain)
Name: @
Values:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153

Type: AAAA (for IPv6)
Name: @
Values:
  2606:50c0:8000::153
  2606:50c0:8001::153
  2606:50c0:8002::153
  2606:50c0:8003::153
```

#### Custom Domain Verification:

- ✅ CNAME file automatically included in builds
- ✅ robots.txt configured for custom domain
- ✅ HTTPS certificate automatically provisioned
- ✅ Workflow validates domain configuration

## 🚨 Troubleshooting

### Common Issues:

**Build Failures:**

- Check TypeScript errors in the type-check step
- Review ESLint violations in the lint step
- Examine test failures in the test step

**Deployment Failures:**

- Verify GitHub Pages is enabled
- Check repository permissions
- Ensure GITHUB_TOKEN has sufficient permissions

**Performance Issues:**

- Review bundle size reports
- Check Lighthouse recommendations
- Monitor Core Web Vitals

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)

## 🔄 Workflow Status

Check the current status of deployments:

- [Latest Deployment](../../actions/workflows/deploy.yml)
- [CI Pipeline](../../actions/workflows/ci.yml)
- [Live Site](https://badoriio.github.io)
