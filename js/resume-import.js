// Attempts to parse assets/Resume.pdf for Projects and Experience and update the page
(function () {
  const PDFJS = window['pdfjs-dist/build/pdf'];
  if (!PDFJS) return;

  async function loadPdfText(url) {
    try {
      const doc = await PDFJS.getDocument(url).promise;
      const pages = [];
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const txt = await page.getTextContent();
        const str = txt.items.map(it => it.str).join(' ');
        pages.push(str);
      }
      return pages.join('\n');
    } catch (e) {
      return '';
    }
  }

  function extractSection(text, startRe, stopRes) {
    const start = text.search(startRe);
    if (start === -1) return '';
    let end = text.length;
    for (const re of stopRes) {
      const idx = text.slice(start + 1).search(re);
      if (idx !== -1) end = Math.min(end, start + 1 + idx);
    }
    return text.slice(start, end);
  }

  function parseProjects(section) {
    if (!section) return [];
    const lines = section.split(/\n|\u2022|•|\-|\d+\./).map(s => s.trim()).filter(Boolean);
    const results = [];
    for (const line of lines) {
      if (results.length >= 6) break;
      if (line.length < 6) continue;
      const title = line.split(':')[0].slice(0, 60);
      const desc = line.includes(':') ? line.split(':').slice(1).join(':').trim() : line;
      results.push({ title, description: desc, tech: [], url: '#' });
    }
    return results;
  }

  function parseExperience(section) {
    if (!section) return [];
    const chunks = section.split(/\n{1,3}/).map(s => s.trim()).filter(Boolean);
    const results = [];
    for (const c of chunks) {
      if (results.length >= 6) break;
      const m = c.match(/^(.*?)(?: at | @ | - )(.*?)(?:\s+\(|\,|\s+\d|$)/i);
      const role = m ? m[1].trim() : c.split(' - ')[0].slice(0, 60);
      const company = m ? m[2].trim() : 'Company';
      results.push({ role, company, period: '', summary: c.slice(0, 140) });
    }
    return results;
  }

  async function init() {
    const d = window.PORTFOLIO_DATA;
    const resumeUrl = d?.basics?.resumeUrl || 'assets/Resume.pdf';
    const text = await loadPdfText(resumeUrl);
    if (!text) return;

    const projectsSec = extractSection(text, /projects?/i, [/experience/i, /work\s+experience/i, /education/i, /skills?/i]);
    const experienceSec = extractSection(text, /(work\s+)?experience/i, [/projects?/i, /education/i, /skills?/i]);

    const projects = parseProjects(projectsSec);
    const experience = parseExperience(experienceSec);

    // Update DOM if we found anything
    if (projects.length) {
      const projEl = document.getElementById('projects-grid');
      projEl.innerHTML = '';
      projects.slice(0, 6).forEach(p => {
        const card = document.createElement('article');
        card.className = 'project-card reveal';
        card.innerHTML = `
          <h3 class="project-title"><a href="${p.url}" target="_blank" rel="noopener">${p.title}</a></h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-meta">${(p.tech||[]).map(t => `<span class='tag'>${t}</span>`).join('')}</div>
        `;
        projEl.appendChild(card);
      });
    }

    if (experience.length) {
      const expEl = document.getElementById('experience-timeline');
      expEl.innerHTML = '';
      experience.slice(0, 6).forEach(e => {
        const li = document.createElement('li');
        li.className = 'reveal';
        li.innerHTML = `
          <div class="role">${e.role}</div>
          <div class="company">${e.company}</div>
          <div class="period">${e.period}</div>
          <p>${e.summary}</p>
        `;
        expEl.appendChild(li);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();


