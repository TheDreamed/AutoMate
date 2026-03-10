// ===== Admin Panel Logic =====

// Import parseMarkdown from blog.js context (loaded separately on admin page)
// We include a minimal version here since admin.html doesn't load blog.js
function parseMarkdown(md) {
  if (!md) return '';
  let html = md;
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, function(match, header, sep, body) {
    const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
  html = html.replace(/((?:<oli>.*<\/oli>\n?)+)/g, function(match) {
    return '<ol>' + match.replace(/<\/?oli>/g, function(tag) {
      return tag.replace('oli', 'li');
    }) + '</ol>';
  });
  html = html.replace(/\n\n(?!<)/g, '</p><p>');
  html = html.replace(/<p>\s*<(h[1-4]|ul|ol|blockquote|pre|hr|table)/g, '<$1');
  html = html.replace(/<\/(h[1-4]|ul|ol|blockquote|pre|table)>\s*<\/p>/g, '</$1>');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<hr>\s*<\/p>/g, '<hr>');
  html = html.replace(/<p><hr>/g, '<hr>');
  return html;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getAllArticles() {
  const baseArticles = typeof ARTICLES !== 'undefined' ? [...ARTICLES] : [];
  const stored = localStorage.getItem('automate_articles');
  if (stored) {
    try {
      const localArticles = JSON.parse(stored);
      const baseIds = new Set(baseArticles.map(a => a.id));
      localArticles.forEach(a => {
        if (!baseIds.has(a.id)) {
          baseArticles.push(a);
        }
      });
    } catch (e) { /* ignore */ }
  }
  return baseArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ===== Password Management =====
const DEFAULT_PASSWORD = 'automate2026';

function getPassword() {
  return localStorage.getItem('automate_admin_pw') || DEFAULT_PASSWORD;
}

function setPassword(pw) {
  localStorage.setItem('automate_admin_pw', pw);
}

function isAuthenticated() {
  return sessionStorage.getItem('automate_admin_auth') === 'true';
}

function authenticate() {
  sessionStorage.setItem('automate_admin_auth', 'true');
}

function logout() {
  sessionStorage.removeItem('automate_admin_auth');
  location.reload();
}

// ===== Notification =====
function showNotification(message, type) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'notification';
  el.textContent = message;
  Object.assign(el.style, {
    position: 'fixed', top: '90px', right: '24px', padding: '16px 24px',
    borderRadius: '8px', fontWeight: '500', fontSize: '0.95rem', zIndex: '9999',
    background: type === 'success' ? '#059669' : '#dc2626', color: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideIn 0.3s ease'
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  // Check if already authenticated
  if (isAuthenticated()) {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    initDashboard();
  }

  // Login form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('admin-password').value;
    if (pw === getPassword()) {
      authenticate();
      loginScreen.style.display = 'none';
      dashboard.style.display = 'block';
      initDashboard();
    } else {
      loginError.style.display = 'block';
      document.getElementById('admin-password').value = '';
    }
  });
});

