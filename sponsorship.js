document.getElementById("year").textContent = new Date().getFullYear();
const toggle = document.getElementById("menuToggle"), nav = document.getElementById("navLinks");
if (toggle && nav) toggle.addEventListener("click", () => { const open=nav.classList.toggle("show"); toggle.setAttribute("aria-expanded",String(open)); });
function getClient(){
  const c=window.FEXOZONE_CONFIG||{};
  if(!c.supabaseUrl||!c.supabaseAnonKey||c.supabaseUrl.includes("PASTE_")||c.supabaseAnonKey.includes("PASTE_")) return null;
  if(!window.supabase?.createClient) return null;
  return window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey);
}
const form=document.getElementById("sponsorForm"), msg=document.getElementById("sponsorMessage"), submit=document.getElementById("submitSponsor");
form.addEventListener("submit",async e=>{
  e.preventDefault(); msg.textContent="";
  if(!form.reportValidity()) return;
  const client=getClient();
  if(!client){msg.textContent="Setup needed: connect your Supabase project in config.js before inquiries can be submitted.";return;}
  const data=Object.fromEntries(new FormData(form).entries());
  const payload={
    company_name:data.company.trim(), contact_person:data.person.trim(),
    business_email:data.email.trim(), website:data.website.trim()||null,
    country_region:data.country.trim()||null, package_interest:data.package,
    indicative_budget:data.budget||null, campaign_goals:data.goals.trim(),
    proposal:data.message.trim()
  };
  submit.disabled=true; submit.textContent="Submitting…";
  try{
    const {error}=await client.from("sponsorship_requests").insert(payload);
    if(error) throw error;
    form.reset(); msg.textContent="Thank you. Your inquiry has been submitted to FEXOZONE for review.";
  }catch(err){console.error(err);msg.textContent="We couldn't submit your inquiry. Please try again or email itzsupan@gmail.com.";}
  finally{submit.disabled=false;submit.textContent="Submit inquiry ↗";}
});