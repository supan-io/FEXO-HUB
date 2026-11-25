# FEXOZONE — Sponsorship System Starter

## Included
- `index.html` — rebranded gaming homepage
- `sponsorship.html` — dedicated partnership page, package descriptions, inquiry form and contact information
- `sponsorship-admin.html` — owner request-management screen
- `sponsorship.js` — inquiry form submission
- `sponsorship-admin.js` — Google sign-in and owner dashboard
- `config.js` — public Supabase URL and anon/publishable key placeholders
- `supabase-sponsorship.sql` — database tables and row-level security policies
- `style.css`, `script.js` — site styling and homepage interactions

Public contact: itzsupan@gmail.com

## Important: setup is required before real submissions work
This is a website code package, not a deployed/connected backend. The sponsorship form only stores inquiries after Supabase is configured.

### 1. Create Supabase project
1. Create a project at https://supabase.com/
2. In Project Settings → API, copy the Project URL and anon/publishable key.
3. Paste both into `config.js`.
4. Never put a `service_role` key in browser code.

### 2. Create database
1. Open Supabase → SQL Editor.
2. Paste and run all of `supabase-sponsorship.sql`.

### 3. Configure Google sign-in
1. In Supabase → Authentication → Sign In / Providers, enable Google.
2. Configure Google OAuth credentials in Google Cloud Console.
3. Add your deployed website URL to Supabase Authentication → URL Configuration → Redirect URLs.
4. Use the same Google account that will own the website.

### 4. Give your account owner access
1. Sign in once at `sponsorship-admin.html` using your Google account.
2. In Supabase → Authentication → Users, find that account and copy its UUID.
3. In Supabase SQL Editor, run:
   `insert into public.owner_access (user_id) values ('PASTE-YOUR-UUID-HERE');`
4. Reload `sponsorship-admin.html`. Only users in `owner_access` can read or manage sponsorship requests.

### 5. Publish
Upload all files to the root of your GitHub repository. Enable GitHub Pages from Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

## Security notes
- The public inquiry form can insert requests only with status `new` and no owner notes.
- Public visitors cannot read requests.
- Only manually authorized owner accounts can view and update requests.
- Do not expose private OAuth client secrets or Supabase service-role keys in frontend files.
- This package does not send email notifications. The admin dashboard is the owner inbox; email replies can be made using the contact's email link.
- Supabase RLS is essential. Do not disable it.
