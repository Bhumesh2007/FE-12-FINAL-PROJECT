const projects0=[
 {id:1,title:'Student Result Management',category:'JavaScript',description:'Interactive result management interface for academic records.',tech:'HTML • CSS • JavaScript'},
 {id:2,title:'Weather Information Dashboard',category:'JavaScript',description:'Responsive dashboard with location search and dynamic cards.',tech:'HTML • CSS • JavaScript'},
 {id:3,title:'Personal Portfolio',category:'Web',description:'Portfolio platform with authentication and content management.',tech:'HTML • CSS • JavaScript'}
];
const blogs0=[
 {id:1,title:'Why Responsive Design Matters',category:'Web Development',description:'How responsive layouts improve user experience across devices.'},
 {id:2,title:'Understanding LocalStorage',category:'JavaScript',description:'How browser LocalStorage can persist small application data.'},
 {id:3,title:'Grid vs Flexbox',category:'CSS',description:'When to use Grid for two dimensions and Flexbox for alignment.'}
];
const get=k=>JSON.parse(localStorage.getItem(k)||'[]');
const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
if(!localStorage.getItem('projects'))put('projects',projects0);
if(!localStorage.getItem('blogs'))put('blogs',blogs0);

const skills=[
 ['HTML5','Semantic structure','Core','90%'],
 ['CSS3','Grid • Flexbox • Responsive UI','Core','88%'],
 ['JavaScript','DOM • Events • LocalStorage','Core','84%'],
 ['Git & GitHub','Version control • Deployment','Tools','78%'],
 ['UI/UX Basics','Layout • Visual hierarchy','Design','82%'],
 ['Problem Solving','Logic • Debugging • Iteration','Practice','86%']
];
const sg=document.getElementById('skillsGrid');
if(sg)sg.innerHTML=skills.map((x,i)=>`<article class="skill-card"><div class="skill-number">0${i+1}</div><div class="skill-card-head"><div><span class="skill-category">${x[2]}</span><h3>${x[0]}</h3></div><strong>${x[3]}</strong></div><p>${x[1]}</p><div class="bar"><i style="width:${x[3]}"></i></div><div class="skill-foot"><span>Project-ready</span><span>↗</span></div></article>`).join('');

function openCertificate(card){
 const src=card.dataset.certificate;
 const title=card.dataset.title||'Certificate';
 let modal=document.getElementById('certificateModal');
 if(!modal){
   modal=document.createElement('div');
   modal.id='certificateModal';
   modal.className='certificate-modal';
   modal.innerHTML='<div class="certificate-viewer"><button class="certificate-close" aria-label="Close">&times;</button><div class="certificate-viewer-head"><div><small>DOCUMENT PREVIEW</small><h3 id="certificateTitle"></h3></div><span>Click outside to close</span></div><div class="certificate-image-wrap"><img id="certificateImage" alt="Certificate preview"></div></div>';
   document.body.appendChild(modal);
   modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
   modal.querySelector('.certificate-close').addEventListener('click',()=>modal.classList.remove('show'));
 }
 modal.querySelector('#certificateTitle').textContent=title;
 modal.querySelector('#certificateImage').src=src;
 modal.querySelector('#certificateImage').alt=title;
 modal.classList.add('show');
}

document.querySelectorAll('.certificate-card').forEach(card=>card.addEventListener('click',()=>openCertificate(card)));

function toast(message,type='success'){
 let box=document.getElementById('toast');
 if(!box){box=document.createElement('div');box.id='toast';box.className='toast';document.body.appendChild(box)}
 box.className=`toast show ${type}`;box.textContent=message;
 clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>box.classList.remove('show'),2600);
}

function openDetails(type,id){
 const list=get(type==='project'?'projects':'blogs');
 const item=list.find(x=>String(x.id)===String(id));
 if(!item)return;
 let modal=document.getElementById('detailModal');
 if(!modal){
  modal=document.createElement('div');modal.id='detailModal';modal.className='detail-modal';
  modal.innerHTML='<div class="detail-box"><button class="detail-close" aria-label="Close">&times;</button><div id="detailContent"></div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
  modal.querySelector('.detail-close').addEventListener('click',()=>modal.classList.remove('show'));
 }
 const extra=type==='project'?`<div class="detail-tech">Technologies: ${item.tech||'HTML • CSS • JavaScript'}</div>`:'';
 const typeLabel=type==='project'?'PROJECT DETAILS':'ARTICLE PREVIEW';
 document.getElementById('detailContent').innerHTML=`<small class="modal-kicker">${typeLabel}</small><span class="tag">${item.category||'General'}</span><h2>${item.title}</h2><p>${item.description||'No description available.'}</p>${extra}<div class="modal-note">Interactive preview • Click outside or press Esc to close.</div>`;
 modal.classList.add('show');
}

