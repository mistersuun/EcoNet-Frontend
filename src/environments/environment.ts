export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'ÉcoNet Propreté',
  version: '1.0.0',
  enableAnalytics: false,
  enableMockData: true,
  supabase: {
    // For local development, add these values here (DO NOT COMMIT)
    // For production, these will be set via Netlify environment variables
    url: 'https://hegovyeffsvkujbmxylr.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZ292eWVmZnN2a3VqYm14eWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTcyNjAsImV4cCI6MjA3NjQzMzI2MH0.YYJsm7V3i_7YRB07Ps7uNRJc0fLubtV-Ujbj22o5kL8'
  }
};