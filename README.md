# Enomy-Finances System

Bespoke financial web application for **Enomy-Finances** supporting currency exchange & conversion, personalized investment quotes & calculators, mortgage application management, customer administration, system logs, and role-based access control.

---

## 🚀 Features

- **Multi-Role Support**: Client (Customer), Staff Advisor, and System Administrator interfaces.
- **Currency Exchange & Converter**: Live fee calculation with structured receipts and transaction history.
- **Investment Plan & Quotation Manager**: Option 1 (Basic Savings), Option 2 (Savings Plus), and Option 3 (Managed Stock Investments) with compound interest, tax rates, and management fees.
- **Mortgage Calculator & Applications**: Full Loan-to-Value (LTV) calculation, monthly repayment schedules, income validation, and staff review & approval workflow.
- **Admin Dashboard**: Client user management, audit logging, system diagnostic tracking, and currency rate configuration.

---

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/enomy-finances.git
   cd enomy-finances
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your `GEMINI_API_KEY` if utilizing server-side AI features.

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Building for Production

To create a static production build:

```bash
npm run build
```

This generates an optimized production bundle inside the `dist/` directory ready for deployment.

---

## 🌐 Deploying to GitHub & Hosting Platforms

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit of Enomy-Finances web application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/enomy-finances.git
git push -u origin main
```

### 2. Deploy to GitHub Pages (`gh-pages`)

This project is pre-configured with relative asset paths (`base: './'`) in `vite.config.ts` and automated `404.html` copy on build (`npm run build`) to prevent 404 routing errors on GitHub Pages:

1. Install `gh-pages` helper package:
   ```bash
   npm install -D gh-pages
   ```
2. Add the deploy script to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run deployment command:
   ```bash
   npm run deploy
   ```
4. In your GitHub repository, go to **Settings** -> **Pages**, and set the branch to `gh-pages` / `/ (root)`.

---

### 3. Deploy to Vercel or Netlify (Recommended - Zero Setup)

- **Vercel**: Import your GitHub repository on [vercel.com](https://vercel.com).
  - Framework Preset: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- **Netlify**: Connect your GitHub repository on [netlify.com](https://netlify.com).
  - Build Command: `npm run build`
  - Publish Directory: `dist`

---

## 📄 License
This project is for educational and testing purposes.
