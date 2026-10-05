const me=JSON.parse(localStorage.getItem('currentUser')||'null');
if(!me||me.role!=='admin')location.href='login.html';
const G=k=>JSON.parse(localStorage.getItem(k)||'[]');
const P=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const A=()=>G('activity');
function logActivity(text){const a=A();a.unshift({id:Date.now(),text,date:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});P('activity',a.slice(0,8));}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function refreshActivity(){
 const a=A();
 activityList.innerHTML=a.length?a.map(x=>`<div class="activity"><span class="activity-dot"></span><div><b>${esc(x.text)}</b><small>${esc(x.date)}</small></div></div>`).join(''):'<div class="empty">No recent activity. Add or edit content to see the activity feed.</div>';
 lastActivity.textContent=a[0]?a[0].text:'No activity yet';
}
function refresh(){
 usersN.textContent=G('users').filter(x=>x.role==='user').length;
 projectsN.textContent=G('projects').length;
 blogsN.textContent=G('blogs').length;
 messagesN.textContent=G('messages').length;
 plist.innerHTML=G('projects').map(x=>`<div class="item"><div><span class="tag">${esc(x.category)}</span><b>${esc(x.title)}</b><p>${esc(x.description)}</p></div><div class="actions"><button class="smallbtn" onclick="editP(${x.id})">Edit</button><button class="smallbtn delete" onclick="delP(${x.id})">Delete</button></div></div>`).join('')||'<div class="empty">No projects.</div>';
 blist.innerHTML=G('blogs').map(x=>`<div class="item"><div><span class="tag">${esc(x.category)}</span><b>${esc(x.title)}</b><p>${esc(x.description)}</p></div><div class="actions"><button class="smallbtn" onclick="editB(${x.id})">Edit</button><button class="smallbtn delete" onclick="delB(${x.id})">Delete</button></div></div>`).join('')||'<div class="empty">No blogs.</div>';
 mlist.innerHTML=G('messages').map(x=>`<div class="message"><b>${esc(x.name)} — ${esc(x.subject)}</b><p>${esc(x.email)} • ${esc(x.date)}</p><p>${esc(x.message)}</p><button class="smallbtn delete" onclick="delM(${x.id})">Delete</button></div>`).join('')||'<div class="empty">No messages.</div>';
 ulist.innerHTML=G('users').filter(x=>x.role==='user').map(x=>`<div class="user"><strong>${esc(x.name)}</strong>${esc(x.email)}</div>`).join('')||'<div class="empty">No registered users.</div>';
 refreshActivity();
}
refresh();

showP.onclick=()=>{pform.classList.remove('hidden');pform.reset();pid.value='';pt.focus()};
cancelP.onclick=()=>pform.classList.add('hidden');
pform.onsubmit=e=>{e.preventDefault();let a=G('projects'),x={id:pid.value?+pid.value:Date.now(),title:pt.value.trim(),category:pcat.value,description:pd.value.trim(),tech:ptc.value.trim()},i=a.findIndex(y=>y.id===x.id);const editing=i>=0;i>=0?a[i]=x:a.push(x);P('projects',a);logActivity(`${editing?'Updated':'Added'} project: ${x.title}`);pform.classList.add('hidden');refresh()};
window.editP=id=>{let x=G('projects').find(y=>y.id===id);if(!x)return;pid.value=x.id;pt.value=x.title;pcat.value=x.category;pd.value=x.description;ptc.value=x.tech;pform.classList.remove('hidden');pt.focus()};
window.delP=id=>{let x=G('projects').find(y=>y.id===id);if(x&&confirm(`Delete “${x.title}”?`)){P('projects',G('projects').filter(y=>y.id!==id));logActivity(`Deleted project: ${x.title}`);refresh()}};

showB.onclick=()=>{bform.classList.remove('hidden');bform.reset();bid.value='';bt.focus()};
cancelB.onclick=()=>bform.classList.add('hidden');
bform.onsubmit=e=>{e.preventDefault();let a=G('blogs'),x={id:bid.value?+bid.value:Date.now(),title:bt.value.trim(),category:bc.value.trim(),description:bd.value.trim()},i=a.findIndex(y=>y.id===x.id);const editing=i>=0;i>=0?a[i]=x:a.push(x);P('blogs',a);logActivity(`${editing?'Updated':'Published'} blog: ${x.title}`);bform.classList.add('hidden');refresh()};
window.editB=id=>{let x=G('blogs').find(y=>y.id===id);if(!x)return;bid.value=x.id;bt.value=x.title;bc.value=x.category;bd.value=x.description;bform.classList.remove('hidden');bt.focus()};
window.delB=id=>{let x=G('blogs').find(y=>y.id===id);if(x&&confirm(`Delete “${x.title}”?`)){P('blogs',G('blogs').filter(y=>y.id!==id));logActivity(`Deleted blog: ${x.title}`);refresh()}};
window.delM=id=>{let x=G('messages').find(y=>y.id===id);if(x&&confirm('Delete this message?')){P('messages',G('messages').filter(y=>y.id!==id));logActivity(`Deleted message from ${x.name}`);refresh()}};
clearActivity.onclick=()=>{P('activity',[]);refreshActivity()};
logout.onclick=()=>{localStorage.removeItem('currentUser');location.href='login.html'};