let activeFilter='All';
function renderProjects(){
 const search=(document.getElementById('projectSearch')?.value||'').trim().toLowerCase();
 const all=get('projects');
 const items=all.filter(x=>(activeFilter==='All'||x.category===activeFilter)&&(!search||`${x.title} ${x.description} ${x.tech}`.toLowerCase().includes(search)));
 const g=document.getElementById('projectsGrid');
 if(g)g.innerHTML=items.length?items.map((x,i)=>`<article class="project-card" data-project-id="${x.id}" tabindex="0" role="button" aria-label="Open ${x.title}"><div class="pic"><span>${String(i+1).padStart(2,'0')}</span><small>VIEW CASE</small></div><div class="body"><span class="tag">${x.category}</span><h3>${x.title}</h3><p>${x.description}</p><div class="tech">${x.tech}</div><span class="open-link">View details →</span></div></article>`).join(''):`<div class="empty-state"><b>No projects found</b><span>Try another search or category.</span></div>`;
 const c=document.getElementById('pc');if(c)c.textContent=all.length;
}
renderProjects();
document.querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-f]').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.f;renderProjects()}));
document.getElementById('projectSearch')?.addEventListener('input',renderProjects);

function renderBlogs(){
 const search=(document.getElementById('blogSearch')?.value||'').trim().toLowerCase();
 const items=get('blogs').filter(x=>!search||`${x.title} ${x.description} ${x.category}`.toLowerCase().includes(search));
 const bg=document.getElementById('blogGrid');
 if(bg)bg.innerHTML=items.length?items.map((x,i)=>`<article class="blog-card" data-blog-id="${x.id}" tabindex="0" role="button" aria-label="Open ${x.title}"><div class="blog-number">${String(i+1).padStart(2,'0')}</div><span class="tag">${x.category}</span><h3>${x.title}</h3><p>${x.description}</p><span class="open-link">Read preview →</span></article>`).join(''):`<div class="empty-state"><b>No articles found</b><span>Try another search term.</span></div>`;
}
renderBlogs();
document.getElementById('blogSearch')?.addEventListener('input',renderBlogs);

document.addEventListener('click',e=>{
 const project=e.target.closest('[data-project-id]');const blog=e.target.closest('[data-blog-id]');
 if(project)openDetails('project',project.dataset.projectId);
 if(blog)openDetails('blog',blog.dataset.blogId);
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){document.getElementById('detailModal')?.classList.remove('show');document.getElementById('certificateModal')?.classList.remove('show');}
 if(e.key==='Enter'){
  const project=document.activeElement?.closest?.('[data-project-id]');const blog=document.activeElement?.closest?.('[data-blog-id]');
  if(project)openDetails('project',project.dataset.projectId);if(blog)openDetails('blog',blog.dataset.blogId);
 }
});

const f=document.getElementById('contactForm');
if(f)f.addEventListener('submit',e=>{e.preventDefault();const a=get('messages');a.push({id:Date.now(),name:document.getElementById('cn').value,email:document.getElementById('ce').value,subject:document.getElementById('cs').value,message:document.getElementById('cm').value,date:new Date().toLocaleString()});put('messages',a);f.reset();document.getElementById('status').textContent='Message sent successfully.';toast('Message sent successfully.')});

document.getElementById('menu')?.addEventListener('click',()=>{const n=document.getElementById('nav');n.classList.toggle('mobile-open')});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav')?.classList.remove('mobile-open')));

document.getElementById('themeToggle')?.addEventListener('click',()=>{
 document.body.classList.toggle('light-mode');
 const light=document.body.classList.contains('light-mode');
 localStorage.setItem('portfolioTheme',light?'light':'dark');
 document.getElementById('themeToggle').textContent=light?'☀':'☾';
 toast(light?'Light theme enabled':'Dark theme enabled','info');
});
if(localStorage.getItem('portfolioTheme')==='light'){document.body.classList.add('light-mode');const t=document.getElementById('themeToggle');if(t)t.textContent='☀'}

const progress=document.getElementById('scrollProgress');const back=document.getElementById('backTop');
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;const pct=max>0?(window.scrollY/max)*100:0;if(progress)progress.style.width=`${pct}%`;if(back)back.classList.toggle('show',window.scrollY>500)});
back?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
