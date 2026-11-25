const cfg=window.FEXOZONE_CONFIG||{}, message=document.getElementById("adminMessage"), dashMsg=document.getElementById("dashboardMessage");
const ready=cfg.supabaseUrl&&!cfg.supabaseUrl.includes("PASTE_")&&cfg.supabaseAnonKey&&!cfg.supabaseAnonKey.includes("PASTE_")&&window.supabase?.createClient;
const client=ready?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const loginPanel=document.getElementById("loginPanel"), dashboard=document.getElementById("dashboard"), signOut=document.getElementById("signOut"), list=document.getElementById("requestList");
if(!client){message.textContent="Connect Supabase first: add your project URL and anon/publishable key in config.js.";document.getElementById("googleLogin").disabled=true;}
document.getElementById("googleLogin").addEventListener("click",async()=>{
 if(!client)return; message.textContent="Redirecting to Google…";
 const {error}=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.href}});
 if(error)message.textContent=error.message;
});
signOut.addEventListener("click",async()=>{await client.auth.signOut();location.reload();});
document.getElementById("refresh").addEventListener("click",loadRequests);
document.getElementById("statusFilter").addEventListener("change",loadRequests);
async function syncSession(){
 if(!client)return;
 const {data:{session}}=await client.auth.getSession();
 if(!session){loginPanel.hidden=false;dashboard.hidden=true;signOut.hidden=true;return;}
 loginPanel.hidden=true;dashboard.hidden=false;signOut.hidden=false;await loadRequests();
}
async function loadRequests(){
 if(!client)return;
 dashMsg.textContent="Loading requests…";list.innerHTML="";
 let query=client.from("sponsorship_requests").select("*").order("created_at",{ascending:false});
 const filter=document.getElementById("statusFilter").value;if(filter!=="all")query=query.eq("status",filter);
 const {data,error}=await query;
 if(error){dashMsg.textContent="Could not load requests. Check that your signed-in account is in the owner_access table. "+error.message;return;}
 dashMsg.textContent=data.length?`${data.length} request(s) shown.`:"No sponsorship requests yet.";
 if(!data.length){list.innerHTML='<div class="panel"><p class="sponsor-intro">No requests match this filter.</p></div>';return;}
 for(const r of data){
  const card=document.createElement("article");card.className="request-card";
  const date=new Date(r.created_at).toLocaleString();
  card.innerHTML=`<div class="request-head"><h3></h3><span class="status-label"></span></div><div class="request-meta"></div><p class="request-proposal"></p><div class="request-actions"><select aria-label="Update request status"><option value="new">New</option><option value="reviewing">Reviewing</option><option value="accepted">Accepted</option><option value="declined">Declined</option></select><input aria-label="Owner notes" maxlength="2000" placeholder="Private owner notes"><button class="button button-primary">Save update</button><a class="button button-outline email-link">Email contact</a></div>`;
  card.querySelector("h3").textContent=r.company_name;
  card.querySelector(".status-label").textContent=r.status;
  card.querySelector(".request-meta").textContent=`${r.contact_person} · ${r.business_email} · ${r.package_interest} · ${date}`;
  card.querySelector(".request-proposal").textContent=`Goals: ${r.campaign_goals}\nProposal: ${r.proposal}\nWebsite: ${r.website||"Not provided"} · Region: ${r.country_region||"Not provided"} · Budget: ${r.indicative_budget||"Not provided"}`;
  const select=card.querySelector("select");select.value=r.status;
  const notes=card.querySelector("input");notes.value=r.owner_notes||"";
  const mail=card.querySelector(".email-link");mail.href=`mailto:${encodeURIComponent(r.business_email)}?subject=${encodeURIComponent("FEXOZONE sponsorship inquiry")}`;
  card.querySelector("button").addEventListener("click",async()=>{
   const {error}=await client.from("sponsorship_requests").update({status:select.value,owner_notes:notes.value.trim(),updated_at:new Date().toISOString()}).eq("id",r.id);
   if(error){dashMsg.textContent="Update failed: "+error.message;return;}dashMsg.textContent="Request updated.";await loadRequests();
  });
  list.appendChild(card);
 }
}
if(client){client.auth.onAuthStateChange(()=>syncSession());syncSession();}
