(() => {
  const $ = (id) => document.getElementById(id);
  const menuToggle = $('menuToggle');
  const navLinks = $('navLinks');
  const modal = $('loginModal');
  const message = $('formMessage');
  const cfg = window.FEXOZONE_CONFIG || {};
  const configured = Boolean(cfg.supabaseUrl && !cfg.supabaseUrl.includes('PASTE_') && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes('PASTE_') && window.supabase?.createClient);
  const client = configured ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  $('year').textContent = new Date().getFullYear();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('show'); menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }
  function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); }
  function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); message.textContent=''; }
  $('loginOpen').addEventListener('click', openModal);
  $('loginClose').addEventListener('click', closeModal);
  $('modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });

  function renderSession(user){
    const signedIn=Boolean(user);
    $('signedOutActions').hidden=signedIn; $('signedInActions').hidden=!signedIn;
    $('loginOpen').innerHTML=signedIn ? 'My profile <span>↗</span>' : 'Sign in <span>↗</span>' ;
    $('authDescription').textContent=signedIn ? 'You are signed in on this device.' : (client ? 'Sign in with Google to access your player account.' : 'Connect Supabase in config.js and enable Google OAuth to activate player accounts.');
    $('playerIdentity').textContent=signedIn ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Player account') : '';
  }
  if (!client) { $('googleLogin').disabled=true; message.textContent='Setup required: add your Supabase project URL and anon/publishable key to config.js.'; renderSession(null); }
  $('googleLogin').addEventListener('click', async () => {
    if(!client) return; message.textContent='Connecting to Google…';
    const {error}=await client.auth.signInWithOAuth({provider:'google', options:{redirectTo:location.href}});
    if(error) message.textContent='Sign-in failed: '+error.message;
  });
  $('signOutPlayer').addEventListener('click', async () => {
    if(!client) return; const {error}=await client.auth.signOut();
    if(error) message.textContent='Sign-out failed: '+error.message; else { renderSession(null); message.textContent='Signed out.'; }
  });
  if(client){
    client.auth.getSession().then(({data,error})=>{ if(error) message.textContent=error.message; renderSession(data?.session?.user||null); });
    client.auth.onAuthStateChange((_event,session)=>renderSession(session?.user||null));
  }
})();
