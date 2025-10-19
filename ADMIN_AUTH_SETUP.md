# Admin Authentication Setup Guide

## Overview

The admin panel (`/admin`) is now protected with Supabase Authentication. Only authorized users with valid credentials can access the admin dashboard.

## What Was Implemented

### Security Features

1. **Login Page** (`/login`) - Secure login form with email and password
2. **Auth Guard** - Protects the `/admin` route from unauthorized access
3. **Auth Service** - Manages authentication state using Supabase Auth
4. **Session Management** - Maintains user sessions across page refreshes
5. **Logout Functionality** - Secure logout with session clearing

### User Experience

- Attempting to access `/admin` without login → Redirects to `/login`
- After successful login → Redirects to `/admin`
- Login page shows user-friendly error messages
- Admin panel displays logged-in user's email
- One-click logout button in admin header

---

## Step-by-Step Setup

### Step 1: Enable Email Auth in Supabase

1. Go to your **Supabase Dashboard**
2. Click on **Authentication** in the left sidebar
3. Go to **Providers** tab
4. Ensure **Email** provider is enabled (it should be by default)
5. Under **Auth** → **URL Configuration**:
   - Site URL: `http://localhost:4200` (for development)
   - Redirect URLs: `http://localhost:4200/**` (for development)

### Step 2: Create Your Admin User

#### Option A: Using Supabase Dashboard (Recommended)

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** or **"Create new user"** button
3. Fill in the user details:
   - **Email**: `admin@econet-proprete.ca` (or your preferred admin email)
   - **Password**: Create a strong password (minimum 6 characters)
   - **Email Confirm**: Check "Auto Confirm User" (recommended for first admin)
4. Click **"Create user"**
5. Save your credentials somewhere secure!

#### Option B: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase
2. Run this SQL:

```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@econet-proprete.ca',  -- Replace with your email
  crypt('YourSecurePassword123', gen_salt('bf')),  -- Replace with your password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**Important**: Replace `admin@econet-proprete.ca` and `YourSecurePassword123` with your actual credentials!

### Step 3: Test the Authentication

1. **Stop and restart your dev server**:
   ```bash
   # Press Ctrl+C to stop, then:
   npm start
   ```

2. **Try accessing the admin panel**:
   - Go to: http://localhost:4200/admin
   - You should be **redirected to** http://localhost:4200/login

3. **Login with your credentials**:
   - Enter the email you created
   - Enter the password you created
   - Click "Se connecter"

4. **You should be redirected to the admin panel**:
   - You'll see your email in the top right
   - You'll see a "Déconnexion" (Logout) button
   - You can view all submissions and manage them

5. **Test logout**:
   - Click the "Déconnexion" button
   - You should be redirected to `/login`
   - Try accessing `/admin` again - you should be redirected to login

---

## Files Created/Modified

### New Files

1. **`src/app/services/auth.service.ts`** - Authentication service
   - `signIn(email, password)` - Login method
   - `signOut()` - Logout method
   - `isAuthenticated()` - Check auth status
   - `getCurrentUser()` - Get current user info

2. **`src/app/guards/auth.guard.ts`** - Route protection
   - Blocks unauthenticated users from `/admin`
   - Redirects to `/login` with return URL

3. **`src/app/pages/login/`** - Login page component
   - Login form with validation
   - Error handling
   - Auto-redirect after successful login
   - Professional UI matching site design

### Modified Files

1. **`src/app/pages/admin/admin.ts`** - Added auth integration
   - Inject AuthService
   - `getUserEmail()` - Display logged-in user
   - `logout()` - Logout functionality

2. **`src/app/pages/admin/admin.html`** - Added user menu
   - User email display
   - Logout button in header

3. **`src/app/pages/admin/admin.scss`** - Updated header styles
   - Responsive user menu
   - Logout button styling

4. **`src/app/app.routes.ts`** - Route protection
   - Added `/login` route
   - Protected `/admin` with `authGuard`

---

## Security Best Practices

### ✅ Implemented Security Features

1. **Password Protection** - Admin panel requires login
2. **Session Management** - Supabase handles secure sessions
3. **JWT Tokens** - Authentication uses industry-standard JWT
4. **Row Level Security** - Database queries use authenticated session
5. **Auto Logout** - Sessions expire based on Supabase settings
6. **HTTPS Ready** - Works with HTTPS in production

### ⚠️ Important Security Notes

1. **Never commit passwords** - Don't save passwords in code or git
2. **Use strong passwords** - Minimum 12 characters, mix of letters/numbers/symbols
3. **Enable 2FA** (Optional) - Can be added via Supabase Auth settings
4. **Production URLs** - Update Site URL and Redirect URLs for production domain
5. **Password Recovery** - Configure email templates in Supabase for password reset

---

## Adding More Admin Users

### Method 1: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter new admin's email and password
4. Check "Auto Confirm User"
5. Click **"Create user"**

### Method 2: Create a User Management Page (Future Enhancement)

You can create an admin page within your app to manage users, but this requires additional role-based permissions.

---

## Troubleshooting

### Problem: "Invalid login credentials" error

**Solutions:**
1. Verify email is correct (check for typos)
2. Verify password is correct (passwords are case-sensitive)
3. Check if user exists in Supabase dashboard (Authentication → Users)
4. Ensure user's email is confirmed (should have a timestamp in `email_confirmed_at`)

### Problem: Redirects to login even after successful login

**Solutions:**
1. Clear browser cache and cookies
2. Check browser console for errors
3. Verify Supabase credentials in environment files are correct
4. Restart dev server: `npm start`

### Problem: "Authentication not configured" error

**Solutions:**
1. Verify `environment.ts` has correct Supabase URL and anon key
2. Restart dev server after updating environment files
3. Check browser console for specific errors

### Problem: Can't create user in Supabase

**Solutions:**
1. Ensure Email Auth is enabled in Supabase (Authentication → Providers)
2. Check password meets minimum requirements (6+ characters)
3. Try using a different email address
4. Check Supabase dashboard logs for specific errors

### Problem: Session expires too quickly

**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Adjust "JWT expiry" setting (default is 1 hour)
3. Can set up to 7 days for development

---

## Production Deployment

### Update Supabase Settings

Before deploying to production:

1. **Update Site URL**:
   - Go to Authentication → URL Configuration
   - Set Site URL to your production domain: `https://econet-proprete.ca`

