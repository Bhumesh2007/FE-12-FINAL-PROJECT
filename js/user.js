const me=JSON.parse(localStorage.getItem('currentUser')||'null');
if(!me||me.role!=='user') location.href='login.html';

const get=k=>JSON.parse(localStorage.getItem(k)||'[]');
const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const myProjects=()=>get('projects').filter(x=>x.ownerEmail===me.email);
const mySkills=()=>get('userSkills').filter(x=>x.ownerEmail===me.email);

welcome.textContent=me.name.split(' ')[0];side.textContent=me.name;av.textContent=me.name[0].toUpperCase();pn.textContent=me.name;pe.textContent=me.email;

function refresh(){
 const projects=myProjects(), skills=mySkills(), blogs=get('blogs'), messages=get('messages').filter(x=>x.email===me.email);
 pcount.textContent=projects.length;bcount.textContent=blogs.length;mcount.textContent=messages.length;
 plist.innerHTML=projects.length?projects.map(x=>`<div class="item"><div><span class="tag">${esc(x.category)}</span><b>${esc(x.title)}</b><p>${esc(x.description)}</p><small>${esc(x.tech||'HTML • CSS • JavaScript')}</small></div><div class="actions"><button class="smallbtn" onclick="editP(${x.id})">Edit</button><button class="smallbtn delete" onclick="delP(${x.id})">Remove</button></div></div>`).join(''):'<div class="empty">You have not added any projects yet.</div>';
 slist.innerHTML=skills.length?skills.map(x=>`<div class="item"><div><span class="tag">SKILL</span><b>${esc(x.name)}</b><p>${esc(x.description||'Personal skill')}</p></div><div class="actions"><button class="smallbtn" onclick="editS(${x.id})">Edit</button><button class="smallbtn delete" onclick="delS(${x.id})">Remove</button></div></div>`).join(''):'<div class="empty">You have not added any skills yet.</div>';
 const recent=[...projects.slice(-2).map(x=>({type:'PROJECT',title:x.title,text:x.category})),...skills.slice(-2).map(x=>({type:'SKILL',title:x.name,text:'Personal skill'}))].slice(-4).reverse();
 recentContent.innerHTML=recent.length?recent.map(x=>`<div class="recent-card"><small>${x.type}</small><b>${esc(x.title)}</b><span>${esc(x.text)}</span></div>`).join(''):'<div class="empty">Add a project or skill to see it here.</div>';
}
refresh();

showP.onclick=()=>{pform.classList.remove('hidden');pform.reset();pid.value='';pt.focus()};
cancelP.onclick=()=>pform.classList.add('hidden');
pform.onsubmit=e=>{e.preventDefault();let a=get('projects');let x={id:pid.value?+pid.value:Date.now(),ownerEmail:me.email,ownerName:me.name,title:pt.value.trim(),category:pcat.value,description:pd.value.trim(),tech:ptc.value.trim()};let i=a.findIndex(y=>y.id===x.id&&y.ownerEmail===me.email);if(i>=0)a[i]=x;else a.push(x);put('projects',a);pform.classList.add('hidden');refresh()};
window.editP=id=>{let x=myProjects().find(y=>y.id===id);if(!x)return;pid.value=x.id;pt.value=x.title;pcat.value=x.category;pd.value=x.description;ptc.value=x.tech||'';pform.classList.remove('hidden');pt.focus()};
window.delP=id=>{let x=myProjects().find(y=>y.id===id);if(x&&confirm(`Remove “${x.title}” from your portfolio?`)){put('projects',get('projects').filter(y=>!(y.id===id&&y.ownerEmail===me.email)));refresh()}};

showS.onclick=()=>{sform.classList.remove('hidden');sform.reset();sid.value='';st.focus()};
cancelS.onclick=()=>sform.classList.add('hidden');
sform.onsubmit=e=>{e.preventDefault();let a=get('userSkills');let x={id:sid.value?+sid.value:Date.now(),ownerEmail:me.email,ownerName:me.name,name:st.value.trim(),description:sd.value.trim()};let i=a.findIndex(y=>y.id===x.id&&y.ownerEmail===me.email);if(i>=0)a[i]=x;else a.push(x);put('userSkills',a);sform.classList.add('hidden');refresh()};
window.editS=id=>{let x=mySkills().find(y=>y.id===id);if(!x)return;sid.value=x.id;st.value=x.name;sd.value=x.description||'';sform.classList.remove('hidden');st.focus()};
window.delS=id=>{let x=mySkills().find(y=>y.id===id);if(x&&confirm(`Remove “${x.name}” from your skills?`)){put('userSkills',get('userSkills').filter(y=>!(y.id===id&&y.ownerEmail===me.email)));refresh()}};

logout.onclick=()=>{localStorage.removeItem('currentUser');location.href='login.html'};