function initDashboard() {
  let editingId = null;

  // Logout
  document.getElementById('logout-btn').addEventListener('click', logout);

  // Tabs
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
      document.getElementById('tab-' + tab.dataset.tab).style.display = 'block';
      if (tab.dataset.tab === 'manage') renderManageList();
    });
  });

  // ===== Editor =====
  const titleInput = document.getElementById('article-title');
  const categoryInput = document.getElementById('article-category');
  const authorInput = document.getElementById('article-author');
  const excerptInput = document.getElementById('article-excerpt');
  const contentInput = document.getElementById('article-content');
  const featuredInput = document.getElementById('article-featured');
  const previewBody = document.getElementById('preview-body');
  const previewPanel = document.getElementById('editor-preview');
  const editorTitle = document.getElementById('editor-title');

  // Toolbar actions
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const ta = contentInput;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = ta.value.substring(start, end);
      let insert = '';

      switch (action) {
        case 'bold': insert = `**${selected || 'bold text'}**`; break;
        case 'italic': insert = `*${selected || 'italic text'}*`; break;
        case 'heading': insert = `\n### ${selected || 'Heading'}\n`; break;
        case 'link': insert = `[${selected || 'link text'}](url)`; break;
        case 'quote': insert = `\n> ${selected || 'quote text'}\n`; break;
        case 'ul': insert = `\n- ${selected || 'list item'}\n- \n- \n`; break;
        case 'ol': insert = `\n1. ${selected || 'first item'}\n2. \n3. \n`; break;
        case 'code': insert = selected.includes('\n') ? `\n\`\`\`\n${selected}\n\`\`\`\n` : `\`${selected || 'code'}\``; break;
        case 'hr': insert = '\n\n---\n\n'; break;
        case 'table': insert = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n'; break;
      }

      ta.value = ta.value.substring(0, start) + insert + ta.value.substring(end);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + insert.length;
      updatePreview();
    });
  });

  // Live preview
  contentInput.addEventListener('input', updatePreview);

  function updatePreview() {
    if (previewPanel.style.display !== 'none') {
      previewBody.innerHTML = parseMarkdown(contentInput.value) || '<p style="color: var(--gray);">Start writing to see a preview...</p>';
    }
  }

  // Preview toggle
  document.getElementById('preview-toggle').addEventListener('click', () => {
    const isShowing = previewPanel.style.display !== 'none';
    previewPanel.style.display = isShowing ? 'none' : 'block';
    if (!isShowing) updatePreview();
  });

  document.getElementById('close-preview').addEventListener('click', () => {
    previewPanel.style.display = 'none';
  });

  // Clear
  document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear all fields?')) {
      clearEditor();
    }
  });

  function clearEditor() {
    titleInput.value = '';
    categoryInput.value = '';
    authorInput.value = 'AutoMate Team';
    excerptInput.value = '';
    contentInput.value = '';
    featuredInput.checked = false;
    editingId = null;
    editorTitle.textContent = 'New Article';
    previewBody.innerHTML = '<p style="color: var(--gray);">Start writing to see a preview...</p>';
  }

  // Save draft
  document.getElementById('save-draft-btn').addEventListener('click', () => {
    const draft = {
      title: titleInput.value,
      category: categoryInput.value,
      author: authorInput.value,
      excerpt: excerptInput.value,
      content: contentInput.value,
      featured: featuredInput.checked
    };
    localStorage.setItem('automate_draft', JSON.stringify(draft));
    showNotification('Draft saved!', 'success');
  });

  // Load draft if exists
  const draft = localStorage.getItem('automate_draft');
  if (draft) {
    try {
      const d = JSON.parse(draft);
      titleInput.value = d.title || '';
      categoryInput.value = d.category || '';
      authorInput.value = d.author || 'AutoMate Team';
      excerptInput.value = d.excerpt || '';
      contentInput.value = d.content || '';
      featuredInput.checked = d.featured || false;
    } catch (e) { /* ignore */ }
  }

  // Publish
  document.getElementById('publish-btn').addEventListener('click', () => {
    if (!titleInput.value.trim()) {
      showNotification('Please enter an article title.', 'error');
      return;
    }
    if (!contentInput.value.trim()) {
      showNotification('Please write some content.', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const wordCount = contentInput.value.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    const article = {
      id: editingId || slugify(titleInput.value),
      title: titleInput.value.trim(),
      excerpt: excerptInput.value.trim() || titleInput.value.trim(),
      content: contentInput.value,
      author: authorInput.value.trim() || 'AutoMate Team',
      date: today,
      category: categoryInput.value.trim() || 'General',
      readTime: readTime,
      featured: featuredInput.checked
    };

    // Save to localStorage
    const stored = localStorage.getItem('automate_articles');
    let localArticles = stored ? JSON.parse(stored) : [];
    const existingIdx = localArticles.findIndex(a => a.id === article.id);
    if (existingIdx >= 0) {
      localArticles[existingIdx] = article;
    } else {
      localArticles.push(article);
    }
    localStorage.setItem('automate_articles', JSON.stringify(localArticles));

    // Remove draft
    localStorage.removeItem('automate_draft');

    // Generate code output for articles-data.js
    const escapedContent = article.content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const codeOutput = `  {
    id: "${article.id}",
    title: "${article.title.replace(/"/g, '\\"')}",
    excerpt: "${article.excerpt.replace(/"/g, '\\"')}",
    content: \`${escapedContent}\`,
    author: "${article.author}",
    date: "${article.date}",
    category: "${article.category}",
    readTime: "${article.readTime}",
    featured: ${article.featured}
  }`;

    // Show output modal
    document.getElementById('output-code').value = codeOutput;
    document.getElementById('output-modal').style.display = 'flex';

    showNotification(editingId ? 'Article updated!' : 'Article published!', 'success');
    clearEditor();
  });

  // Modal close
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('output-modal').style.display = 'none';
  });

  document.getElementById('output-modal').addEventListener('click', (e) => {
    if (e.target.id === 'output-modal') {
      document.getElementById('output-modal').style.display = 'none';
    }
  });

  // Copy code
  document.getElementById('copy-code-btn').addEventListener('click', () => {
    const code = document.getElementById('output-code');
    code.select();
    navigator.clipboard.writeText(code.value).then(() => {
      showNotification('Code copied to clipboard!', 'success');
    });
  });

  // ===== Manage Articles =====
  function renderManageList() {
    const list = document.getElementById('manage-list');
    const articles = getAllArticles();

    if (articles.length === 0) {
      list.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 40px;">No articles yet. Go to the Write tab to create one.</p>';
      return;
    }

    list.innerHTML = articles.map(article => `
      <div class="manage-item">
        <div class="manage-item-info">
          <h3>${article.title}</h3>
          <div class="article-meta">
            <span class="manage-category">${article.category || 'General'}</span>
            <span class="meta-dot">&#183;</span>
            <span>${formatDate(article.date)}</span>
            <span class="meta-dot">&#183;</span>
            <span>${article.readTime}</span>
            ${article.featured ? '<span class="manage-featured">Featured</span>' : ''}
          </div>
        </div>
        <div class="manage-item-actions">
          <a href="article.html?id=${article.id}" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" target="_blank">View</a>
          <button class="btn btn-outline edit-article-btn" data-id="${article.id}" style="padding: 6px 12px; font-size: 0.8rem;">Edit</button>
          <button class="btn btn-outline delete-article-btn" data-id="${article.id}" style="padding: 6px 12px; font-size: 0.8rem; color: #dc2626; border-color: #dc2626;">Delete</button>
        </div>
      </div>
    `).join('');

    // Edit buttons
    list.querySelectorAll('.edit-article-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const article = getAllArticles().find(a => a.id === btn.dataset.id);
        if (!article) return;

        editingId = article.id;
        titleInput.value = article.title;
        categoryInput.value = article.category || '';
        authorInput.value = article.author || 'AutoMate Team';
        excerptInput.value = article.excerpt || '';
        contentInput.value = article.content || '';
        featuredInput.checked = article.featured || false;
        editorTitle.textContent = 'Edit Article';

        // Switch to editor tab
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="editor"]').classList.add('active');
        document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
        document.getElementById('tab-editor').style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Delete buttons
    list.querySelectorAll('.delete-article-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        const stored = localStorage.getItem('automate_articles');
        let localArticles = stored ? JSON.parse(stored) : [];
        localArticles = localArticles.filter(a => a.id !== btn.dataset.id);
        localStorage.setItem('automate_articles', JSON.stringify(localArticles));

        showNotification('Article deleted (local copy removed).', 'success');
        renderManageList();
      });
    });
  }

  // ===== Settings =====
  document.getElementById('change-password-btn').addEventListener('click', () => {
    const current = document.getElementById('current-password').value;
    const newPw = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (current !== getPassword()) {
      showNotification('Current password is incorrect.', 'error');
      return;
    }
    if (newPw.length < 6) {
      showNotification('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPw !== confirm) {
      showNotification('New passwords do not match.', 'error');
      return;
    }

    setPassword(newPw);
    showNotification('Password updated successfully!', 'success');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });

  // Add slideIn animation
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
  document.head.appendChild(style);
}