2. **Update Redirect URLs**:
   - Add: `https://econet-proprete.ca/**`
   - Add: `https://www.econet-proprete.ca/**`

3. **Email Templates** (Recommended):
   - Go to Authentication → Email Templates
   - Customize login, password reset, and confirmation emails
   - Add your logo and branding

4. **Update Environment Variables**:
   - In Netlify Dashboard → Site Settings → Environment Variables
   - Add the same Supabase URL and anon key
   - Build and deploy

---

## Session Management

### How Sessions Work

1. **Login** - User enters credentials
2. **Token Generation** - Supabase creates JWT token
3. **Token Storage** - Token stored in browser (secure)
4. **Auto-Refresh** - Token refreshes automatically before expiry
5. **Logout** - Token cleared from browser

### Session Duration

- **Default**: 1 hour (configurable in Supabase)
- **Max**: 7 days
- **Auto-refresh**: Happens automatically while user is active

---

## Future Enhancements

Potential additions for more advanced auth:

1. **Password Reset** - Email-based password reset flow
2. **Two-Factor Authentication** - Extra security layer
3. **Role-Based Access** - Different permission levels (admin, manager, viewer)
4. **Activity Logs** - Track admin actions
5. **Multiple Admin Users** - User management interface
6. **Session Limits** - Limit concurrent sessions
7. **OAuth Providers** - Google, Microsoft login options

---

## Quick Reference

### Login Credentials Location

Your admin credentials are in:
- **Supabase Dashboard** → Authentication → Users

### Access URLs

- **Login Page**: http://localhost:4200/login
- **Admin Panel**: http://localhost:4200/admin (requires login)

### Key Commands

```bash
# Start dev server
npm start

# Check if auth is working
# 1. Go to /admin
# 2. Should redirect to /login
# 3. Enter credentials
# 4. Should redirect back to /admin
```

---

## Summary

✅ **What's Protected**: `/admin` route
✅ **Who Can Access**: Only users with valid Supabase credentials
✅ **How to Login**: Visit `/login` and enter email/password
✅ **How to Logout**: Click "Déconnexion" button in admin header
✅ **Where to Create Users**: Supabase Dashboard → Authentication → Users

**The admin panel is now secure and production-ready!** 🔒
