# FEXOZONE — Gaming Website Package

Responsive dark-neon gaming website, rebranded as FEXOZONE. Built as a static site suitable for GitHub Pages, with Supabase-powered Google sign-in and sponsorship inquiry workflows after configuration.

## Files
- `index.html`, `style.css`, `script.js` — homepage, responsive styling and player Google sign-in.
- `config.js` — public Supabase URL and anon/publishable key placeholders. Never put a service-role key here.
- `sponsorship.html`, `sponsorship.js` — public partnership inquiry form.
- `sponsorship-admin.html`, `sponsorship-admin.js` — owner-only sponsorship inbox.
- `supabase-sponsorship.sql` — tables, RLS policies and restricted column grants.
- `song/` — isolated homepage music player. Add a licensed/original `SONG.mp3`; none is included.

## Honest feature status
- Homepage and sponsorship pages are included.
- Google sign-in and sponsorship storage require your Supabase project and Google OAuth setup.
- The sponsorship admin page manages sponsorship inquiries only; it is not yet a full game/user/analytics control center.
- The leaderboard on the homepage is explicitly labeled DEMO and contains sample scores. It is not a live ranking.
- Player accounts use Supabase Auth; advanced public player profiles and game-score submission are not connected yet.
- The existing Neon Run 3D game is hosted separately at `https://supansarker2007.github.io/Neon-run-3d/`; its code is not included or modified by this package.
- `song/SONG.mp3` is not supplied. Add only audio whose license permits website use.

## Setup
1. Create a Supabase project. In Project Settings → API, copy Project URL and anon/publishable key into `config.js`. Do not use the service_role key.
2. In Supabase SQL Editor, run all of `supabase-sponsorship.sql`.
3. In Supabase Authentication → Providers, enable Google and configure the Google OAuth Client ID/Secret in the provider settings.
4. In Supabase Authentication → URL Configuration, set Site URL to your GitHub Pages URL and add that exact URL as a Redirect URL.
5. Open `sponsorship-admin.html`, sign in once with your Google account, then copy your UUID from Supabase → Authentication → Users. Run: `insert into public.owner_access (user_id) values ('YOUR-USER-UUID');`
6. Upload the contents of this `FEXOZONE` folder to the root of your GitHub Pages repository. Keep file/folder names unchanged.
7. To add music, place a properly licensed file named `SONG.mp3` inside `song/`. Browsers require a visitor interaction before audible playback.

## Publish with GitHub Pages
Repository → Settings → Pages → Deploy from a branch → choose `main` and `/ (root)` → Save. Wait for GitHub Pages deployment.

## Security
- RLS is enabled for sponsorship requests. Public users can insert inquiries but cannot read them. Only UUIDs manually added to `owner_access` can read/update requests.
- Browser code contains only the Supabase anon/publishable key. Never publish service-role keys, OAuth client secrets, passwords or private owner credentials.
- The SQL grants only the fields needed for public inquiry insertion and owner status/notes updates.
- This is a static GitHub Pages deployment; do not store private secrets in frontend files.
