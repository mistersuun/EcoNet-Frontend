# Supabase Database Setup for EcoNet Proprete

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - **Name**: econet-proprete
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose closest to Montreal (e.g., US East or Canada)
5. Click "Create new project"
6. Wait for the project to be provisioned (1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Go to **API** section
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Update Environment Files

Replace the placeholder values in these files with your actual Supabase credentials:

### `src/environments/environment.ts` (Development)
```typescript
supabase: {
  url: 'YOUR_SUPABASE_URL',  // Replace with your Project URL
  anonKey: 'YOUR_SUPABASE_ANON_KEY'  // Replace with your anon public key
}
```

### `src/environments/environment.prod.ts` (Production)
```typescript
supabase: {
  url: 'YOUR_SUPABASE_URL',  // Replace with your Project URL
  anonKey: 'YOUR_SUPABASE_ANON_KEY'  // Replace with your anon public key
}
```

## Step 4: Create Database Tables

1. In your Supabase dashboard, click on **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL schema below
4. Click **Run** to execute the schema

### Database Schema

```sql
-- ====================================
-- CONTACT FORM SUBMISSIONS TABLE
-- ====================================
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Customer Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),

  -- Request Details
  service_type VARCHAR(100),
  property_size VARCHAR(50),
  preferred_date DATE,
  message TEXT NOT NULL,
  urgent_request BOOLEAN DEFAULT false,

  -- Metadata
  language VARCHAR(2) DEFAULT 'fr',
  user_agent TEXT,
  ip_address INET,

  -- Status tracking (for future use)
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  assigned_to VARCHAR(100),
  contacted_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for common queries
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_urgent ON contact_submissions(urgent_request, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all submissions (for admin panel)
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update submissions (for admin panel)
CREATE POLICY "Allow authenticated update" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (true);


-- ====================================
-- BOOKING REQUESTS TABLE
-- ====================================
CREATE TABLE booking_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Service Details
  service_type VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_price DECIMAL(10, 2) NOT NULL,

  -- Property Details
  property_type VARCHAR(100),
  property_size INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3, 1),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),

  -- Scheduling
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(10) NOT NULL,
  frequency VARCHAR(50) NOT NULL,

  -- Additional Services
  additional_services JSONB,
  special_instructions TEXT,

  -- Customer Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  contact_method VARCHAR(50),

  -- Financial Summary
  subtotal DECIMAL(10, 2) NOT NULL,
  taxes DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,

  -- Metadata
  language VARCHAR(2) DEFAULT 'fr',
  user_agent TEXT,
  ip_address INET,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  assigned_to VARCHAR(100),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  scheduled_date DATE,
  scheduled_time VARCHAR(10),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Add indexes for common queries
CREATE INDEX idx_booking_created_at ON booking_requests(created_at DESC);
CREATE INDEX idx_booking_email ON booking_requests(email);
CREATE INDEX idx_booking_status ON booking_requests(status);
CREATE INDEX idx_booking_preferred_date ON booking_requests(preferred_date);
CREATE INDEX idx_booking_scheduled_date ON booking_requests(scheduled_date);

-- Enable Row Level Security (RLS)
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions)
CREATE POLICY "Allow public insert" ON booking_requests
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all bookings (for admin panel)
CREATE POLICY "Allow authenticated read" ON booking_requests
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update bookings (for admin panel)
CREATE POLICY "Allow authenticated update" ON booking_requests
  FOR UPDATE TO authenticated
  USING (true);


-- ====================================
-- VIEWS FOR ADMIN DASHBOARD
-- ====================================

-- View for recent contact submissions
CREATE VIEW recent_contacts AS
SELECT
  id,
  created_at,
  first_name || ' ' || last_name AS full_name,
  email,
  phone,
  service_type,
  urgent_request,
  status
FROM contact_submissions
ORDER BY created_at DESC
LIMIT 100;

-- View for recent bookings
CREATE VIEW recent_bookings AS
SELECT
  id,
  created_at,
  first_name || ' ' || last_name AS full_name,
  email,
  phone,
  service_name,
  preferred_date,
  preferred_time,
  total,
  status
FROM booking_requests
ORDER BY created_at DESC
LIMIT 100;

-- View for urgent requests
CREATE VIEW urgent_requests AS
SELECT
  'contact' AS request_type,
  id,
  created_at,
  first_name || ' ' || last_name AS full_name,
  email,
  phone,
  message AS details,
  status
FROM contact_submissions
WHERE urgent_request = true AND status != 'resolved'
ORDER BY created_at DESC;

-- Grant access to views for authenticated users
GRANT SELECT ON recent_contacts TO authenticated;
GRANT SELECT ON recent_bookings TO authenticated;
GRANT SELECT ON urgent_requests TO authenticated;
```

## Step 5: Verify Tables Created

1. In Supabase dashboard, go to **Table Editor**
2. You should see two tables:
   - `contact_submissions`
   - `booking_requests`
3. Click on each table to verify the columns are created correctly

## Step 6: Test the Integration

Once you've updated the environment files with your credentials:

1. Run the development server: `npm start`
2. Navigate to the contact page: http://localhost:4200/contact
3. Fill out and submit the contact form
4. Check your Supabase dashboard > Table Editor > `contact_submissions`
5. You should see the new submission appear!

## Database Features

### Security
- **Row Level Security (RLS)** enabled on all tables
- Public users can only INSERT (submit forms)
- Only authenticated users can view/update records (admin panel)
- No data can be deleted through the API

### Status Tracking
Both tables include status fields for managing requests:
- `pending` - New submission, not yet reviewed
- `contacted` - Customer has been contacted
- `confirmed` - Booking confirmed (booking_requests only)
- `completed` - Service completed
- `cancelled` - Cancelled
- `resolved` - Issue resolved (contact_submissions only)

### Additional Features
- Automatic timestamps for all records
- IP address and user agent tracking
- Language preference stored
- Indexes on common query fields for performance
- JSONB field for flexible additional services data

## Admin Panel (Future Enhancement)

The database is structured to support an admin panel where you can:
- View all contact and booking submissions
- Update status and add notes
- Assign requests to team members
- Track completion and resolution
- Filter by urgent requests, dates, status, etc.

## Netlify Deployment

Supabase works perfectly with Netlify:
- No backend code required
- All API calls are client-side
- Just push to Git and Netlify auto-deploys
- Make sure to set environment variables in Netlify dashboard:
  - Go to Netlify Dashboard > Site Settings > Environment Variables
  - Add the same Supabase URL and anon key

## Backup and Security

- Supabase automatically backs up your database daily
- Free tier includes:
  - 500 MB database space
  - 1 GB file storage
  - 2 GB bandwidth
  - Unlimited API requests
- Your anon key is safe to expose in frontend (it's restricted by RLS policies)
- Never expose your service_role key (keep it secret!)

## Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase Dashboard**: https://supabase.com/dashboard
- **JavaScript Client Docs**: https://supabase.com/docs/reference/javascript
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
