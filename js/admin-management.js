(() => {
  const container = document.getElementById('adminUserManagement');
  if (!container) return;

  const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
  const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser') || 'null');

  const readPortfolio = (key, email) => {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter(item => !email || item.ownerEmail === email || item.email === email || item.userEmail === email);
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

  function render() {
    const current = getCurrentUser();
    if (!current || current.role !== 'admin') {
      container.innerHTML = '<p class="muted">Admin access required.</p>';
      return;
    }

    const users = getUsers().filter(u => u.role !== 'admin');
    if (!users.length) {
      container.innerHTML = '<div class="empty-state"><strong>No registered users yet.</strong><span>Create a user account to see it here.</span></div>';
      return;
    }

    container.innerHTML = users.map(user => {
      const projects = readPortfolio('projects', user.email);
      const skills = readPortfolio('skills', user.email);

      return `
        <article class="admin-user-card">
          <div class="admin-user-top">
            <div class="admin-avatar">${escapeHtml((user.name || 'U').charAt(0).toUpperCase())}</div>
            <div class="admin-user-info">
              <h3>${escapeHtml(user.name || 'Unnamed User')}</h3>
              <p>${escapeHtml(user.email)}</p>
            </div>
            <button class="danger-btn" data-remove-user="${escapeHtml(user.email)}">Remove User</button>
          </div>
          <div class="admin-user-stats">
            <span><b>${projects.length}</b> Projects</span>
            <span><b>${skills.length}</b> Skills</span>
          </div>
          <details>
            <summary>View portfolio data</summary>
            <div class="admin-data-grid">
              <div>
                <h4>Projects</h4>
                ${projects.length ? `<ul>${projects.map(p => `<li>${escapeHtml(p.title || p.name || 'Untitled Project')}</li>`).join('')}</ul>` : '<p class="muted">No projects.</p>'}
              </div>
              <div>
                <h4>Skills</h4>
                ${skills.length ? `<ul>${skills.map(s => `<li>${escapeHtml(s.name || s.title || s.skill || 'Skill')}</li>`).join('')}</ul>` : '<p class="muted">No skills.</p>'}
              </div>
            </div>
          </details>
        </article>
      `;
    }).join('');
  }

  container.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-user]');
    if (!button) return;

    const email = button.getAttribute('data-remove-user');
    if (!confirm(`Remove user ${email}? This removes the user account only.`)) return;

    const users = getUsers().filter(u => u.email !== email || u.role === 'admin');
    localStorage.setItem('users', JSON.stringify(users));
    render();
  });

  render();
})();
