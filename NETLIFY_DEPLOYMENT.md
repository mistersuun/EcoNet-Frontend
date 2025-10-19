# Netlify Deployment Guide

## 🔒 Security First: Environment Variables

**IMPORTANT**: Your Supabase credentials are currently in the code for local development. For production, you should set them as environment variables in Netlify.

---

## Step 1: Push Your Code to Git

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - EcoNet Proprete website"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin master
```

---

## Step 2: Connect to Netlify

### Option A: Using Netlify Dashboard

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** (or GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:

**Build Settings:**
```
Build command: npm run build
Publish directory: dist/econet-frontend/browser
```

6. Click **"Deploy site"**

### Option B: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
```

---

## Step 3: Configure Environment Variables in Netlify

### Via Netlify Dashboard:

1. Go to your site in Netlify dashboard
2. Click **"Site settings"** (or "Site configuration")
3. Go to **"Environment variables"** in the left sidebar
4. Click **"Add a variable"** or **"Add environment variables"**

### Add These Variables:

**Variable 1:**
```
Key: SUPABASE_URL
Value: https://hegovyeffsvkujbmxylr.supabase.co
Scopes: ✓ All deployment contexts (or just Production)
```

**Variable 2:**
```
Key: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZ292eWVmZnN2a3VqYm14eWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTcyNjAsImV4cCI6MjA3NjQzMzI2MH0.YYJsm7V3i_7YRB07Ps7uNRJc0fLubtV-Ujbj22o5kL8
Scopes: ✓ All deployment contexts (or just Production)
```

**Variable 3 (Optional - Web3Forms):**
```
Key: WEB3FORMS_ACCESS_KEY
Value: 20159e31-e7b0-4071-be4f-d8380f878c7f
Scopes: ✓ All deployment contexts
```

5. Click **"Save"**

---

## Step 4: Configure Your Custom Domain

### In Netlify Dashboard:

1. Go to **"Domain management"** → **"Domains"**
2. Click **"Add domain"** or **"Add custom domain"**
3. Enter: `econetproprete.ca`
4. Click **"Verify"**

### Update DNS Records:

In your domain registrar (where you bought econetproprete.ca):

**Add these DNS records:**

**For main domain (econetproprete.ca):**
```
Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer IP)
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

**Or use Netlify DNS (Recommended):**

1. In Netlify, click **"Use Netlify DNS"**
2. Copy the nameservers shown (e.g., dns1.p01.nsone.net)
3. Update nameservers in your domain registrar
4. Wait for propagation (can take up to 48 hours)

---

## Step 5: Enable HTTPS

1. In Netlify → **"Domain management"** → **"HTTPS"**
2. Netlify automatically provisions SSL certificate via Let's Encrypt
3. Enable **"Force HTTPS"** (redirects http to https)

---

## Step 6: Update Supabase URLs

Once your domain is working:

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Update **Site URL** to: `https://econetproprete.ca`
3. Update **Redirect URLs** to include:
   - `https://econetproprete.ca/**`
   - `https://www.econetproprete.ca/**`
   - Keep `http://localhost:4200/**` for local dev

---

## Netlify Configuration File (Optional)

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist/econet-frontend/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Deployment Workflow

### Automatic Deployments:

Once connected to GitHub, Netlify automatically deploys when you push:

```bash
# Make changes to your code
git add .
git commit -m "Update homepage design"
git push

# Netlify automatically:
# 1. Detects the push
# 2. Runs npm run build
# 3. Deploys to production
# 4. Site is live in ~2 minutes
```

### Manual Deploy:

```bash
# Using Netlify CLI
netlify deploy --prod

# Or via Netlify dashboard
# Deploys → Trigger deploy → Deploy site
```

---

## Environment Variables Best Practices

### ✅ DO:
- ✅ Set sensitive keys in Netlify environment variables
- ✅ Use different values for dev/staging/production
- ✅ Rotate keys periodically
- ✅ Document all required environment variables

### ❌ DON'T:
- ❌ Commit API keys to git
- ❌ Share environment variables publicly
- ❌ Use same keys for dev and production
- ❌ Hardcode secrets in source code

---

## Build Optimization

### Angular Build Configuration

Your `angular.json` is already configured for production builds with:
- ✅ Minification
- ✅ Tree shaking
- ✅ Dead code elimination
- ✅ AOT compilation

### Netlify Build Plugins (Optional)

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"

  [plugins.inputs.thresholds]
    performance = 0.9
    accessibility = 0.9
    seo = 0.9
```

---

## Monitoring & Analytics

### Enable Netlify Analytics:

1. Go to **"Analytics"** tab in Netlify
2. Click **"Enable analytics"** ($9/month)
3. Get real user monitoring data

### Or use Google Analytics (Free):

Already configured in your site! Just update the tracking ID if you have one.

---

## Troubleshooting

### Build Fails:

**Check build logs:**
1. Netlify Dashboard → Deploys → Failed deploy → View logs

**Common issues:**
```bash
# Node version mismatch
# Fix: Add to netlify.toml
[build.environment]
  NODE_VERSION = "20"

# Missing dependencies
# Fix: Ensure package.json includes all dependencies

# Build timeout
# Fix: Increase timeout in Netlify settings
```

### Environment Variables Not Working:

1. Make sure variables are set in correct scope (Production/All)
2. Redeploy after adding variables (Netlify caches builds)
3. Check spelling of variable names (case-sensitive)

### Domain Not Working:

1. Check DNS propagation: https://dnschecker.org
2. Verify nameservers are updated
3. Wait 24-48 hours for full propagation
4. Clear browser cache

---

## Performance Checklist

Once deployed, verify:

- ✅ HTTPS is enabled
- ✅ Force HTTPS redirect is on
- ✅ Custom domain works (econetproprete.ca)
- ✅ www redirect works (www.econetproprete.ca → econetproprete.ca)
- ✅ All pages load correctly
- ✅ Forms submit successfully
- ✅ Admin login works
- ✅ Database connections work

---

## Post-Deployment

### Test Everything:

1. **Public Pages**: Visit all routes (/, /services, /about, etc.)
2. **Contact Form**: Submit a test contact
3. **Booking Form**: Submit a test booking
4. **Admin Login**: Login at /admin
5. **Admin Panel**: Verify submissions appear
6. **Email**: Check emails were sent

### Update Google Search Console:

1. Add property: https://econetproprete.ca
2. Verify ownership
3. Submit sitemap (if you have one)

---

## Quick Reference

**Your URLs:**
- Production: https://econetproprete.ca
- Netlify URL: https://your-site-name.netlify.app
- Admin: https://econetproprete.ca/admin
- Login: https://econetproprete.ca/login

**Deployment:**
```bash
git push  # Auto-deploys to Netlify
```

**Environment Variables Location:**
- Netlify Dashboard → Site Settings → Environment Variables

**Build Logs:**
- Netlify Dashboard → Deploys → Click deploy → Scroll to logs

---

## Next Steps After Deployment

1. ✅ Test all functionality on production
2. ✅ Set up monitoring/analytics
3. ✅ Create backup of Supabase database
4. ✅ Document admin credentials securely
5. ✅ Set up automatic backups
6. ✅ Configure email forwarding for contact form
7. ✅ Add social media links
8. ✅ Submit to search engines

**Your site is now live!** 🚀
