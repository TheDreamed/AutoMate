// ===== Markdown Parser (lightweight) =====
function parseMarkdown(md) {
  if (!md) return '';
  let html = md;

  // Escape HTML (but preserve intentional tags)
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, function(match, header, sep, body) {
    const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>');

  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge adjacent blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
  html = html.replace(/((?:<oli>.*<\/oli>\n?)+)/g, function(match) {
    return '<ol>' + match.replace(/<\/?oli>/g, function(tag) {
      return tag.replace('oli', 'li');
    }) + '</ol>';
  });

  // Paragraphs
  html = html.replace(/\n\n(?!<)/g, '</p><p>');
  html = html.replace(/^(?!<[houptbl])/gm, function(match, offset) {
    if (offset === 0) return '<p>';
    return match;
  });

  // Clean up empty paragraphs and fix nesting
  html = html.replace(/<p>\s*<(h[1-4]|ul|ol|blockquote|pre|hr|table)/g, '<$1');
  html = html.replace(/<\/(h[1-4]|ul|ol|blockquote|pre|table)>\s*<\/p>/g, '</$1>');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<hr>\s*<\/p>/g, '<hr>');
  html = html.replace(/<p><hr>/g, '<hr>');

  return html;
}

// ===== Format date =====
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== Generate article slug =====
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ===== Get articles (from data file + localStorage) =====
function getAllArticles() {
  const baseArticles = typeof ARTICLES !== 'undefined' ? [...ARTICLES] : [];
  const stored = localStorage.getItem('automate_articles');
  if (stored) {
    try {
      const localArticles = JSON.parse(stored);
      // Merge: local articles override base articles with same id
      const baseIds = new Set(baseArticles.map(a => a.id));
      localArticles.forEach(a => {
        if (!baseIds.has(a.id)) {
          baseArticles.push(a);
        }
      });
    } catch (e) { /* ignore parse errors */ }
  }
  // Sort by date (newest first)
  return baseArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ===== Blog Listing Page =====
function initBlogListing() {
  const grid = document.getElementById('blog-grid');
  const featuredSection = document.getElementById('blog-featured');
  const filterTabs = document.getElementById('filter-tabs');
  const emptyState = document.getElementById('blog-empty');

  if (!grid) return;

  const articles = getAllArticles();

  // Build category filter tabs
  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab';
    btn.dataset.filter = cat;
    btn.textContent = cat;
    filterTabs.appendChild(btn);
  });

  // Filter click handler
  filterTabs.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-tab')) return;
    filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderArticles(e.target.dataset.filter);
  });

  function renderArticles(filter) {
    const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter);
    const featured = filtered.find(a => a.featured);
    const rest = featured ? filtered.filter(a => a.id !== featured.id) : filtered;

    // Featured article
    if (featured && featuredSection) {
      featuredSection.style.display = 'block';
      featuredSection.querySelector('.container').innerHTML = `
        <a href="article.html?id=${featured.id}" class="featured-card">
          <div class="featured-content">
            <div class="featured-badge">Featured</div>
            <h2>${featured.title}</h2>
            <p>${featured.excerpt}</p>
            <div class="article-meta">
              <span>${featured.author}</span>
              <span class="meta-dot">&#183;</span>
              <span>${formatDate(featured.date)}</span>
              <span class="meta-dot">&#183;</span>
              <span>${featured.readTime}</span>
            </div>
          </div>
        </a>
      `;
    } else if (featuredSection) {
      featuredSection.style.display = 'none';
    }

    // Article grid
    if (rest.length === 0 && !featured) {
      grid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    grid.innerHTML = rest.map(article => `
      <a href="article.html?id=${article.id}" class="blog-card">
        <div class="blog-card-body">
          <div class="blog-card-category">${article.category || 'General'}</div>
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
          <div class="article-meta">
            <span>${article.author}</span>
            <span class="meta-dot">&#183;</span>
            <span>${formatDate(article.date)}</span>
            <span class="meta-dot">&#183;</span>
            <span>${article.readTime}</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  renderArticles('all');
}

// ===== Article Detail Page =====
function initArticlePage() {
  const headerEl = document.getElementById('article-header');
  const bodyEl = document.getElementById('article-body');
  const notFound = document.getElementById('article-not-found');
  const articlePage = document.querySelector('.article-page');

  if (!headerEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    articlePage.style.display = 'none';
    notFound.style.display = 'block';
    return;
  }

  const articles = getAllArticles();
  const article = articles.find(a => a.id === id);

  if (!article) {
    articlePage.style.display = 'none';
    notFound.style.display = 'block';
    return;
  }

  // Update page title and meta
  document.title = `${article.title} | AutoMate Blog`;
  updateArticleMeta(article);

  // Render header
  headerEl.innerHTML = `
    <div class="article-category-tag">${article.category || 'General'}</div>
    <h1>${article.title}</h1>
    <div class="article-meta article-meta-large">
      <span>${article.author}</span>
      <span class="meta-dot">&#183;</span>
      <span>${formatDate(article.date)}</span>
      <span class="meta-dot">&#183;</span>
      <span>${article.readTime}</span>
    </div>
  `;

  // Render content
  bodyEl.innerHTML = parseMarkdown(article.content);

  // Copy link button
  const copyBtn = document.getElementById('copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyBtn.innerHTML = '&#10003; Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copy Link';
        }, 2000);
      });
    });
  }
}

// ===== Navbar (shared) =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }
}

// ===== Newsletter Form =====
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    setTimeout(() => {
      // Show success notification
      const el = document.createElement('div');
      el.textContent = 'You\'re subscribed! Check your inbox for a welcome email.';
      Object.assign(el.style, {
        position: 'fixed', top: '90px', right: '24px', padding: '16px 24px',
        borderRadius: '8px', fontWeight: '500', fontSize: '0.95rem', zIndex: '9999',
        background: '#059669', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      });
      document.body.appendChild(el);
      setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 4000);

      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
}

// ===== Update OG meta for articles =====
function updateArticleMeta(article) {
  if (!article) return;
  const setMeta = (prop, content) => {
    let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
    if (el) el.setAttribute('content', content);
  };
  setMeta('og:title', article.title + ' | AutoMate Blog');
  setMeta('og:description', article.excerpt);
  setMeta('twitter:title', article.title);
  setMeta('twitter:description', article.excerpt);
  document.querySelector('meta[name="description"]')?.setAttribute('content', article.excerpt);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBlogListing();
  initArticlePage();
  initNewsletter();
});
