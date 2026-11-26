(async () => {
  const normText = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const isSafeHttpsUrl = (u) => typeof u === 'string' && /^https:\/\/[^\s]+$/i.test(u.trim());

  const loadPortalData = async () => {
    const inlineEl = document.getElementById('unina-catalog-data');
    if (inlineEl && inlineEl.textContent.trim().startsWith('{')) {
      return JSON.parse(inlineEl.textContent);
    }
    const catalogUrl = document.documentElement.dataset.catalogUrl;
    const calendarUrl = document.documentElement.dataset.calendarUrl;
    if (!catalogUrl) throw new Error('Catalog data URL mancante');
    const [catResp, calResp] = await Promise.all([
      fetch(catalogUrl),
      calendarUrl ? fetch(calendarUrl) : Promise.resolve(null)
    ]);
    if (!catResp.ok) throw new Error(`HTTP ${catResp.status} nel caricamento del catalogo`);
    const catalogData = await catResp.json();
    let calendarData = catalogData.examCalendar || null;
    if (calResp && calResp.ok) {
      calendarData = await calResp.json();
    }
    return {
      ...catalogData,
      examCalendar: calendarData || { entries: [], months: [], totalDates: 0, totalEntries: 0 }
    };
  };

  let DATA;
  try {
    DATA = await loadPortalData();
  } catch (err) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Errore nel caricamento dell\'indice. Ricarica la pagina.';
      toast.classList.add('visible');
    }
    console.error('Impossibile caricare i dati del portale:', err);
    return;
  }

  // Ricostruisci client-side searchBlob dei corsi (rimosso dal JSON per ridurre il payload)
  (DATA.courses || []).forEach((c) => {
    if (!c.searchBlob) {
      c.searchBlob = normText(
        `${c.name} ${c.aliases || ''} ${c.titleEn || ''} ${c.ssd || ''} ${c.propedeuticita || ''} ${(c.profs || []).map((p) => p.display).join(' ')}`
      );
    }
  });

  const courseAliasesMap = new Map(
    (DATA.courses || []).map((c) => [c.name, normText(`${c.name} ${c.aliases || ''}`)])
  );
  if (DATA.filesCompact && (!DATA.files || !DATA.files.length)) {
    const fc = DATA.filesCompact;
    const encUri = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
    const aliasRaw = new Map((DATA.courses || []).map((c) => [c.name, c.aliases || '']));
    DATA.files = fc.rows.map((r) => {
      const name = r[0];
      const size = r[1];
      const yearGroup = fc.ygs[r[2]];
      const course = fc.crs[r[3]];
      const prof = fc.prs[r[4]];
      const cat = fc.cts[r[5]];
      const dir = fc.dirs[r[6]];
      const subpath = r[7] || '';
      const dateIso = r[8] || '';
      const dateDisplay = r[9] || '';
      const dotIdx = name.lastIndexOf('.');
      const ext = dotIdx > 0 ? name.slice(dotIdx).toLowerCase() : '';
      const urlPath = `${dir}/${encUri(name)}`;
      const aliases = aliasRaw.get(course) || '';
      const searchBlob = normText(`${name} ${course} ${aliases} ${prof} ${yearGroup} ${cat} ${subpath} ${dateDisplay}`);
      return {
        name,
        ext,
        size,
        yearGroup,
        course,
        prof,
        cat,
        subpath,
        dateIso,
        dateDisplay,
        urlPath,
        searchBlob
      };
    });
  } else if (!Array.isArray(DATA.files)) {
    DATA.files = [];
  }
  const REPO_URL = 'https://github.com/Carloj005/UNINA-INFORMATICA';
  const RAW_BASE = 'https://raw.githubusercontent.com/Carloj005/UNINA-INFORMATICA/master';
  const MEDIA_BASE = 'https://media.githubusercontent.com/media/Carloj005/UNINA-INFORMATICA/master';

  // Set coerente di icone vettoriali inline (Lucide stroke 1.75)
  const SVG_ICONS = {
    home: '<svg class="icon" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    fileText: '<svg class="icon" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    presentation: '<svg class="icon" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
    archive: '<svg class="icon" viewBox="0 0 24 24"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
    image: '<svg class="icon" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    code: '<svg class="icon" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    eye: '<svg class="icon" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    download: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    link: '<svg class="icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    copy: '<svg class="icon" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    plus: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    book: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    folder: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    checkCircle: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    circle: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
    star: '<svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starFilled: '<svg class="icon icon-filled" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    chevLeft: '<svg class="icon" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    chevRight: '<svg class="icon" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    chevDown: '<svg class="icon" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    sliders: '<svg class="icon" viewBox="0 0 24 24"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    map: '<svg class="icon" viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>',
    terminal: '<svg class="icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>',
    externalLink: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>',
    github: '<svg class="icon" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    send: '<svg class="icon" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    refresh: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
    alertCircle: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>'
  };

  const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif']);
  const TEXT_EXTS = new Set([
    '.md', '.txt', '.c', '.h', '.cpp', '.hpp', '.cc', '.java', '.py', '.sh', '.ps1',
    '.sql', '.js', '.ts', '.html', '.css', '.json', '.yml', '.yaml', '.tex',
    '.lisp', '.lsp', '.cl', '.pro', '.pl', '.asm', '.s', '.xml', '.csv'
  ]);

  const fmtBytes = (b) => {
    if (!b || b <= 0) return '—';
    if (b >= 1073741824) return (b / 1073741824).toFixed(2) + ' GB';
    if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
    if (b >= 1024) return Math.round(b / 1024) + ' KB';
    return b + ' B';
  };

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const setStatText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setStatText('home-stat-files', DATA.files.length.toLocaleString('it-IT'));
  setStatText('home-stat-courses', DATA.courses.length);
  setStatText('home-stat-teams', DATA.stats.teamsCount);
  setStatText('home-stat-size', fmtBytes(DATA.stats.totalBytes));
  setStatText('home-stat-updated', DATA.stats.generatedAt);

  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 2200);
  };

  const copyText = async (txt, label) => {
    try {
      await navigator.clipboard.writeText(txt);
      showToast(label || 'Copiato negli appunti');
    } catch {
      showToast('Impossibile copiare automaticamente');
    }
  };

  // Gestione tema Chiaro / Scuro / Sistema + sincronizzazione favicon e meta theme-color
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const metaThemeColor = document.getElementById('meta-theme-color');
  const faviconEl = document.getElementById('site-favicon');
  const syncFaviconTheme = () => {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let stored = null;
    try { stored = localStorage.getItem('color-scheme'); } catch {}
    const isDark = (stored === 'dark' || stored === 'light') ? (stored === 'dark') : sysDark;
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    if (metaThemeColor) {
      metaThemeColor.content = isDark ? '#070d19' : '#f4f7fb';
    }
    if (!faviconEl) return;
    const bg = isDark ? '%23142c54' : '%23dff0ff';
    const bdr = isDark ? '%233b82f6' : '%230f4c81';
    const fg = isDark ? '%23ffffff' : '%230f4c81';
    const acc = isDark ? '%237dd3fc' : '%230284c7';
    faviconEl.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="2" y="2" width="60" height="60" rx="14" fill="${bg}" stroke="${bdr}" stroke-width="3"/><path d="M32 10L50 18L32 26L14 18L32 10Z" fill="${fg}"/><path d="M46 20V29" stroke="${acc}" stroke-width="3.5" stroke-linecap="round"/><circle cx="46" cy="30.5" r="2.2" fill="${acc}"/><path d="M23 34L14 42L23 50" stroke="${fg}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 34L50 42L41 50" stroke="${fg}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.5 32L28.5 52" stroke="${acc}" stroke-width="4.5" stroke-linecap="round"/></svg>`;
  };
  syncFaviconTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncFaviconTheme);

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runViewTransition = (fn) => {
    if (document.startViewTransition && !prefersReducedMotion()) {
      try {
        const vt = document.startViewTransition(fn);
        vt.ready.catch(() => {});
        vt.finished.catch(() => {});
        return vt;
      } catch {}
    }
    fn();
    return null;
  };

  const applyThemeSwitch = (ev) => {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const sysScheme = sysDark ? 'dark' : 'light';
    let stored = null;
    try { stored = localStorage.getItem('color-scheme'); } catch {}
    const current = (stored === 'dark' || stored === 'light') ? stored : sysScheme;
    const target = current === 'dark' ? 'light' : 'dark';
    const commitTheme = () => {
      if (target === sysScheme) {
        try { localStorage.removeItem('color-scheme'); } catch {}
        metaScheme.content = 'light dark';
        showToast('Tema automatico di sistema');
      } else {
        try { localStorage.setItem('color-scheme', target); } catch {}
        metaScheme.content = target;
        showToast(target === 'dark' ? 'Tema scuro attivato' : 'Tema chiaro attivato');
      }
      syncFaviconTheme();
    };
    if (document.startViewTransition && !prefersReducedMotion()) {
      const btnRect = themeToggleBtn?.getBoundingClientRect();
      const x = (ev && typeof ev.clientX === 'number' && ev.clientX > 0)
        ? ev.clientX
        : (btnRect ? btnRect.left + btnRect.width / 2 : window.innerWidth - 40);
      const y = (ev && typeof ev.clientY === 'number' && ev.clientY > 0)
        ? ev.clientY
        : (btnRect ? btnRect.top + btnRect.height / 2 : 32);
      const maxR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      document.documentElement.classList.add('vt-theme');
      const vt = document.startViewTransition(commitTheme);
      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxR}px at ${x}px ${y}px)`] },
          { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
      vt.finished.finally(() => document.documentElement.classList.remove('vt-theme'));
    } else {
      commitTheme();
    }
  };

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', applyThemeSwitch);
  window.addEventListener('storage', (e) => {
    if (e.key === 'color-scheme') {
      metaScheme.content = e.newValue ?? 'light dark';
      syncFaviconTheme();
    }
  });

  // Modal history, scroll preservation, mobile swipe-down-to-close & focus restoration
  let lastDialogTrigger = null;
  let savedDialogScrollY = 0;
  let ignoreModalBackPopstate = 0;
  let replacingModalHistory = false;
  const dialogStateMap = new WeakMap();

  const getDialogState = (dialog) => {
    let st = dialogStateMap.get(dialog);
    if (!st) {
      st = { historyPushed: false, closedViaPopstate: false, skipCloseRestore: false };
      dialogStateMap.set(dialog, st);
    }
    return st;
  };

  const openDialogWithHistory = (dialog) => {
    if (!dialog || dialog.open) return;
    const st = getDialogState(dialog);
    st.historyPushed = false;
    st.closedViaPopstate = false;
    st.skipCloseRestore = false;
    lastDialogTrigger = document.activeElement;
    savedDialogScrollY = window.scrollY;
    dialog.style.transform = '';
    dialog.showModal();
    try {
      history.pushState({ modal: dialog.id }, '', location.href);
      st.historyPushed = true;
    } catch {}
  };

  const closeDialogForNavigation = (dialog) => {
    if (!dialog || !dialog.open) return;
    const st = getDialogState(dialog);
    st.skipCloseRestore = true;
    if (st.historyPushed && history.state && history.state.modal === dialog.id) {
      replacingModalHistory = true;
      try { history.replaceState(null, '', location.href); } catch {}
    }
    st.historyPushed = false;
    dialog.close();
  };

  // Inject swipe-down drag handle into every modal dialog for mobile sheet ergonomics
  for (const dialog of document.querySelectorAll('dialog')) {
    const inner = dialog.querySelector('.dialog-inner');
    if (inner && !dialog.querySelector('.dialog-drag-handle')) {
      const handle = document.createElement('div');
      handle.className = 'dialog-drag-handle';
      handle.setAttribute('aria-hidden', 'true');
      dialog.insertBefore(handle, inner);
      let startY = 0;
      let deltaY = 0;
      let dragging = false;
      handle.addEventListener('pointerdown', (e) => {
        if (window.innerWidth > 768) return;
        dragging = true;
        startY = e.clientY;
        deltaY = 0;
        dialog.classList.add('is-dragging');
        handle.setPointerCapture?.(e.pointerId);
      });
      handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        deltaY = Math.max(0, e.clientY - startY);
        dialog.style.transform = `translateY(${deltaY}px)`;
      });
      const endSwipe = () => {
        if (!dragging) return;
        dragging = false;
        dialog.classList.remove('is-dragging');
        if (deltaY > 80) {
          dialog.style.transform = '';
          dialog.close();
        } else {
          dialog.style.transform = '';
        }
      };
      handle.addEventListener('pointerup', endSwipe);
      handle.addEventListener('pointercancel', endSwipe);
    }
  }

  // Fallback for <dialog closedby="any"> on Safari
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, dialog); });
      dialog.addEventListener('pointerup', (e) => { if (pressedOutside && outside(e, dialog)) dialog.close(); });
    }
  }
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('close', () => {
      const st = getDialogState(dialog);
      dialog.returnValue = '';
      dialog.style.transform = '';
      const shouldRestore = !st.skipCloseRestore;
      const shouldPopHistory = st.historyPushed && !st.closedViaPopstate && !st.skipCloseRestore;
      st.historyPushed = false;
      st.closedViaPopstate = false;
      st.skipCloseRestore = false;

      if (shouldRestore) {
        if (lastDialogTrigger && typeof lastDialogTrigger.focus === 'function') {
          try { lastDialogTrigger.focus({ preventScroll: true }); } catch {}
          lastDialogTrigger = null;
        }
        if (Math.abs(window.scrollY - savedDialogScrollY) > 10) {
          window.scrollTo({ top: savedDialogScrollY, behavior: 'instant' });
        }
      } else {
        lastDialogTrigger = null;
      }

      if (shouldPopHistory && history.state && history.state.modal === dialog.id) {
        ignoreModalBackPopstate += 1;
        try { history.back(); } catch { ignoreModalBackPopstate = Math.max(0, ignoreModalBackPopstate - 1); }
      }
    });
  }

  // Pinned Courses in localStorage ("I miei corsi fissati")
  const PIN_KEY = 'unina_pinned_courses';
  let pinnedCourses = new Set();
  try {
    const rawPins = JSON.parse(localStorage.getItem(PIN_KEY) || '[]');
    if (Array.isArray(rawPins)) pinnedCourses = new Set(rawPins);
  } catch {}

  const savePins = () => {
    try { localStorage.setItem(PIN_KEY, JSON.stringify([...pinnedCourses])); } catch {}
  };

  let coursePinnedOnly = false;
  const bottomNavFavBadge = document.getElementById('bottom-nav-fav-count');
  const syncFavBadge = () => {
    if (!bottomNavFavBadge) return;
    const cnt = pinnedCourses.size;
    bottomNavFavBadge.textContent = String(cnt);
    bottomNavFavBadge.hidden = cnt === 0;
  };

  let filesRendered = false;
  let coursesRendered = false;
  let calendarRendered = false;
  let hubRendered = false;

  const togglePinCourse = (courseName) => {
    if (pinnedCourses.has(courseName)) {
      pinnedCourses.delete(courseName);
      showToast(`"${courseName}" rimosso dai corsi fissati`);
    } else {
      pinnedCourses.add(courseName);
      showToast(`"${courseName}" fissato in Home`);
    }
    savePins();
    syncFavBadge();
    renderPinnedHome();
    if (coursesRendered) renderCourses();
    if (calendarRendered && typeof renderCalendar === 'function') renderCalendar(false);
  };

  // View Switching: Standalone Home (#home-screen) <-> Full Catalog (#catalog-screen)
  const homeScreen = document.getElementById('home-screen');
  const catalogScreen = document.getElementById('catalog-screen');
  const openHubHeaderBtn = document.getElementById('open-hub-header-btn');
  const catalogViewTitle = document.getElementById('catalog-view-title');
  const catalogViewSub = document.getElementById('catalog-view-sub');
  const panels = document.querySelectorAll('#catalog-screen [data-catalog-panel]');
  const headerNavLinks = document.querySelectorAll('[data-header-nav]');
  const bottomNavItems = document.querySelectorAll('[data-bottom-nav]');
  let activeCatalogTab = 'tab-btn-files';

  const CATALOG_VIEW_META = {
    'tab-btn-files': {
      title: 'Catalogo file ed esami',
      sub: 'Slide, appunti, tracce d\'esame e progetti filtrabili per anno, corso e docente.'
    },
    'tab-btn-courses': {
      title: 'Insegnamenti e codici Teams',
      sub: 'Schede didattiche, propedeuticità, canali docenti e codici Microsoft Teams.'
    },
    'tab-btn-calendar': {
      title: 'Calendario esami DIETI',
      sub: 'Appelli ufficiali della Laurea Triennale sincronizzati automaticamente dal portale DIETI.'
    },
    'tab-btn-hub': {
      title: 'Mappe campus e clone Git',
      sub: 'Planimetrie Monte Sant\'Angelo e Via Claudio, clone selettivo per corso e moduli community.'
    }
  };

  const syncShellNav = (key) => {
    headerNavLinks.forEach((a) => {
      const isCur = a.dataset.headerNav === key || (key === 'favorites' && a.dataset.headerNav === 'tab-btn-courses');
      a.classList.toggle('is-current', isCur);
      if (isCur) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    bottomNavItems.forEach((b) => {
      const isCur = b.dataset.bottomNav === key;
      if (isCur) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    openHubHeaderBtn?.classList.toggle('is-active', key === 'tab-btn-hub');
  };

  const activateCatalogTab = (tabId) => {
    activeCatalogTab = CATALOG_VIEW_META[tabId] ? tabId : 'tab-btn-files';
    const meta = CATALOG_VIEW_META[activeCatalogTab];
    if (catalogViewTitle) catalogViewTitle.textContent = meta.title;
    if (catalogViewSub) catalogViewSub.textContent = meta.sub;
    panels.forEach((p) => {
      p.hidden = p.dataset.catalogPanel !== activeCatalogTab;
    });
    if (activeCatalogTab === 'tab-btn-files' && !filesRendered && typeof applyFileFilters === 'function') {
      filesRendered = true;
      applyFileFilters(false);
    } else if (activeCatalogTab === 'tab-btn-courses' && !coursesRendered && typeof renderCourses === 'function') {
      coursesRendered = true;
      renderCourses();
    } else if (activeCatalogTab === 'tab-btn-calendar' && !calendarRendered && typeof renderCalendar === 'function') {
      calendarRendered = true;
      renderCalendar(false);
    } else if (activeCatalogTab === 'tab-btn-hub' && !hubRendered && typeof renderHub === 'function') {
      hubRendered = true;
      renderHub();
    }
    syncShellNav(activeCatalogTab === 'tab-btn-courses' && coursePinnedOnly ? 'favorites' : activeCatalogTab);
  };

  // Filter DOM references
  const filterYear = document.getElementById('filter-year');
  const filterCourse = document.getElementById('filter-course');
  const filterProf = document.getElementById('filter-prof');
  const filterCat = document.getElementById('filter-cat');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('file-search');
  const quickChips = document.querySelectorAll('[data-quick-cat]');
  const toggleGroupBtn = document.getElementById('toggle-group-folders');
  const activePathBar = document.getElementById('active-path-bar');
  const activePathText = document.getElementById('active-path-text');
  const clearSubpathBtn = document.getElementById('clear-subpath-btn');
  const resetBtn = document.getElementById('reset-filters');
  const mobileFiltersToggle = document.getElementById('mobile-filters-toggle');
  const mobileFiltersLabel = document.getElementById('mobile-filters-label');
  const filtersGridBox = document.getElementById('filters-grid-box');
  const activeFilterPills = document.getElementById('active-filter-pills');

  let activeSubpath = '';
  let groupByFolder = false;

  // Calendar DOM refs & state declared here so syncUrlState can reference them safely
  const calSearch = document.getElementById('calendar-search');
  const calYearFilter = document.getElementById('calendar-year-filter');
  const calRegFilter = document.getElementById('calendar-reg-filter');
  const calMonthFilter = document.getElementById('calendar-month-filter');
  const calUpcomingChip = document.getElementById('cal-upcoming-chip');
  const calPinnedChip = document.getElementById('cal-pinned-chip');
  const calViewBtns = document.querySelectorAll('[data-cal-view]');
  const calMobileFiltersToggle = document.getElementById('cal-mobile-filters-toggle');
  const calMobileFiltersLabel = document.getElementById('cal-mobile-filters-label');
  const calFiltersGridBox = document.getElementById('cal-filters-grid-box');
  const calResultsCount = document.getElementById('calendar-results-count');
  const calResetBtn = document.getElementById('reset-calendar-filters');
  const calResultsEl = document.getElementById('calendar-results');
  let calUpcomingOnly = true;
  let calPinnedOnly = false;
  let calViewMode = 'courses';

  const catalogFiltersSheet = document.getElementById('catalog-filters-sheet');
  const catalogSheetBackdrop = document.getElementById('catalog-sheet-backdrop');
  const catalogSheetClose = document.getElementById('catalog-sheet-close');
  const catalogSheetHandle = document.getElementById('catalog-sheet-handle');
  const sheetResetFilters = document.getElementById('sheet-reset-filters');
  const sheetApplyFilters = document.getElementById('sheet-apply-filters');

  // Focus trap helper for mobile bottom sheets via inert on background siblings
  const inertAppliedEls = new Set();
  const setBackgroundInert = (activeSheet, activeBackdrop, enable) => {
    if (!enable) {
      inertAppliedEls.forEach((el) => { el.inert = false; });
      inertAppliedEls.clear();
      return;
    }
    setBackgroundInert(null, null, false);
    let cur = activeSheet;
    while (cur && cur !== document.body) {
      const parent = cur.parentElement;
      if (!parent) break;
      for (const sib of parent.children) {
        if (sib === cur || sib === activeBackdrop || sib.id === 'toast') continue;
        if (!sib.inert) {
          sib.inert = true;
          inertAppliedEls.add(sib);
        }
      }
      cur = parent;
    }
  };

  const setCatalogSheetOpen = (open) => {
    if (!catalogFiltersSheet || !mobileFiltersToggle) return;
    const isModalSheet = window.innerWidth <= 1023;
    catalogFiltersSheet.style.transform = '';
    catalogFiltersSheet.classList.toggle('is-open', open);
    filtersGridBox?.classList.toggle('is-open', open);
    catalogSheetBackdrop?.classList.toggle('is-open', open);
    mobileFiltersToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    setBackgroundInert(catalogFiltersSheet, catalogSheetBackdrop, open && isModalSheet);
    if (open) {
      filterYear?.focus({ preventScroll: true });
    } else if (document.activeElement && catalogFiltersSheet.contains(document.activeElement)) {
      mobileFiltersToggle.focus({ preventScroll: true });
    }
  };

  if (mobileFiltersToggle && catalogFiltersSheet) {
    mobileFiltersToggle.addEventListener('click', () => {
      setCatalogSheetOpen(!catalogFiltersSheet.classList.contains('is-open'));
    });
    catalogSheetBackdrop?.addEventListener('click', () => setCatalogSheetOpen(false));
    catalogSheetClose?.addEventListener('click', () => setCatalogSheetOpen(false));
    sheetApplyFilters?.addEventListener('click', () => setCatalogSheetOpen(false));
    sheetResetFilters?.addEventListener('click', () => {
      resetBtn?.click();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && catalogFiltersSheet.classList.contains('is-open')) {
        setCatalogSheetOpen(false);
      }
    });
    // Draggable swipe-down-to-close gesture on mobile handle
    if (catalogSheetHandle) {
      let dragStartY = 0;
      let dragDeltaY = 0;
      let dragging = false;
      catalogSheetHandle.addEventListener('pointerdown', (e) => {
        if (window.innerWidth > 1023) return;
        dragging = true;
        dragStartY = e.clientY;
        dragDeltaY = 0;
        catalogFiltersSheet.classList.add('is-dragging');
        catalogSheetHandle.setPointerCapture?.(e.pointerId);
      });
      catalogSheetHandle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        dragDeltaY = Math.max(0, e.clientY - dragStartY);
        catalogFiltersSheet.style.transform = `translateY(${dragDeltaY}px)`;
      });
      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        catalogFiltersSheet.classList.remove('is-dragging');
        if (dragDeltaY > 75) setCatalogSheetOpen(false);
        else catalogFiltersSheet.style.transform = '';
      };
      catalogSheetHandle.addEventListener('pointerup', endDrag);
      catalogSheetHandle.addEventListener('pointercancel', endDrag);
    }
  }

  const tabToHash = (tabId) => {
    if (tabId === 'tab-btn-courses') return '#corsi';
    if (tabId === 'tab-btn-calendar') return '#calendario';
    if (tabId === 'tab-btn-hub') return '#mappe';
    return '#catalogo';
  };

  // Sync current filters to URL query parameters for shareable deep links
  const syncUrlState = (tabId) => {
    const currentTab = tabId || activeCatalogTab || 'tab-btn-files';
    if (homeScreen && !homeScreen.hidden) return;
    const params = new URLSearchParams();
    if (currentTab === 'tab-btn-files') {
      if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
      if (filterYear.value) params.set('year', filterYear.value);
      if (filterCourse.value) params.set('course', filterCourse.value);
      if (filterProf.value) params.set('prof', filterProf.value);
      if (filterCat.value) params.set('cat', filterCat.value);
      if (activeSubpath) params.set('sub', activeSubpath);
      if (sortSelect.value !== 'relevance') params.set('sort', sortSelect.value);
      if (groupByFolder) params.set('group', '1');
    } else if (currentTab === 'tab-btn-calendar') {
      if (calSearch && calSearch.value.trim()) params.set('cal_q', calSearch.value.trim());
      if (calYearFilter && calYearFilter.value) params.set('cal_year', calYearFilter.value);
      if (calRegFilter && calRegFilter.value !== 'current') params.set('cal_reg', calRegFilter.value);
      if (calMonthFilter && calMonthFilter.value) params.set('cal_month', calMonthFilter.value);
      if (!calUpcomingOnly) params.set('cal_past', '1');
      if (calPinnedOnly) params.set('cal_pins', '1');
      if (calViewMode === 'timeline') params.set('cal_view', 'timeline');
    }
    const hash = tabToHash(currentTab);
    const qs = params.toString();
    const nextUrl = `${location.pathname}${qs ? '?' + qs : ''}${hash}`;
    try { history.replaceState({ view: 'catalog', tabId: currentTab }, '', nextUrl); } catch {}
  };

  const homeSections = document.querySelectorAll('[data-home-section]');
  const catalogExpandables = document.querySelectorAll('#mobile-filters-toggle, #cal-mobile-filters-toggle');
  const setCatalogInteractive = (enabled) => {
    catalogExpandables.forEach((el) => {
      if (enabled) el.removeAttribute('aria-disabled');
      else el.setAttribute('aria-disabled', 'true');
    });
  };

  const openCatalog = (tabId = 'tab-btn-files', pushHistory = true) => {
    const applyOpen = () => {
      homeSections.forEach((sec) => { sec.hidden = true; });
      catalogScreen.hidden = false;
      setCatalogInteractive(true);
      activateCatalogTab(tabId);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (pushHistory && catalogScreen.hidden) runViewTransition(applyOpen);
    else applyOpen();
    if (pushHistory) {
      const hash = tabToHash(tabId);
      if (replacingModalHistory) {
        replacingModalHistory = false;
        try { history.replaceState({ view: 'catalog', tabId }, '', `${location.pathname}${hash}`); } catch {}
      } else {
        try { history.pushState({ view: 'catalog', tabId }, '', `${location.pathname}${hash}`); } catch {}
      }
      syncUrlState(tabId);
    }
  };

  const openHome = (pushHistory = true) => {
    const applyHome = () => {
      catalogScreen.hidden = true;
      setCatalogInteractive(false);
      homeSections.forEach((sec) => { sec.hidden = false; });
      syncShellNav('home');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (pushHistory && !catalogScreen.hidden) runViewTransition(applyHome);
    else applyHome();
    if (pushHistory && (location.hash || location.search)) {
      try { history.pushState({ view: 'home' }, '', location.pathname); } catch {}
    }
  };

  headerNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.headerNav;
      if (target === 'home') {
        openHome();
      } else {
        if (target === 'tab-btn-courses') coursePinnedOnly = false;
        openCatalog(target);
        if (target === 'tab-btn-courses') renderCourses();
      }
    });
  });

  bottomNavItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.bottomNav;
      if (target === 'home') {
        openHome();
      } else if (target === 'favorites') {
        coursePinnedOnly = pinnedCourses.size > 0;
        openCatalog('tab-btn-courses');
        renderCourses();
        syncShellNav('favorites');
        if (pinnedCourses.size === 0) {
          showToast('Tocca la stellina su un corso per aggiungerlo ai Preferiti');
        }
      } else {
        if (target === 'tab-btn-courses') coursePinnedOnly = false;
        openCatalog(target);
        if (target === 'tab-btn-courses') renderCourses();
      }
    });
  });

  openHubHeaderBtn?.addEventListener('click', () => {
    openCatalog('tab-btn-hub');
  });
  document.querySelectorAll('[data-stat-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.statJump;
      if (tabId === 'tab-btn-courses') coursePinnedOnly = false;
      openCatalog(tabId);
    });
  });
  document.getElementById('open-cmd-palette-btn')?.addEventListener('click', () => {
    if (typeof openCommandPalette === 'function') {
      openCommandPalette();
    } else {
      openCatalog('tab-btn-files');
      searchInput.focus();
    }
  });

  document.getElementById('brand-home-link').addEventListener('click', (e) => {
    e.preventDefault();
    openHome();
  });

  const updateCourseOptions = () => {
    const yr = filterYear.value;
    const prev = filterCourse.value;
    filterCourse.innerHTML = '<option value="">Tutti i corsi</option>';
    DATA.courses
      .filter((c) => !yr || c.yearGroup === yr)
      .forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `${c.name} (${c.fileCount})`;
        filterCourse.appendChild(opt);
      });
    if ([...filterCourse.options].some((o) => o.value === prev)) {
      filterCourse.value = prev;
    }
  };

  const updateProfOptions = () => {
    const yr = filterYear.value;
    const cr = filterCourse.value;
    const prev = filterProf.value;
    filterProf.innerHTML = '<option value="">Tutti i docenti</option>';
    const profSet = new Map();
    DATA.courses
      .filter((c) => (!yr || c.yearGroup === yr) && (!cr || c.name === cr))
      .forEach((c) => {
        c.profs.forEach((p) => {
          if (p.fileCount > 0 || cr) {
            profSet.set(p.display, (profSet.get(p.display) || 0) + p.fileCount);
          }
        });
      });
    [...profSet.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'it'))
      .forEach(([disp, cnt]) => {
        const opt = document.createElement('option');
        opt.value = disp;
        opt.textContent = `${disp} (${cnt})`;
        filterProf.appendChild(opt);
      });
    if ([...filterProf.options].some((o) => o.value === prev)) {
      filterProf.value = prev;
    }
  };

  updateCourseOptions();
  updateProfOptions();

  // Keyboard shortcut '/' for active section search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      e.preventDefault();
      const activeTab = (!catalogScreen.hidden && activeCatalogTab) || 'tab-btn-files';
      if (activeTab === 'tab-btn-calendar' && !catalogScreen.hidden && calSearch) {
        calSearch.focus();
      } else if (activeTab === 'tab-btn-courses' && !catalogScreen.hidden) {
        courseSearch.focus();
      } else {
        openCatalog('tab-btn-files');
        searchInput.focus();
      }
    }
  });

  const ICON_BY_EXT = {
    '.pdf': SVG_ICONS.fileText,
    '.pptx': SVG_ICONS.presentation,
    '.ppt': SVG_ICONS.presentation,
    '.odp': SVG_ICONS.presentation,
    '.docx': SVG_ICONS.fileText,
    '.doc': SVG_ICONS.fileText,
    '.odt': SVG_ICONS.fileText,
    '.epub': SVG_ICONS.book,
    '.zip': SVG_ICONS.archive,
    '.rar': SVG_ICONS.archive,
    '.7z': SVG_ICONS.archive,
    '.jpg': SVG_ICONS.image,
    '.jpeg': SVG_ICONS.image,
    '.png': SVG_ICONS.image,
    '.svg': SVG_ICONS.image,
    '.md': SVG_ICONS.fileText,
    '.txt': SVG_ICONS.fileText,
    '.c': SVG_ICONS.code,
    '.h': SVG_ICONS.code,
    '.cpp': SVG_ICONS.code,
    '.hpp': SVG_ICONS.code,
    '.cc': SVG_ICONS.code,
    '.java': SVG_ICONS.code,
    '.py': SVG_ICONS.code,
    '.sh': SVG_ICONS.code,
    '.ps1': SVG_ICONS.code,
    '.mdj': SVG_ICONS.code,
    '.tex': SVG_ICONS.code,
    '.lisp': SVG_ICONS.code,
    '.lsp': SVG_ICONS.code,
    '.cl': SVG_ICONS.code,
    '.pro': SVG_ICONS.code,
    '.pl': SVG_ICONS.code,
    '.asm': SVG_ICONS.code,
    '.s': SVG_ICONS.code,
    '.xml': SVG_ICONS.code,
    '.csv': SVG_ICONS.code
  };

  const CAT_LABELS = {
    'slides': 'Slides',
    'appunti': 'Appunti',
    'esami/scritto': 'Esame scritto',
    'esami/orale': 'Esame orale',
    'esercizi': 'Esercizi',
    'progetti': 'Progetti',
    'libri': 'Libri',
    'contenuto-non-proprio': 'Community',
    'info-generali': 'Info generali'
  };

  let filteredFiles = [];
  let shownCount = 0;
  const PAGE_SIZE = 60;
  const fileListEl = document.getElementById('file-list');
  const loadMoreWrap = document.getElementById('load-more-wrap');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const resultsCountEl = document.getElementById('results-count');

  // In-Portal File Preview Modal (Images, PDF & Code/Markdown with Sequential Navigation <- / ->)
  const previewModal = document.getElementById('preview-modal');
  const previewTitle = document.getElementById('preview-modal-title');
  const previewSub = document.getElementById('preview-modal-sub');
  const previewToolbar = document.getElementById('preview-toolbar');
  const previewBody = document.getElementById('preview-modal-body');
  let currentPreviewList = [];
  let currentPreviewIdx = -1;
  let previewAbortCtrl = null;
  let previewPdfTimer = null;

  const cancelPendingPreviewWork = () => {
    if (previewAbortCtrl) {
      try { previewAbortCtrl.abort(); } catch {}
      previewAbortCtrl = null;
    }
    if (previewPdfTimer) {
      clearTimeout(previewPdfTimer);
      previewPdfTimer = null;
    }
  };
  previewModal?.addEventListener('close', cancelPendingPreviewWork);

  const isPreviewable = (f) => IMAGE_EXTS.has(f.ext) || TEXT_EXTS.has(f.ext) || f.ext === '.pdf';

  const openFilePreview = async (f) => {
    cancelPendingPreviewWork();
    const rawHref = `${RAW_BASE}/${f.urlPath}`;
    const mediaHref = `${MEDIA_BASE}/${f.urlPath}`;
    const dlHref = `${REPO_URL}/raw/master/${f.urlPath}`;
    const ghHref = `${REPO_URL}/blob/master/${f.urlPath}`;
    previewTitle.textContent = f.name;
    previewSub.textContent = [f.course, f.prof, f.subpath, fmtBytes(f.size)].filter(Boolean).join(' • ');

    // Scope sequential navigation: for images use same exam/folder first; otherwise use current filtered previewable files
    if (IMAGE_EXTS.has(f.ext)) {
      currentPreviewList = DATA.files
        .filter(
          (item) =>
            IMAGE_EXTS.has(item.ext) &&
            item.course === f.course &&
            item.prof === f.prof &&
            item.cat === f.cat &&
            item.subpath === f.subpath
        )
        .sort((a, b) => a.name.localeCompare(b.name, 'it', { numeric: true }));
    } else {
      currentPreviewList = filteredFiles.filter(isPreviewable).slice(0, 120);
    }
    currentPreviewIdx = currentPreviewList.findIndex((item) => item.urlPath === f.urlPath);
    const hasNav = currentPreviewList.length > 1 && currentPreviewIdx !== -1;

    const navHtml = hasNav ? `
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button type="button" class="btn" id="prev-file-btn" ${currentPreviewIdx <= 0 ? 'disabled' : ''}>${SVG_ICONS.chevLeft} Precedente</button>
        <span style="font-size:0.8125rem;color:var(--muted);">${currentPreviewIdx + 1} di ${currentPreviewList.length}</span>
        <button type="button" class="btn" id="next-file-btn" ${currentPreviewIdx >= currentPreviewList.length - 1 ? 'disabled' : ''}>Successivo ${SVG_ICONS.chevRight}</button>
      </div>
    ` : '<div></div>';

    const bindNavButtons = () => {
      if (!hasNav) return;
      const prevBtn = document.getElementById('prev-file-btn');
      const nextBtn = document.getElementById('next-file-btn');
      if (prevBtn) prevBtn.onclick = () => { if (currentPreviewIdx > 0) openFilePreview(currentPreviewList[currentPreviewIdx - 1]); };
      if (nextBtn) nextBtn.onclick = () => { if (currentPreviewIdx < currentPreviewList.length - 1) openFilePreview(currentPreviewList[currentPreviewIdx + 1]); };
    };

    if (IMAGE_EXTS.has(f.ext)) {
      const imgSrc = f.ext === '.svg' ? rawHref : mediaHref;
      previewToolbar.innerHTML = `
        ${navHtml}
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn" id="preview-copy-link-btn">${SVG_ICONS.link} Copia link</button>
          <a class="btn" href="${ghHref}" target="_blank" rel="noopener">Vedi su GitHub</a>
          <a class="btn btn-primary" href="${dlHref}" target="_blank" rel="noopener">${SVG_ICONS.download} Scarica (${fmtBytes(f.size)})</a>
        </div>
      `;
      previewBody.innerHTML = `<img class="map-full" src="${imgSrc}" data-fallback="${rawHref}" alt="${escapeHtml(f.name)}">`;
      const imgEl = previewBody.querySelector('img');
      if (imgEl) {
        imgEl.onerror = () => {
          if (imgEl.dataset.fallback && imgEl.src !== imgEl.dataset.fallback) {
            imgEl.src = imgEl.dataset.fallback;
          }
        };
      }
      document.getElementById('preview-copy-link-btn').onclick = () => copyText(ghHref, 'Link al file copiato');
      bindNavButtons();
      openDialogWithHistory(previewModal);
      return;
    }

    if (f.ext === '.pdf') {
      const gviewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(mediaHref)}&embedded=true`;
      previewToolbar.innerHTML = `
        ${navHtml}
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn" id="preview-copy-link-btn">${SVG_ICONS.link} Copia link</button>
          <a class="btn" href="${ghHref}" target="_blank" rel="noopener">Apri su GitHub</a>
          <a class="btn btn-primary" href="${dlHref}" target="_blank" rel="noopener">${SVG_ICONS.download} Scarica PDF (${fmtBytes(f.size)})</a>
        </div>
      `;
      previewBody.innerHTML = `
        <div class="preview-pdf-fallback" id="preview-pdf-banner">
          <span id="preview-pdf-status">Visualizzatore PDF integrato. Su smartphone puoi aprire o scaricare direttamente il file originale.</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a class="btn btn-primary" href="${dlHref}" target="_blank" rel="noopener">${SVG_ICONS.externalLink} Apri PDF diretto</a>
            <a class="btn" href="${ghHref}" target="_blank" rel="noopener">Vedi su GitHub</a>
          </div>
        </div>
        <iframe class="preview-pdf" id="preview-pdf-iframe" src="${gviewUrl}" title="Anteprima ${escapeHtml(f.name)}" loading="lazy"></iframe>
      `;
      const pdfFrame = document.getElementById('preview-pdf-iframe');
      const pdfBanner = document.getElementById('preview-pdf-banner');
      const pdfStatus = document.getElementById('preview-pdf-status');
      let pdfLoaded = false;
      if (pdfFrame) {
        pdfFrame.addEventListener('load', () => {
          pdfLoaded = true;
          if (previewPdfTimer) {
            clearTimeout(previewPdfTimer);
            previewPdfTimer = null;
          }
        });
      }
      previewPdfTimer = setTimeout(() => {
        if (!pdfLoaded && pdfBanner && pdfStatus) {
          pdfBanner.classList.add('is-warn');
          pdfStatus.textContent = 'Il visualizzatore PDF esterno sta impiegando più tempo del previsto. Apri il PDF diretto o visualizzalo su GitHub.';
        }
      }, 6000);
      document.getElementById('preview-copy-link-btn').onclick = () => copyText(ghHref, 'Link al PDF copiato');
      bindNavButtons();
      openDialogWithHistory(previewModal);
      return;
    }

    previewToolbar.innerHTML = `
      ${navHtml}
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" id="preview-copy-code-btn">${SVG_ICONS.copy} Copia contenuto</button>
        <a class="btn" href="${ghHref}" target="_blank" rel="noopener">Apri su GitHub</a>
        <a class="btn" href="${dlHref}" target="_blank" rel="noopener">${SVG_ICONS.download} Scarica (${fmtBytes(f.size)})</a>
      </div>
    `;
    previewBody.innerHTML = '<div style="display:flex;flex-direction:column;gap:8px;" aria-label="Caricamento anteprima"><div class="skeleton-card"></div><div class="skeleton-card" style="height:140px;"></div></div>';
    bindNavButtons();
    openDialogWithHistory(previewModal);
    const ctrl = new AbortController();
    previewAbortCtrl = ctrl;
    try {
      const resp = await fetch(rawHref, { signal: ctrl.signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      if (previewAbortCtrl !== ctrl) return;
      previewBody.innerHTML = `<pre class="preview-code">${escapeHtml(text)}</pre>`;
      document.getElementById('preview-copy-code-btn').onclick = () => copyText(text, 'Contenuto copiato negli appunti');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      previewBody.innerHTML = '<div class="preview-code">Impossibile caricare l\'anteprima diretta. Usa il pulsante "Apri su GitHub" o "Scarica".</div>';
    } finally {
      if (previewAbortCtrl === ctrl) previewAbortCtrl = null;
    }
  };

  document.addEventListener('keydown', (e) => {
    if (!previewModal.open || currentPreviewList.length <= 1) return;
    if (e.key === 'ArrowLeft' && currentPreviewIdx > 0) {
      openFilePreview(currentPreviewList[currentPreviewIdx - 1]);
    } else if (e.key === 'ArrowRight' && currentPreviewIdx < currentPreviewList.length - 1) {
      openFilePreview(currentPreviewList[currentPreviewIdx + 1]);
    }
  });

  const renderActiveFilterPills = () => {
    if (!activeFilterPills) return;
    activeFilterPills.innerHTML = '';
    const pills = [];
    if (filterYear.value) {
      pills.push({ label: filterYear.value, clear: () => { filterYear.value = ''; updateCourseOptions(); updateProfOptions(); } });
    }
    if (filterCourse.value) {
      pills.push({ label: filterCourse.value, clear: () => { filterCourse.value = ''; updateProfOptions(); } });
    }
    if (filterProf.value) {
      pills.push({ label: filterProf.value, clear: () => { filterProf.value = ''; } });
    }
    if (filterCat.value) {
      pills.push({ label: CAT_LABELS[filterCat.value] || filterCat.value, clear: () => { filterCat.value = ''; } });
    }
    if (activeSubpath) {
      pills.push({ label: `Cartella: ${activeSubpath}`, clear: () => { activeSubpath = ''; } });
    }
    if (pills.length === 0) {
      activeFilterPills.hidden = true;
      return;
    }
    activeFilterPills.hidden = false;
    pills.forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-pill';
      btn.title = `Rimuovi filtro: ${p.label}`;
      btn.innerHTML = `<span>${escapeHtml(p.label)}</span> <span aria-hidden="true">×</span>`;
      btn.addEventListener('click', () => {
        p.clear();
        applyFileFilters();
      });
      activeFilterPills.appendChild(btn);
    });
  };

  const renderFileBatch = (reset) => {
    if (reset) {
      fileListEl.innerHTML = '';
      shownCount = 0;
    }
    if (filteredFiles.length === 0) {
      loadMoreWrap.hidden = true;
      loadMoreBtn.hidden = true;
      const courseHint = filterCourse.value ? ` per ${filterCourse.value}` : '';
      const issueHref = `${REPO_URL}/issues/new?template=richiesta_o_materiale.yml&title=${encodeURIComponent('[Materiale] Richiesta o contributo' + courseHint)}`;
      fileListEl.innerHTML = `
        <div class="empty-state-card">
          <svg class="empty-state-svg" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <rect x="10" y="18" width="48" height="38" rx="8" stroke="currentColor" stroke-width="2.5" fill="var(--primary-soft)"/>
            <path d="M10 28h48" stroke="currentColor" stroke-width="2" opacity="0.5"/>
            <circle cx="53" cy="51" r="14" fill="var(--surface)" stroke="var(--accent-vivid)" stroke-width="3"/>
            <path d="M63 61l8 8" stroke="var(--accent-vivid)" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M48 51h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <h2>Nessun documento trovato con questi filtri</h2>
          <p>Prova a rimuovere qualche filtro, cercare con una sigla diversa (es. ASD, ADE, BD) oppure richiedi o invia il materiale mancante alla community.</p>
          <div class="empty-state-actions">
            <button type="button" class="btn btn-primary" id="empty-reset-btn">Azzera tutti i filtri</button>
            <a class="btn" href="${issueHref}" target="_blank" rel="noopener">${SVG_ICONS.plus} Richiedi o invia materiale</a>
          </div>
        </div>
      `;
      document.getElementById('empty-reset-btn')?.addEventListener('click', () => resetBtn.click());
      return;
    }

    const slice = filteredFiles.slice(shownCount, shownCount + PAGE_SIZE);
    const frag = document.createDocumentFragment();
    let lastGroupKey = shownCount > 0 && filteredFiles[shownCount - 1]
      ? `${filteredFiles[shownCount - 1].course} / ${filteredFiles[shownCount - 1].prof} / ${filteredFiles[shownCount - 1].subpath || CAT_LABELS[filteredFiles[shownCount - 1].cat]}`
      : '';

    slice.forEach((f, idx) => {
      const globalIdx = shownCount + idx;
      if (groupByFolder) {
        const folderLabel = f.subpath || (CAT_LABELS[f.cat] || f.cat);
        const gKey = `${f.course} / ${f.prof} / ${folderLabel}`;
        if (gKey !== lastGroupKey) {
          lastGroupKey = gKey;
          const hdr = document.createElement('div');
          hdr.className = 'folder-group-header';
          hdr.innerHTML = `
            <span class="folder-group-title">
              ${SVG_ICONS.folder}
              <span>${escapeHtml(f.course)}</span>
              ${f.prof ? `<span style="color:var(--muted);font-weight:400;">› ${escapeHtml(f.prof)}</span>` : ''}
              <span>› ${escapeHtml(folderLabel)}</span>
            </span>
            ${f.subpath ? `<button type="button" class="btn" data-filter-sub="${escapeHtml(f.subpath)}" data-filter-course="${escapeHtml(f.course)}">Filtra solo questa cartella</button>` : ''}
          `;
          const subBtn = hdr.querySelector('[data-filter-sub]');
          if (subBtn) {
            subBtn.addEventListener('click', () => {
              filterCourse.value = subBtn.dataset.filterCourse;
              updateProfOptions();
              activeSubpath = subBtn.dataset.filterSub;
              applyFileFilters();
            });
          }
          frag.appendChild(hdr);
        }
      }

      const row = document.createElement('div');
      row.className = globalIdx >= 14 ? 'file-row deferred-card' : 'file-row';
      const iconSvg = ICON_BY_EXT[f.ext] || SVG_ICONS.fileText;
      const extClean = (f.ext || '').replace(/^\./, '').toUpperCase().slice(0, 4);
      const typeClass = f.ext === '.pdf' ? 'type-pdf'
        : (['.pptx', '.ppt', '.odp'].includes(f.ext) ? 'type-slides'
          : (['.zip', '.rar', '.7z'].includes(f.ext) ? 'type-archive'
            : (IMAGE_EXTS.has(f.ext) ? 'type-image'
              : (['.c', '.h', '.java', '.py', '.sh', '.ps1', '.tex', '.mdj'].includes(f.ext) ? 'type-code' : ''))));
      const catLbl = CAT_LABELS[f.cat] || f.cat;
      const viewHref = `${REPO_URL}/blob/master/${f.urlPath}`;
      const rawHref = `${REPO_URL}/raw/master/${f.urlPath}`;
      const canPreviewInPortal = isPreviewable(f);

      row.innerHTML = `
        <div class="file-info">
          <span class="file-icon ${typeClass}" aria-hidden="true">${iconSvg}${extClean ? `<span class="file-ext-lbl">${escapeHtml(extClean)}</span>` : ''}</span>
          <div class="file-body">
            <div class="file-name-row">
              <span class="file-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</span>
              ${f.dateDisplay ? `<span class="date-badge" title="Data di riferimento">${escapeHtml(f.dateDisplay)}</span>` : ''}
            </div>
            <div class="file-crumbs">
              <button type="button" class="cat-tag" data-crumb-cat="${escapeHtml(f.cat)}" title="Filtra per categoria">${escapeHtml(catLbl)}</button>
              <button type="button" class="crumb-btn" data-crumb-year="${escapeHtml(f.yearGroup)}" title="Filtra per anno">${escapeHtml(f.yearGroup)}</button>
              ${f.course ? `<span>›</span> <button type="button" class="crumb-btn" data-crumb-course="${escapeHtml(f.course)}" title="Filtra per questo corso"><strong>${escapeHtml(f.course)}</strong></button>` : ''}
              ${f.prof ? `<span>›</span> <button type="button" class="crumb-btn" data-crumb-prof="${escapeHtml(f.prof)}" title="Filtra per questo docente">${escapeHtml(f.prof)}</button>` : ''}
              ${f.subpath ? `<span>›</span> <button type="button" class="crumb-btn" data-crumb-sub="${escapeHtml(f.subpath)}" data-crumb-course="${escapeHtml(f.course)}" title="Filtra questa sottocartella">${escapeHtml(f.subpath)}</button>` : ''}
            </div>
          </div>
        </div>
        <div class="file-actions">
          <span class="size-tag">${fmtBytes(f.size)}</span>
          <button type="button" class="btn btn-icon-copy" data-copy-file="${escapeHtml(viewHref)}" aria-label="Copia link a ${escapeHtml(f.name)}" title="Copia link diretto">${SVG_ICONS.link}</button>
          ${canPreviewInPortal
            ? `<button type="button" class="btn" data-preview-idx="${globalIdx}">${SVG_ICONS.eye} Anteprima</button>`
            : `<a class="btn" href="${viewHref}" target="_blank" rel="noopener">${SVG_ICONS.eye} Apri</a>`
          }
          <a class="btn btn-primary" href="${rawHref}" target="_blank" rel="noopener">${SVG_ICONS.download} Scarica</a>
        </div>
      `;

      // Interactive breadcrumb clicks & quick copy link
      row.querySelector('[data-copy-file]')?.addEventListener('click', () => {
        copyText(viewHref, `Link a "${f.name}" copiato`);
      });
      row.querySelector('[data-crumb-cat]')?.addEventListener('click', () => {
        filterCat.value = f.cat;
        applyFileFilters();
      });
      row.querySelector('[data-crumb-year]')?.addEventListener('click', () => {
        filterYear.value = f.yearGroup;
        updateCourseOptions();
        updateProfOptions();
        applyFileFilters();
      });
      row.querySelector('[data-crumb-course]')?.addEventListener('click', () => {
        filterYear.value = f.yearGroup;
        updateCourseOptions();
        filterCourse.value = f.course;
        updateProfOptions();
        applyFileFilters();
      });
      row.querySelector('[data-crumb-prof]')?.addEventListener('click', () => {
        filterProf.value = f.prof;
        applyFileFilters();
      });
      row.querySelector('[data-crumb-sub]')?.addEventListener('click', () => {
        filterYear.value = f.yearGroup;
        updateCourseOptions();
        filterCourse.value = f.course;
        updateProfOptions();
        activeSubpath = f.subpath;
        applyFileFilters();
      });
      row.querySelector('[data-preview-idx]')?.addEventListener('click', () => openFilePreview(f));

      frag.appendChild(row);
    });
    fileListEl.appendChild(frag);
    shownCount += slice.length;

    const hasMore = shownCount < filteredFiles.length;
    loadMoreWrap.hidden = !hasMore;
    loadMoreBtn.hidden = !hasMore;
    if (hasMore) {
      loadMoreBtn.textContent = `Mostra altri risultati (${shownCount} di ${filteredFiles.length})`;
    }
  };

  // Weighted relevance scorer (ChatGPT 4.1 model)
  const scoreFileRelevance = (f, tokens, fullQuery) => {
    const fName = normText(f.name);
    const fStem = fName.replace(/\.[^.]+$/, '');
    const cBlob = courseAliasesMap.get(f.course) || normText(f.course);
    const pBlob = normText(f.prof);
    const sBlob = normText(f.subpath);
    const catBlob = normText(f.cat);
    let score = 0;
    if (fName === fullQuery || fStem === fullQuery) score += 100;
    for (const tk of tokens) {
      if (fStem === tk) score += 100;
      else if (fName.includes(tk)) score += 70;
      if (cBlob.includes(tk)) score += 50;
      if (pBlob.includes(tk)) score += 40;
      if (sBlob.includes(tk)) score += 30;
      if (catBlob.includes(tk)) score += 20;
    }
    return score;
  };

  const applyFileFilters = (syncUrl = true) => {
    const qNorm = normText(searchInput.value.trim());
    const tokens = qNorm ? qNorm.split(/\s+/) : [];
    const yr = filterYear.value;
    const cr = filterCourse.value;
    const pr = filterProf.value;
    const ct = filterCat.value;
    const srt = sortSelect.value;

    const activeSelectCount = [yr, cr, pr, ct, srt !== 'relevance' ? srt : ''].filter(Boolean).length;
    if (mobileFiltersLabel) {
      mobileFiltersLabel.textContent = activeSelectCount > 0 ? `Filtri (${activeSelectCount})` : 'Filtri';
    }
    renderActiveFilterPills();

    quickChips.forEach((ch) => {
      ch.setAttribute('aria-pressed', ch.dataset.quickCat === ct ? 'true' : 'false');
    });

    if (activeSubpath) {
      activePathBar.hidden = false;
      activePathText.innerHTML = `${SVG_ICONS.folder} <span>Sottocartella attiva:</span> <strong>${escapeHtml(activeSubpath)}</strong>`;
    } else {
      activePathBar.hidden = true;
    }

    const hasFilter = Boolean(qNorm || yr || cr || pr || ct || activeSubpath || srt !== 'relevance');
    resetBtn.hidden = !hasFilter;

    filteredFiles = DATA.files.filter((f) => {
      if (yr && f.yearGroup !== yr) return false;
      if (cr && f.course !== cr) return false;
      if (pr && f.prof !== pr) return false;
      if (ct && f.cat !== ct) return false;
      if (activeSubpath && f.subpath !== activeSubpath && !f.subpath.startsWith(activeSubpath + '/')) return false;
      if (tokens.length > 0) {
        for (const tk of tokens) {
          if (!f.searchBlob.includes(tk)) return false;
        }
      }
      return true;
    });

    // Sorting
    if (srt === 'date-desc') {
      filteredFiles.sort((a, b) => {
        if (a.dateIso && b.dateIso) return b.dateIso.localeCompare(a.dateIso);
        if (a.dateIso) return -1;
        if (b.dateIso) return 1;
        return a.name.localeCompare(b.name, 'it');
      });
    } else if (srt === 'name-asc') {
      filteredFiles.sort((a, b) => a.name.localeCompare(b.name, 'it'));
    } else if (srt === 'size-asc') {
      filteredFiles.sort((a, b) => (a.size || 0) - (b.size || 0));
    } else if (srt === 'size-desc') {
      filteredFiles.sort((a, b) => (b.size || 0) - (a.size || 0));
    } else if (tokens.length > 0) {
      filteredFiles.sort((a, b) => {
        const diff = scoreFileRelevance(b, tokens, qNorm) - scoreFileRelevance(a, tokens, qNorm);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'it');
      });
    }

    resultsCountEl.textContent = filteredFiles.length === 0
      ? '0 documenti trovati'
      : `${filteredFiles.length.toLocaleString('it-IT')} documenti trovati`;
    if (sheetApplyFilters) {
      sheetApplyFilters.textContent = filteredFiles.length === 0
        ? 'Mostra 0 risultati'
        : `Mostra ${filteredFiles.length.toLocaleString('it-IT')} risultati`;
    }
    renderFileBatch(true);
    if (syncUrl) syncUrlState('tab-btn-files');
  };

  let searchDebounce = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => applyFileFilters(), 120);
  });
  filterYear.addEventListener('change', () => {
    activeSubpath = '';
    updateCourseOptions();
    updateProfOptions();
    applyFileFilters();
  });
  filterCourse.addEventListener('change', () => {
    activeSubpath = '';
    updateProfOptions();
    applyFileFilters();
  });
  filterProf.addEventListener('change', () => applyFileFilters());
  filterCat.addEventListener('change', () => applyFileFilters());
  sortSelect.addEventListener('change', () => applyFileFilters());
  loadMoreBtn.addEventListener('click', () => renderFileBatch(false));

  toggleGroupBtn.addEventListener('click', () => {
    groupByFolder = !groupByFolder;
    toggleGroupBtn.setAttribute('aria-pressed', groupByFolder ? 'true' : 'false');
    renderFileBatch(true);
    syncUrlState('tab-btn-files');
  });

  clearSubpathBtn.addEventListener('click', () => {
    activeSubpath = '';
    applyFileFilters();
  });

  quickChips.forEach((ch) => {
    ch.addEventListener('click', () => {
      const val = ch.dataset.quickCat;
      filterCat.value = filterCat.value === val ? '' : val;
      applyFileFilters();
    });
  });

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterYear.value = '';
    updateCourseOptions();
    filterCourse.value = '';
    updateProfOptions();
    filterProf.value = '';
    filterCat.value = '';
    sortSelect.value = 'relevance';
    activeSubpath = '';
    applyFileFilters();
  });

  document.getElementById('copy-search-link-btn').addEventListener('click', () => {
    syncUrlState('tab-btn-files');
    copyText(location.href, 'Link diretto a questa ricerca copiato');
  });

  // Recent Searches in localStorage
  const RECENT_SEARCHES_KEY = 'unina_recent_searches';
  const getRecentSearches = () => {
    try {
      const arr = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
      return Array.isArray(arr) ? arr.slice(0, 6) : [];
    } catch {
      return [];
    }
  };
  const saveRecentSearch = (q) => {
    const clean = String(q || '').trim();
    if (clean.length < 2) return;
    try {
      const prev = getRecentSearches().filter((x) => x.toLowerCase() !== clean.toLowerCase());
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([clean, ...prev].slice(0, 6)));
    } catch {}
  };

  // Render Pinned Courses or Upcoming Exam Dates on Home (zero CLS!)
  const homePinnedSection = document.getElementById('home-pinned-section');
  const homePinnedGrid = document.getElementById('home-pinned-grid');
  const homePinnedTitle = document.getElementById('home-pinned-title');
  const homePinnedBadge = document.getElementById('home-pinned-badge');
  const renderPinnedHome = () => {
    if (!homePinnedGrid) return;
    if (homePinnedSection) homePinnedSection.hidden = false;
    const list = DATA.courses.filter((c) => pinnedCourses.has(c.name));
    homePinnedGrid.innerHTML = '';

    if (list.length > 0) {
      if (homePinnedTitle) homePinnedTitle.textContent = 'I miei corsi fissati';
      if (homePinnedBadge) homePinnedBadge.textContent = `${list.length} ${list.length === 1 ? 'salvato' : 'salvati'}`;
      list.slice(0, 6).forEach((c) => {
        const card = document.createElement('article');
        card.className = 'pinned-card is-course-pin';
        card.innerHTML = `
          <div>
            <div class="pinned-card-head">
              <span class="action-badge is-new">${escapeHtml(c.yearGroup)}</span>
              <button type="button" class="pinned-unpin-btn" aria-label="Rimuovi ${escapeHtml(c.name)} dai corsi fissati" title="Rimuovi dai corsi fissati">${SVG_ICONS.starFilled}</button>
            </div>
            <h4>${escapeHtml(c.name)}</h4>
            <div class="pinned-meta">${escapeHtml(c.semester)} sem • ${escapeHtml(c.cfu)} CFU • ${c.fileCount} file</div>
          </div>
          <div class="pinned-card-actions">
            <button type="button" class="btn btn-primary" data-pin-files>File (${c.fileCount})</button>
            <button type="button" class="btn" data-pin-info>Scheda</button>
          </div>
        `;
        card.querySelector('.pinned-unpin-btn').addEventListener('click', () => togglePinCourse(c.name));
        card.querySelector('[data-pin-files]').addEventListener('click', () => {
          openCatalog('tab-btn-files');
          filterYear.value = c.yearGroup;
          updateCourseOptions();
          filterCourse.value = c.name;
          updateProfOptions();
          applyFileFilters();
        });
        card.querySelector('[data-pin-info]').addEventListener('click', () => openCourseModal(c));
        homePinnedGrid.appendChild(card);
      });
      return;
    }

    // Fallback: mostra i prossimi 6 appelli d'esame ufficiali DIETI
    if (homePinnedTitle) homePinnedTitle.textContent = 'Prossimi appelli in sessione';
    if (homePinnedBadge) homePinnedBadge.textContent = 'Sessione DIETI';
    const nowD = new Date();
    const isoNow = `${nowD.getFullYear()}-${String(nowD.getMonth() + 1).padStart(2, '0')}-${String(nowD.getDate()).padStart(2, '0')}`;
    const upcoming = [];
    ((DATA.examCalendar && DATA.examCalendar.entries) || []).forEach((e) => {
      if (e.regolamento === 'Vecchio Regolamento') return;
      (e.dates || []).forEach((d) => {
        if (d.iso >= isoNow) upcoming.push({ entry: e, date: d });
      });
    });
    upcoming.sort((a, b) => a.date.iso.localeCompare(b.date.iso));
    upcoming.slice(0, 6).forEach(({ entry, date }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pinned-card';
      btn.innerHTML = `
        <div class="pinned-card-head">
          <span class="action-badge is-new">${escapeHtml(date.display)}</span>
          <span>${escapeHtml(entry.channel || entry.yearGroup)}</span>
        </div>
        <h4>${escapeHtml(entry.course)}</h4>
        <div class="pinned-meta">${escapeHtml(entry.prof || entry.yearGroup)}</div>
      `;
      btn.addEventListener('click', () => {
        openCatalog('tab-btn-calendar');
        if (calSearch) calSearch.value = entry.course;
        if (typeof renderCalendar === 'function') renderCalendar();
      });
      homePinnedGrid.appendChild(btn);
    });
  };

  // Render Recent Updates on Home (top 6 items, zero CLS)
  const homeRecentSection = document.getElementById('home-recent-section');
  const homeRecentGrid = document.getElementById('home-recent-grid');
  if (homeRecentGrid && Array.isArray(DATA.recentUpdates)) {
    if (homeRecentSection) homeRecentSection.hidden = false;
    DATA.recentUpdates.slice(0, 6).forEach((u) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'recent-card';
      const catLbl = CAT_LABELS[u.cat] || u.cat;
      const actLbl = u.action || '';
      const shortDate = String(u.date || '').replace(/^(\d{2}\/\d{2})\/20(\d{2})$/, '$1/$2');
      btn.innerHTML = `
        <div class="recent-top">
          <span class="recent-badges">
            ${actLbl ? `<span class="action-badge ${actLbl === 'Nuovo' ? 'is-new' : ''}">${escapeHtml(actLbl)}</span>` : ''}
            <span class="cat-tag">${escapeHtml(catLbl)}</span>
          </span>
          <span>${escapeHtml(shortDate)}</span>
        </div>
        <div class="recent-title" title="${escapeHtml(u.label)}">${escapeHtml(u.label)}</div>
        <div class="recent-sub" title="${escapeHtml(u.course + ' • ' + u.prof)}">${escapeHtml(u.course)}${u.prof ? ' • ' + escapeHtml(u.prof) : ''}</div>
      `;
      btn.addEventListener('click', () => {
        openCatalog('tab-btn-files');
        searchInput.value = '';
        filterYear.value = u.yearGroup;
        updateCourseOptions();
        filterCourse.value = u.course;
        updateProfOptions();
        filterProf.value = u.prof;
        filterCat.value = u.cat;
        activeSubpath = u.subpath || '';
        applyFileFilters();
      });
      homeRecentGrid.appendChild(btn);
    });
  }

  // Protagonist Search on Home + Live Suggestions + Quick Acronym Chips
  const homeSearchInput = document.getElementById('home-search-input');
  const homeSearchSubmit = document.getElementById('home-search-submit');
  const homeSuggestionsEl = document.getElementById('home-search-suggestions');

  const executeHomeSearch = (queryStr) => {
    const q = String(queryStr !== undefined ? queryStr : (homeSearchInput ? homeSearchInput.value : '')).trim();
    if (q) saveRecentSearch(q);
    if (homeSuggestionsEl) homeSuggestionsEl.hidden = true;
    openCatalog('tab-btn-files');
    searchInput.value = q;
    filterYear.value = '';
    updateCourseOptions();
    filterCourse.value = '';
    updateProfOptions();
    filterProf.value = '';
    filterCat.value = '';
    activeSubpath = '';
    applyFileFilters();
    searchInput.focus();
  };

  const renderHomeSuggestions = () => {
    if (!homeSuggestionsEl || !homeSearchInput) return;
    const raw = homeSearchInput.value.trim();
    const q = normText(raw);
    homeSuggestionsEl.innerHTML = '';

    if (!q) {
      const recents = getRecentSearches();
      if (!recents.length) {
        homeSuggestionsEl.hidden = true;
        return;
      }
      recents.forEach((r) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sugg-item';
        btn.innerHTML = `<span>${SVG_ICONS.clock} ${escapeHtml(r)}</span><span class="sugg-meta">Ricerca recente</span>`;
        btn.addEventListener('click', () => executeHomeSearch(r));
        homeSuggestionsEl.appendChild(btn);
      });
      homeSuggestionsEl.hidden = false;
      return;
    }

    const matchedCourses = DATA.courses.filter((c) => c.searchBlob.includes(q)).slice(0, 3);
    const matchedFiles = DATA.files.filter((f) => f.searchBlob.includes(q)).slice(0, 4);
    if (!matchedCourses.length && !matchedFiles.length) {
      homeSuggestionsEl.hidden = true;
      return;
    }

    matchedCourses.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sugg-item';
      btn.innerHTML = `<span>${SVG_ICONS.book} <strong>${escapeHtml(c.name)}</strong></span><span class="sugg-meta">${c.fileCount} file • ${escapeHtml(c.yearGroup)}</span>`;
      btn.addEventListener('click', () => {
        saveRecentSearch(c.name);
        homeSuggestionsEl.hidden = true;
        openCatalog('tab-btn-files');
        filterYear.value = c.yearGroup;
        updateCourseOptions();
        filterCourse.value = c.name;
        updateProfOptions();
        applyFileFilters();
      });
      homeSuggestionsEl.appendChild(btn);
    });

    matchedFiles.forEach((f) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sugg-item';
      btn.innerHTML = `<span>${SVG_ICONS.fileText} ${escapeHtml(f.name)}</span><span class="sugg-meta">${escapeHtml(f.course)}</span>`;
      btn.addEventListener('click', () => {
        saveRecentSearch(raw);
        homeSuggestionsEl.hidden = true;
        openCatalog('tab-btn-files');
        searchInput.value = f.name;
        applyFileFilters();
      });
      homeSuggestionsEl.appendChild(btn);
    });
    homeSuggestionsEl.hidden = false;
  };

  if (homeSearchInput) {
    homeSearchInput.addEventListener('input', renderHomeSuggestions);
    homeSearchInput.addEventListener('focus', renderHomeSuggestions);
    homeSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeHomeSearch();
      } else if (e.key === 'Escape' && homeSuggestionsEl) {
        homeSuggestionsEl.hidden = true;
      }
    });
  }
  document.addEventListener('click', (e) => {
    if (homeSuggestionsEl && !e.target.closest('#home-search-form')) {
      homeSuggestionsEl.hidden = true;
    }
  });
  homeSearchSubmit?.addEventListener('click', () => executeHomeSearch());

  document.querySelectorAll('[data-home-quick-q]').forEach((chip) => {
    chip.addEventListener('click', () => executeHomeSearch(chip.dataset.homeQuickQ));
  });

  document.getElementById('home-open-catalog-btn')?.addEventListener('click', () => {
    openCatalog('tab-btn-files');
  });
  document.getElementById('home-updates-open-files')?.addEventListener('click', () => {
    openCatalog('tab-btn-files');
  });
  document.getElementById('home-updates-open-calendar')?.addEventListener('click', () => {
    openCatalog('tab-btn-calendar');
  });
  document.getElementById('home-open-courses-btn')?.addEventListener('click', () => {
    openCatalog('tab-btn-courses');
  });
  document.getElementById('home-open-calendar-btn')?.addEventListener('click', () => {
    openCatalog('tab-btn-calendar');
  });
  document.getElementById('home-open-hub-btn')?.addEventListener('click', () => {
    openCatalog('tab-btn-hub');
  });
  document.querySelectorAll('[data-home-year-files]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openCatalog('tab-btn-files');
      filterYear.value = btn.dataset.homeYearFiles;
      updateCourseOptions();
      filterCourse.value = '';
      updateProfOptions();
      filterProf.value = '';
      activeSubpath = '';
      applyFileFilters();
    });
  });

  // Command Palette Controller (Ctrl/Cmd + K)
  const cmdModal = document.getElementById('cmd-modal');
  const cmdSearchInput = document.getElementById('cmd-search-input');
  const cmdResultsList = document.getElementById('cmd-results-list');
  let cmdActiveIdx = 0;

  const getCommunityActions = () => {
    const acYr = (DATA.examCalendar && DATA.examCalendar.academicYear) || '2026/2027';
    return [
      {
        title: 'Segnala o invia codice Teams',
        meta: 'GitHub Issue',
        icon: SVG_ICONS.plus,
        href: `${REPO_URL}/issues/new?template=codice_teams.yml`,
        keywords: 'teams codice segnala invia canale microsoft',
        featured: true
      },
      {
        title: 'Invia o richiedi appunti / traccia',
        meta: 'Contribuisci',
        icon: SVG_ICONS.fileText,
        href: `${REPO_URL}/issues/new?template=richiesta_o_materiale.yml`,
        keywords: 'invia richiedi appunti traccia materiale esame',
        featured: true
      },
      {
        title: 'Invia traccia progetto',
        meta: 'Contribuisci',
        icon: SVG_ICONS.code,
        href: `${REPO_URL}/issues/new?template=traccia_progetto.yml`,
        keywords: 'traccia progetto invia consegna',
        featured: false
      },
      {
        title: 'Segnala problema calendario esami',
        meta: 'Calendario DIETI',
        icon: SVG_ICONS.calendar,
        href: `${REPO_URL}/issues/new?template=problema_calendario.yml`,
        keywords: 'calendario appello appelli data date dieti mancante errato canale',
        featured: true
      },
      {
        title: 'Stato sito CdL DIETI (Online / Manutenzione / Down)',
        meta: 'Monitor live',
        icon: SVG_ICONS.alertCircle,
        onRun: () => openStatusModal(),
        keywords: 'stato status dieti sito online down manutenzione lento server',
        featured: false
      },
      {
        title: 'Segnala bug o errore',
        meta: 'Segnalazione',
        icon: SVG_ICONS.externalLink,
        href: `${REPO_URL}/issues/new?template=segnalazione_errore.yml`,
        keywords: 'bug errore segnala problema link rotto',
        featured: true
      },
      {
        title: `Scarica orario lezioni (${acYr})`,
        meta: 'PDF ufficiale',
        icon: SVG_ICONS.calendar,
        href: `${REPO_URL}/raw/master/info-generali/Orario%20Lezioni%202026-2027.pdf`,
        keywords: 'orario lezioni pdf aule semestre',
        featured: false
      },
      {
        title: 'Gruppi Telegram studenti',
        meta: 'Community',
        icon: SVG_ICONS.send,
        href: 'https://t.me/+7HOZaOMbgSphNGM0',
        keywords: 'telegram gruppi chat studenti community',
        featured: true
      },
      {
        title: 'Repository GitHub UNINA-INFORMATICA',
        meta: 'GitHub',
        icon: SVG_ICONS.github,
        href: REPO_URL,
        keywords: 'github repository repo sorgente codice',
        featured: false
      }
    ];
  };

  const renderCmdResults = () => {
    if (!cmdResultsList) return;
    const raw = cmdSearchInput ? cmdSearchInput.value.trim() : '';
    const q = normText(raw);
    cmdResultsList.innerHTML = '';
    const items = [];
    const communityActions = getCommunityActions();

    const addGroup = (label) => {
      const g = document.createElement('div');
      g.className = 'cmd-group-label';
      g.textContent = label;
      cmdResultsList.appendChild(g);
    };
    const addItem = (titleHtml, metaText, onSelect, navigates = true) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cmd-item';
      btn.setAttribute('role', 'option');
      btn.innerHTML = `<span>${titleHtml}</span><span class="sugg-meta">${escapeHtml(metaText)}</span>`;
      btn.addEventListener('click', () => {
        if (raw) saveRecentSearch(raw);
        if (navigates) closeDialogForNavigation(cmdModal);
        else cmdModal?.close();
        onSelect();
      });
      cmdResultsList.appendChild(btn);
      items.push(btn);
    };

    if (!q) {
      const recents = getRecentSearches();
      if (recents.length) {
        addGroup('Ricerche recenti');
        recents.forEach((r) => {
          addItem(`${SVG_ICONS.clock} ${escapeHtml(r)}`, 'Cerca nel catalogo', () => executeHomeSearch(r));
        });
      }
      addGroup('Navigazione rapida');
      addItem(`${SVG_ICONS.search} Esplora catalogo completo (${DATA.files.length} file)`, 'Catalogo', () => openCatalog('tab-btn-files'));
      addItem(`${SVG_ICONS.calendar} Calendario appelli d'esame DIETI`, 'Calendario', () => openCatalog('tab-btn-calendar'));
      addItem(`${SVG_ICONS.book} Insegnamenti, propedeuticità e codici Teams`, `${DATA.courses.length} corsi`, () => openCatalog('tab-btn-courses'));
      addItem(`${SVG_ICONS.map} Mappe Monte Sant'Angelo, Via Claudio e Clone Git`, 'Mappe e Git', () => openCatalog('tab-btn-hub'));
      addItem(`${SVG_ICONS.star} Cambia tema Chiaro / Scuro`, 'Aspetto', () => applyThemeSwitch(), false);
      addGroup('Contribuisci e community');
      communityActions.filter((a) => a.featured).forEach((a) => {
        const runAction = a.onRun || (() => window.open(a.href, '_blank', 'noopener,noreferrer'));
        addItem(`${a.icon} ${escapeHtml(a.title)}`, a.meta, runAction, Boolean(a.onRun));
      });
    } else {
      const mCourses = DATA.courses.filter((c) => c.searchBlob.includes(q)).slice(0, 4);
      if (mCourses.length) {
        addGroup('Insegnamenti e Teams');
        mCourses.forEach((c) => {
          addItem(`${SVG_ICONS.book} <strong>${escapeHtml(c.name)}</strong>`, `${c.fileCount} file • ${c.yearGroup}`, () => {
            openCatalog('tab-btn-files');
            filterYear.value = c.yearGroup;
            updateCourseOptions();
            filterCourse.value = c.name;
            updateProfOptions();
            applyFileFilters();
          });
        });
      }
      const mExams = ((DATA.examCalendar && DATA.examCalendar.entries) || [])
        .filter((e) => normText(`${e.course} ${e.aliases || ''} ${e.prof} ${e.channel}`).includes(q))
        .slice(0, 3);
      if (mExams.length) {
        addGroup('Calendario esami DIETI');
        mExams.forEach((e) => {
          addItem(`${SVG_ICONS.calendar} ${escapeHtml(e.course)}${e.channel ? ' · ' + escapeHtml(e.channel) : ''}`, e.prof || e.yearGroup, () => {
            openCatalog('tab-btn-calendar');
            if (calSearch) calSearch.value = e.course;
            if (typeof renderCalendar === 'function') renderCalendar();
          });
        });
      }
      const mFiles = DATA.files.filter((f) => f.searchBlob.includes(q)).slice(0, 5);
      if (mFiles.length) {
        addGroup('Documenti e tracce');
        mFiles.forEach((f) => {
          addItem(`${SVG_ICONS.fileText} ${escapeHtml(f.name)}`, `${f.course} • ${fmtBytes(f.size)}`, () => {
            openCatalog('tab-btn-files');
            searchInput.value = f.name;
            applyFileFilters();
          });
        });
      }
      const qTokens = q.split(/\s+/).filter(Boolean);
      const mActions = communityActions.filter((a) => {
        const hay = normText(`${a.title} ${a.keywords}`);
        return qTokens.every((tk) => hay.includes(tk));
      }).slice(0, 4);
      if (mActions.length) {
        addGroup('Azioni e community');
        mActions.forEach((a) => {
          const runAction = a.onRun || (() => window.open(a.href, '_blank', 'noopener,noreferrer'));
          addItem(`${a.icon} ${escapeHtml(a.title)}`, a.meta, runAction, Boolean(a.onRun));
        });
      }
    }

    cmdActiveIdx = 0;
    items.forEach((el, idx) => el.classList.toggle('is-active', idx === cmdActiveIdx));
  };

  const openCommandPalette = () => {
    if (!cmdModal) return;
    if (cmdSearchInput) cmdSearchInput.value = '';
    renderCmdResults();
    openDialogWithHistory(cmdModal);
    setTimeout(() => cmdSearchInput?.focus(), 30);
  };

  document.querySelectorAll('[data-open-cmd]').forEach((btn) => {
    btn.addEventListener('click', openCommandPalette);
  });
  cmdSearchInput?.addEventListener('input', renderCmdResults);
  cmdSearchInput?.addEventListener('keydown', (e) => {
    const opts = [...(cmdResultsList?.querySelectorAll('.cmd-item') || [])];
    if (!opts.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cmdActiveIdx = (cmdActiveIdx + 1) % opts.length;
      opts.forEach((el, i) => el.classList.toggle('is-active', i === cmdActiveIdx));
      opts[cmdActiveIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cmdActiveIdx = (cmdActiveIdx - 1 + opts.length) % opts.length;
      opts.forEach((el, i) => el.classList.toggle('is-active', i === cmdActiveIdx));
      opts[cmdActiveIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      opts[cmdActiveIdx]?.click();
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal?.open) cmdModal.close();
      else openCommandPalette();
    }
  });

  // Hydrate exact course & file counts and dynamic course pills in Home Section 2 Bento
  const HOME_SHORT_LABELS = {
    'Architettura degli Elaboratori': 'ADE',
    'Analisi Matematica 1': 'Analisi 1',
    'Programmazione Object Oriented': 'POO',
    'Analisi e Progettazione di Strutture Dati': 'APSD',
    'Elementi di Informatica Teorica': 'Informatica Teorica',
    'Fisica Generale 1': 'Fisica 1',
    'Analisi e Progettazione di Algoritmi': 'Algoritmi (APA)',
    'Linguaggi di Programmazione 1': 'Linguaggi Prog. 1 (LP1)',
    'Metodi Statistici per l\'Informazione': 'Metodi Statistici (MSI)',
    'Reti e Programmazione Distribuita': 'Reti (RPD)',
    'Tecniche di Programmazione Avanzata': 'TPA',
    'Economia e Organizzazione Aziendale': 'Economia',
    'Multimedia Information Systems': 'Multimedia',
    'Operating Systems for Mobile, Cloud and IoT': 'OSMCI',
    'Parallel and Distributed Computing': 'PDC',
    'Logics for Computer Science': 'Logics (LCS)',
    'Istituzioni di Matematica II': 'Ist. Matematica II'
  };
  const yearFileCounts = new Map();
  const yearCourseLists = new Map();
  DATA.files.forEach((f) => {
    yearFileCounts.set(f.yearGroup, (yearFileCounts.get(f.yearGroup) || 0) + 1);
  });
  DATA.courses.forEach((c) => {
    if (!yearCourseLists.has(c.yearGroup)) yearCourseLists.set(c.yearGroup, []);
    yearCourseLists.get(c.yearGroup).push(c);
  });
  document.querySelectorAll('[data-year-stat]').forEach((el) => {
    const yg = el.dataset.yearStat;
    const fCnt = yearFileCounts.get(yg) || 0;
    const cCnt = (yearCourseLists.get(yg) || []).length;
    el.textContent = `${cCnt} corsi · ${fCnt} file`;
  });
  // Populate dynamic counts in #course-year-filter
  const courseYearFilterInit = document.getElementById('course-year-filter');
  if (courseYearFilterInit) {
    const baseLabels = {
      '': 'Tutti i corsi',
      'Primo Anno': 'Primo anno',
      'Secondo Anno': 'Secondo anno',
      'Terzo Anno': 'Terzo anno',
      'Esami a Scelta': 'Esami a scelta'
    };
    [...courseYearFilterInit.options].forEach((opt) => {
      const cnt = opt.value ? (yearCourseLists.get(opt.value) || []).length : DATA.courses.length;
      const lbl = baseLabels[opt.value] || opt.textContent;
      opt.textContent = `${lbl} (${cnt})`;
    });
  }
  // Populate dynamic academic year spans where available from examCalendar
  if (DATA.examCalendar && DATA.examCalendar.academicYear) {
    document.querySelectorAll('[data-academic-year]').forEach((el) => {
      el.textContent = DATA.examCalendar.academicYear;
    });
  }

  // Multi-OS Git Selective Clone Command Builder (Bash/macOS/Linux, PowerShell, CMD)
  let currentGitOs = 'bash';
  const buildGitCloneCmd = (relPath, osType = currentGitOs) => {
    if (osType === 'ps') {
      return `git lfs install\n$env:GIT_LFS_SKIP_SMUDGE="1"; git clone ${REPO_URL}.git\ncd UNINA-INFORMATICA\ngit lfs pull --include="${relPath}/**"`;
    }
    if (osType === 'cmd') {
      return `git lfs install\nset GIT_LFS_SKIP_SMUDGE=1 && git clone ${REPO_URL}.git\ncd UNINA-INFORMATICA\ngit lfs pull --include="${relPath}/**"`;
    }
    return `git lfs install\nGIT_LFS_SKIP_SMUDGE=1 git clone ${REPO_URL}.git\ncd UNINA-INFORMATICA\ngit lfs pull --include="${relPath}/**"`;
  };

  // Render Courses Grid
  const coursesGrid = document.getElementById('courses-grid');
  const courseSearch = document.getElementById('course-search');
  const courseYearFilter = document.getElementById('course-year-filter');
  const courseModal = document.getElementById('course-modal');

  document.querySelectorAll('[data-home-year-courses]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openCatalog('tab-btn-courses');
      courseYearFilter.value = btn.dataset.homeYearCourses;
      renderCourses();
    });
  });

  const getStatusSvg = (c) => {
    if (c.fileCount >= 15) return `${SVG_ICONS.checkCircle} <span>Materiale ricco</span>`;
    if (c.fileCount >= 1) return `${SVG_ICONS.clock} <span>Materiale presente</span>`;
    return `${SVG_ICONS.circle} <span>Da popolare</span>`;
  };

  const openCourseModal = (c) => {
    document.getElementById('course-modal-title').textContent = c.name;
    document.getElementById('course-modal-sub').textContent = `${c.titleEn} • ${c.yearGroup} (${c.semester} semestre) • ${c.cfu} crediti • Settore ${c.ssd.toLowerCase()}`;
    const renderModalClone = () => {
      const cloneCmd = buildGitCloneCmd(c.relPath, currentGitOs);
      const cmdBox = document.getElementById('modal-clone-box');
      if (cmdBox) cmdBox.textContent = cloneCmd;
      document.querySelectorAll('[data-modal-git-os]').forEach((b) => {
        b.setAttribute('aria-pressed', b.dataset.modalGitOs === currentGitOs ? 'true' : 'false');
      });
      const copyBtn = document.getElementById('modal-copy-clone');
      if (copyBtn) copyBtn.onclick = () => copyText(cloneCmd, 'Comandi Git copiati');
    };
    document.getElementById('course-modal-body').innerHTML = `
      <p style="margin:0 0 8px;"><strong>Propedeuticità:</strong> ${escapeHtml(c.propedeuticita)}</p>
      <p style="margin:0 0 8px;"><strong>Modalità d'esame:</strong> ${escapeHtml(c.modalita)}</p>
      <p style="margin:0 0 16px;"><strong>Obiettivi formativi:</strong><br><span style="color:var(--muted);font-size:0.875rem;">${escapeHtml(c.obiettivi)}</span></p>
      <h3 style="font-size:0.9375rem;margin:0 0 8px;">Clone selettivo solo per questo corso</h3>
      <div class="os-switch-row" role="group" aria-label="Sistema operativo per i comandi Git">
        <button type="button" class="os-btn" data-modal-git-os="bash" aria-pressed="${currentGitOs === 'bash' ? 'true' : 'false'}"><span class="lbl-full">Linux / macOS / Git Bash</span><span class="lbl-short">Linux / macOS</span></button>
        <button type="button" class="os-btn" data-modal-git-os="ps" aria-pressed="${currentGitOs === 'ps' ? 'true' : 'false'}">PowerShell</button>
        <button type="button" class="os-btn" data-modal-git-os="cmd" aria-pressed="${currentGitOs === 'cmd' ? 'true' : 'false'}">Windows CMD</button>
      </div>
      <div class="code-box" id="modal-clone-box"></div>
      <div class="modal-actions-grid">
        <button type="button" class="btn btn-primary" id="modal-copy-clone">${SVG_ICONS.copy} Copia comandi</button>
        <a class="btn" href="${REPO_URL}/tree/master/${c.urlPath}" target="_blank" rel="noopener">${SVG_ICONS.folder} Apri GitHub</a>
        <button type="button" class="btn" id="modal-filter-files">${SVG_ICONS.search} File (${c.fileCount})</button>
        <button type="button" class="btn" id="modal-jump-calendar">${SVG_ICONS.calendar} Appelli esame</button>
      </div>
    `;
    document.querySelectorAll('[data-modal-git-os]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentGitOs = btn.dataset.modalGitOs;
        updateCloneBox();
        renderModalClone();
      });
    });
    renderModalClone();
    document.getElementById('modal-filter-files').onclick = () => {
      closeDialogForNavigation(courseModal);
      openCatalog('tab-btn-files');
      filterYear.value = c.yearGroup;
      updateCourseOptions();
      filterCourse.value = c.name;
      updateProfOptions();
      applyFileFilters();
    };
    document.getElementById('modal-jump-calendar').onclick = () => {
      closeDialogForNavigation(courseModal);
      openCatalog('tab-btn-calendar');
      if (calSearch) calSearch.value = c.name;
      if (typeof renderCalendar === 'function') renderCalendar();
    };
    openDialogWithHistory(courseModal);
  };

  // Populate dynamic Home Bento course pills (opens filtered files when >0, or course modal directly when 0 to avoid dead ends)
  document.querySelectorAll('[data-year-pills]').forEach((container) => {
    const yg = container.dataset.yearPills;
    const list = (yearCourseLists.get(yg) || []).slice().sort((a, b) => {
      if ((b.fileCount > 0) !== (a.fileCount > 0)) return b.fileCount > 0 ? 1 : -1;
      return a.name.localeCompare(b.name, 'it');
    });
    container.innerHTML = '';
    list.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `year-course-pill${c.fileCount === 0 ? ' is-empty' : ''}`;
      const shortLbl = HOME_SHORT_LABELS[c.name] || c.name;
      btn.innerHTML = c.fileCount > 0
        ? `<span>${escapeHtml(shortLbl)}</span>`
        : `<span>${escapeHtml(shortLbl)}</span><span class="year-pill-tag">scheda</span>`;
      btn.title = c.fileCount > 0
        ? `${c.name} (${c.fileCount} file)`
        : `${c.name} — Apri scheda corso, Teams e appelli`;
      btn.addEventListener('click', () => {
        if (c.fileCount > 0) {
          openCatalog('tab-btn-files');
          filterYear.value = c.yearGroup;
          updateCourseOptions();
          filterCourse.value = c.name;
          updateProfOptions();
          filterProf.value = '';
          activeSubpath = '';
          applyFileFilters();
        } else {
          openCourseModal(c);
        }
      });
      container.appendChild(btn);
    });
  });

  const coursePinnedChip = document.getElementById('course-pinned-chip');
  const renderCourses = () => {
    const q = normText(courseSearch.value.trim());
    const yr = courseYearFilter.value;
    if (coursePinnedChip) {
      coursePinnedChip.setAttribute('aria-pressed', coursePinnedOnly ? 'true' : 'false');
    }
    coursesGrid.innerHTML = '';
    const list = DATA.courses.filter((c) => {
      if (coursePinnedOnly && !pinnedCourses.has(c.name)) return false;
      if (yr && c.yearGroup !== yr) return false;
      if (q && !c.searchBlob.includes(q)) return false;
      return true;
    });

    if (list.length === 0) {
      coursesGrid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1;">
          <h2>${coursePinnedOnly ? 'Nessun corso salvato nei Preferiti' : 'Nessun insegnamento trovato'}</h2>
          <p>${coursePinnedOnly
            ? 'Tocca la stellina su qualsiasi insegnamento per salvarlo nei tuoi Preferiti e ritrovarlo rapidamente qui e in Home.'
            : 'Prova a cercare con una sigla diversa (es. ADE, APSD, APA, BD) o azzera il filtro per anno.'}</p>
          <div class="empty-state-actions">
            <button type="button" class="btn btn-primary" id="courses-empty-reset">Mostra tutti i ${DATA.courses.length} corsi</button>
          </div>
        </div>
      `;
      document.getElementById('courses-empty-reset')?.addEventListener('click', () => {
        coursePinnedOnly = false;
        courseSearch.value = '';
        courseYearFilter.value = '';
        renderCourses();
      });
      return;
    }

    list.forEach((c, idx) => {
      const card = document.createElement('article');
      const isPinned = pinnedCourses.has(c.name);
      card.className = `${idx >= 9 ? 'course-card deferred-course' : 'course-card'}${isPinned ? ' is-pinned' : ''}`;
      const profHtml = c.profs.map((p) => {
        let teamsEl = '';
        if (isSafeHttpsUrl(p.teamsUrl)) {
          teamsEl = `<a class="teams-chip has-code" href="${escapeHtml(p.teamsUrl.trim())}" target="_blank" rel="noopener">${SVG_ICONS.link} Link Teams</a>`;
        } else if (p.teamsCode) {
          teamsEl = `<button type="button" class="teams-chip has-code" data-copy-teams="${escapeHtml(p.teamsCode)}" title="Tocca per copiare il codice Microsoft Teams">${SVG_ICONS.copy} ${escapeHtml(p.teamsCode)}</button>`;
        } else {
          const issueHref = `${REPO_URL}/issues/new?template=codice_teams.yml&title=${encodeURIComponent('[Teams 26/27] ' + c.name + ' - ' + p.display)}`;
          teamsEl = `<a class="teams-chip missing-code" href="${issueHref}" target="_blank" rel="noopener" title="Segnala il codice Teams di questo canale">${SVG_ICONS.plus} Codice Teams</a>`;
        }
        return `
          <div class="prof-item">
            <a class="prof-link" href="${REPO_URL}/tree/master/${p.urlPath}" target="_blank" rel="noopener" title="${escapeHtml(p.display)} (${p.fileCount} file)">${escapeHtml(p.display)} (${p.fileCount})</a>
            ${teamsEl}
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div>
          <div class="course-head">
            <h2 class="course-title"><a href="${REPO_URL}/tree/master/${c.urlPath}" target="_blank" rel="noopener">${escapeHtml(c.name)}</a></h2>
            <button type="button" class="pin-btn" aria-pressed="${isPinned ? 'true' : 'false'}" aria-label="${isPinned ? 'Rimuovi ' + escapeHtml(c.name) + ' dai corsi fissati' : 'Fissa ' + escapeHtml(c.name) + ' in Home'}" title="${isPinned ? 'Rimuovi dai corsi fissati in Home' : 'Fissa questo corso in Home'}">
              ${isPinned ? SVG_ICONS.starFilled : SVG_ICONS.star}
            </button>
          </div>
          <div class="course-meta-row">
            <span class="meta-tag is-year">${escapeHtml(c.yearGroup)} • ${escapeHtml(c.semester)} sem</span>
            <span class="course-status" title="Copertura materiale">${getStatusSvg(c)}</span>
            <span class="meta-tag">${escapeHtml(c.cfu)} CFU</span>
            <span class="meta-tag">${escapeHtml(c.ssd.toLowerCase())}</span>
            <span class="meta-tag">${c.fileCount} file</span>
          </div>
          <div class="course-prop"><strong>Propedeuticità:</strong> ${escapeHtml(c.propedeuticita)}</div>
        </div>
        <div class="prof-list">${profHtml}</div>
        <div class="course-actions">
          <button type="button" class="btn btn-primary" data-jump-files="${escapeHtml(c.name)}" data-jump-year="${escapeHtml(c.yearGroup)}">${SVG_ICONS.folder} File (${c.fileCount})</button>
          <button type="button" class="btn" data-jump-calendar="${escapeHtml(c.name)}">${SVG_ICONS.calendar} Appelli</button>
          <button type="button" class="btn" data-open-course="${idx}">${SVG_ICONS.book} Scheda</button>
        </div>
      `;
      card.querySelector('.pin-btn').addEventListener('click', (ev) => {
        const btn = ev.currentTarget;
        btn.classList.add('just-pinned');
        togglePinCourse(c.name);
      });
      card.querySelector('[data-open-course]').addEventListener('click', () => openCourseModal(c));
      card.querySelector('[data-jump-files]').addEventListener('click', () => {
        openCatalog('tab-btn-files');
        filterYear.value = c.yearGroup;
        updateCourseOptions();
        filterCourse.value = c.name;
        updateProfOptions();
        applyFileFilters();
      });
      card.querySelector('[data-jump-calendar]').addEventListener('click', () => {
        openCatalog('tab-btn-calendar');
        if (calSearch) calSearch.value = c.name;
        if (calYearFilter) calYearFilter.value = '';
        if (calRegFilter) calRegFilter.value = 'all';
        if (typeof renderCalendar === 'function') renderCalendar();
      });
      card.querySelectorAll('[data-copy-teams]').forEach((btn) => {
        btn.addEventListener('click', () => {
          copyText(btn.dataset.copyTeams, `Codice Teams "${btn.dataset.copyTeams}" copiato`);
          btn.classList.add('is-copied');
          setTimeout(() => btn.classList.remove('is-copied'), 1200);
        });
      });
      coursesGrid.appendChild(card);
    });
  };
  courseSearch.addEventListener('input', renderCourses);
  courseYearFilter.addEventListener('change', renderCourses);
  coursePinnedChip?.addEventListener('click', () => {
    coursePinnedOnly = !coursePinnedOnly;
    renderCourses();
    syncShellNav(coursePinnedOnly ? 'favorites' : 'tab-btn-courses');
  });
  syncFavBadge();

  // Lazy-rendered Hub Tab (Maps, Selective Git Clone, Community Forms & Official Guides)
  const mapModal = document.getElementById('map-modal');
  const mapModalImg = document.getElementById('map-modal-img');
  const mapModalTitle = document.getElementById('map-modal-title');
  const mapOpenHighres = document.getElementById('map-open-highres');
  const mapZoomToggle = document.getElementById('map-zoom-toggle');
  const syncMapZoom = (zoomed) => {
    if (!mapModalImg) return;
    mapModalImg.classList.toggle('is-zoomed', zoomed);
    const lbl = mapZoomToggle?.querySelector('.btn-label');
    if (lbl) lbl.textContent = zoomed ? 'Adatta 1x' : 'Zoom 1.8x';
    else if (mapZoomToggle) mapZoomToggle.textContent = zoomed ? 'Adatta 1x' : 'Zoom 1.8x';
  };
  mapZoomToggle?.addEventListener('click', () => syncMapZoom(!mapModalImg.classList.contains('is-zoomed')));
  mapModalImg?.addEventListener('click', () => syncMapZoom(!mapModalImg.classList.contains('is-zoomed')));

  let cloneSelect = null;
  let cloneCmdBox = null;
  let osBtns = [];
  const updateCloneBox = () => {
    if (!cloneSelect || !cloneCmdBox) return;
    const p = cloneSelect.value;
    osBtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.gitOs === currentGitOs ? 'true' : 'false'));
    cloneCmdBox.textContent = buildGitCloneCmd(p, currentGitOs);
  };

  const renderHub = () => {
    const hubGrid = document.getElementById('hub-grid');
    if (!hubGrid || hubGrid.childElementCount > 0) return;
    const acYr = escapeHtml((DATA.examCalendar && DATA.examCalendar.academicYear) || '2026/2027');
    const zoomIcon = '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>';
    const uploadIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>';
    const chartIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>';
    const penIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
    const chatIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    const userPlusIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>';
    const bugIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>';

    hubGrid.innerHTML = `
      <article class="hub-card">
        <div>
          <h2>${SVG_ICONS.map} Mappa complesso Monte Sant'Angelo</h2>
          <p>Aule, edifici (Centri Comuni, Edificio 7) e servizi del campus di Monte Sant'Angelo.</p>
        </div>
        <picture><source srcset="./assets/MappaMSA.webp" type="image/webp"><img src="./assets/MappaMSA.jpg" width="1335" height="1400" alt="Mappa del complesso universitario di Monte Sant'Angelo" class="map-thumb" data-map-src="./assets/MappaMSA.webp" data-map-fallback="./assets/MappaMSA.jpg" data-map-title="Mappa complesso universitario di Monte Sant'Angelo" loading="lazy"></picture>
        <div>
          <button type="button" class="btn btn-primary" data-map-src="./assets/MappaMSA.webp" data-map-fallback="./assets/MappaMSA.jpg" data-map-title="Mappa complesso universitario di Monte Sant'Angelo">${zoomIcon} Ingrandisci mappa Monte Sant'Angelo</button>
        </div>
      </article>
      <article class="hub-card">
        <div>
          <h2>${SVG_ICONS.map} Mappa complesso di Via Claudio</h2>
          <p>Planimetria delle aule e strutture del complesso universitario di Via Claudio.</p>
        </div>
        <picture><source srcset="./assets/MappaViaClaudio.webp" type="image/webp"><img src="./assets/MappaViaClaudio.jpg" width="1400" height="1355" alt="Mappa del complesso universitario di Via Claudio" class="map-thumb" data-map-src="./assets/MappaViaClaudio.webp" data-map-fallback="./assets/MappaViaClaudio.jpg" data-map-title="Mappa complesso universitario di Via Claudio" loading="lazy"></picture>
        <div>
          <button type="button" class="btn btn-primary" data-map-src="./assets/MappaViaClaudio.webp" data-map-fallback="./assets/MappaViaClaudio.jpg" data-map-title="Mappa complesso universitario di Via Claudio">${zoomIcon} Ingrandisci mappa Via Claudio</button>
        </div>
      </article>
      <article class="hub-card">
        <div>
          <h2>${SVG_ICONS.terminal} Generatore comando clone selettivo</h2>
          <p>Scarica sul computer con Git <strong>solo un singolo corso</strong> senza clonare l'intero archivio.</p>
        </div>
        <div>
          <div class="os-switch-row" role="group" aria-label="Sistema operativo per i comandi Git">
            <button type="button" class="os-btn" data-git-os="bash" aria-pressed="true">Linux / macOS</button>
            <button type="button" class="os-btn" data-git-os="ps" aria-pressed="false">PowerShell</button>
            <button type="button" class="os-btn" data-git-os="cmd" aria-pressed="false">Windows CMD</button>
          </div>
          <select id="clone-course-select" class="filter-select" aria-label="Scegli il corso da clonare"></select>
        </div>
        <div class="code-box" id="clone-cmd-box"></div>
        <div>
          <button type="button" class="btn btn-primary" id="copy-clone-cmd">${SVG_ICONS.copy} Copia comandi Git</button>
        </div>
      </article>
      <article class="hub-card">
        <div>
          <h2>${SVG_ICONS.fileText} Moduli anonimi e community</h2>
          <p>Aiuta i prossimi studenti lasciando una valutazione anonima, condividendo domande orali o unendoti ai gruppi Telegram.</p>
        </div>
        <div class="stack-actions">
          <a class="btn btn-primary" href="https://forms.gle/seGUyzc2HiRxmpDs9" target="_blank" rel="noopener">${chartIcon} Valutazione corsi e docenti</a>
          <a class="btn" href="https://forms.gle/KFHXPqoKNj1LyCk67" target="_blank" rel="noopener">${penIcon} Valutazione qualità materiale</a>
          <a class="btn" href="https://docs.google.com/forms/d/e/1FAIpQLSfvGQmwT_MQWKN01Ru08KnlvdL-S65TlTPMx-NLvd9kYmX_Xg/viewform" target="_blank" rel="noopener">${chatIcon} Raccolta domande esami orali</a>
          <a class="btn" href="https://t.me/+7HOZaOMbgSphNGM0" target="_blank" rel="noopener">${SVG_ICONS.send} Gruppi Telegram studenti</a>
        </div>
      </article>
      <article class="hub-card">
        <div>
          <h2>${SVG_ICONS.book} Guide ufficiali e GitHub Student Pack</h2>
          <p>Orario lezioni, manifesto degli studi, vantaggi gratuiti con mail istituzionale e repository sorgente.</p>
        </div>
        <div class="stack-actions">
          <a class="btn btn-primary" href="${REPO_URL}/blob/master/info-generali/guida-github-education.md" target="_blank" rel="noopener">${SVG_ICONS.code} Guida GitHub Education (Copilot e JetBrains)</a>
          <a class="btn" href="${REPO_URL}/raw/master/info-generali/Orario%20Lezioni%202026-2027.pdf" target="_blank" rel="noopener">${SVG_ICONS.download} Scarica orario lezioni (${acYr})</a>
          <a class="btn" href="${REPO_URL}/raw/master/info-generali/GuidaTriennaleInformatica-26-27.pdf" target="_blank" rel="noopener">${SVG_ICONS.download} Scarica guida dello studente (${acYr})</a>
          <a class="btn" href="${REPO_URL}" target="_blank" rel="noopener">${SVG_ICONS.github} Repository GitHub UNINA-INFORMATICA</a>
        </div>
      </article>
      <article class="hub-card">
        <div>
          <h2>${userPlusIcon} Contribuisci e segnala</h2>
          <p>Manca una traccia scritta, una traccia di progetto, un codice Teams o hai trovato un bug?</p>
        </div>
        <div class="stack-actions">
          <a class="btn btn-primary" href="${REPO_URL}/issues/new?template=richiesta_o_materiale.yml" target="_blank" rel="noopener">${uploadIcon} Invia o richiedi una traccia o appunti</a>
          <a class="btn" href="${REPO_URL}/issues/new?template=codice_teams.yml" target="_blank" rel="noopener">${SVG_ICONS.plus} Invia o segnala codice Teams</a>
          <a class="btn" href="${REPO_URL}/issues/new?template=traccia_progetto.yml" target="_blank" rel="noopener">${SVG_ICONS.code} Invia traccia progetto</a>
          <a class="btn" href="${REPO_URL}/issues/new?template=problema_calendario.yml" target="_blank" rel="noopener">${SVG_ICONS.calendar} Segnala problema calendario esami</a>
          <a class="btn" href="${REPO_URL}/issues/new?template=segnalazione_errore.yml" target="_blank" rel="noopener">${bugIcon} Segnala bug o errore</a>
          <a class="btn" href="${REPO_URL}/discussions" target="_blank" rel="noopener">${chatIcon} Apri discussioni su GitHub</a>
        </div>
      </article>
    `;

    cloneSelect = document.getElementById('clone-course-select');
    cloneCmdBox = document.getElementById('clone-cmd-box');
    osBtns = [...hubGrid.querySelectorAll('[data-git-os]')];
    DATA.courses.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.relPath;
      opt.textContent = `${c.yearGroup} — ${c.name}`;
      cloneSelect.appendChild(opt);
    });
    osBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        currentGitOs = btn.dataset.gitOs;
        updateCloneBox();
      });
    });
    cloneSelect.addEventListener('change', updateCloneBox);
    updateCloneBox();
    document.getElementById('copy-clone-cmd')?.addEventListener('click', () => copyText(cloneCmdBox.textContent, 'Comandi Git copiati'));
    hubGrid.querySelectorAll('[data-map-src]').forEach((el) => {
      el.addEventListener('click', () => {
        mapModalTitle.textContent = el.dataset.mapTitle;
        const fallbackSrc = el.dataset.mapFallback || '';
        mapModalImg.onerror = fallbackSrc
          ? () => {
              mapModalImg.onerror = null;
              mapModalImg.src = fallbackSrc;
            }
          : null;
        mapModalImg.src = el.dataset.mapSrc;
        mapModalImg.alt = el.dataset.mapTitle;
        syncMapZoom(false);
        if (mapOpenHighres) mapOpenHighres.href = fallbackSrc || el.dataset.mapSrc;
        openDialogWithHistory(mapModal);
      });
    });
  };

  // Exam Calendar (Triennale DIETI Auto-Sync) Controller
  const CAL_DATA = DATA.examCalendar || { entries: [], months: [], totalDates: 0 };
  const CAL_MONTH_NAMES_IT = [
    '', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  const CAL_MONTH_SHORT_IT = [
    '', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
  ];
  const CAL_WEEKDAYS_IT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  const nowLocal = new Date();
  const todayIso = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
  const todayMidnight = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());

  const parseIsoDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const getWeekdayShort = (iso) => CAL_WEEKDAYS_IT[parseIsoDate(iso).getDay()] || '';
  const formatCountdown = (iso) => {
    const diff = Math.round((parseIsoDate(iso) - todayMidnight) / 86400000);
    if (diff === 0) return 'Oggi!';
    if (diff === 1) return 'Domani';
    if (diff > 1) return `Tra ${diff} giorni`;
    return 'Passato';
  };
  const getCountdownClass = (iso) => {
    const diff = Math.round((parseIsoDate(iso) - todayMidnight) / 86400000);
    if (diff < 0) return 'meta-tag';
    if (diff <= 7) return 'cal-countdown-tag is-urgent';
    if (diff <= 21) return 'cal-countdown-tag is-soon';
    return 'cal-countdown-tag';
  };

  // Populate source header and month options + horizontal month pills
  const calTitleEl = document.getElementById('cal-session-title');
  const calMetaEl = document.getElementById('cal-source-meta');
  const calPdfLinkEl = document.getElementById('cal-pdf-link');
  const calPageLinkEl = document.getElementById('cal-page-link');
  const calMonthPillsEl = document.getElementById('cal-month-pills');
  const calPinnedSpotlightEl = document.getElementById('cal-pinned-spotlight');
  const calSheetBackdrop = document.getElementById('cal-sheet-backdrop');
  const calSheetClose = document.getElementById('cal-sheet-close');
  const calSheetApply = document.getElementById('cal-sheet-apply');
  const calSheetReset = document.getElementById('cal-sheet-reset');

  if (calTitleEl && CAL_DATA.sessionTitle) calTitleEl.textContent = CAL_DATA.sessionTitle;
  if (calMetaEl) {
    const updPart = CAL_DATA.pdfModifiedAt ? `Aggiornato da DIETI il ${CAL_DATA.pdfModifiedAt}` : 'Fonte ufficiale DIETI';
    calMetaEl.textContent = `${updPart} • ${CAL_DATA.totalDates || 0} appelli indicizzati • Sincronizzazione automatica attiva`;
  }
  if (calPdfLinkEl && CAL_DATA.pdfUrl) calPdfLinkEl.href = CAL_DATA.pdfUrl;
  if (calPageLinkEl && CAL_DATA.sourcePageUrl) calPageLinkEl.href = CAL_DATA.sourcePageUrl;

  if (calMonthFilter && Array.isArray(CAL_DATA.months)) {
    CAL_DATA.months.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.key;
      opt.textContent = `${m.label} (${m.count})`;
      calMonthFilter.appendChild(opt);
    });
  }
  if (calMonthPillsEl && Array.isArray(CAL_DATA.months)) {
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'cal-month-pill';
    allBtn.dataset.calMonthPill = '';
    allBtn.setAttribute('aria-pressed', 'true');
    allBtn.innerHTML = `<span>Tutti i mesi</span><span class="pill-cnt">${CAL_DATA.totalDates || 0}</span>`;
    allBtn.addEventListener('click', () => {
      if (calMonthFilter) calMonthFilter.value = '';
      renderCalendar();
    });
    calMonthPillsEl.appendChild(allBtn);
    CAL_DATA.months.forEach((m) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal-month-pill';
      b.dataset.calMonthPill = m.key;
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span>${escapeHtml(m.label)}</span><span class="pill-cnt">${m.count}</span>`;
      b.addEventListener('click', () => {
        if (calMonthFilter) calMonthFilter.value = calMonthFilter.value === m.key ? '' : m.key;
        renderCalendar();
      });
      calMonthPillsEl.appendChild(b);
    });
  }

  const calSheetHandle = document.getElementById('cal-sheet-handle');
  const setCalSheetOpen = (open) => {
    if (!calFiltersGridBox || !calMobileFiltersToggle) return;
    const isModalSheet = window.innerWidth <= 768;
    calFiltersGridBox.style.transform = '';
    calFiltersGridBox.classList.toggle('is-open', open);
    calSheetBackdrop?.classList.toggle('is-open', open);
    calMobileFiltersToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    setBackgroundInert(calFiltersGridBox, calSheetBackdrop, open && isModalSheet);
    if (open) {
      calYearFilter?.focus({ preventScroll: true });
    } else if (document.activeElement && calFiltersGridBox.contains(document.activeElement)) {
      calMobileFiltersToggle.focus({ preventScroll: true });
    }
  };
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023 && catalogFiltersSheet?.classList.contains('is-open')) setCatalogSheetOpen(false);
    if (window.innerWidth > 768 && calFiltersGridBox?.classList.contains('is-open')) setCalSheetOpen(false);
  });

  if (calMobileFiltersToggle && calFiltersGridBox) {
    calMobileFiltersToggle.addEventListener('click', () => {
      setCalSheetOpen(!calFiltersGridBox.classList.contains('is-open'));
    });
    calSheetBackdrop?.addEventListener('click', () => setCalSheetOpen(false));
    calSheetClose?.addEventListener('click', () => setCalSheetOpen(false));
    calSheetApply?.addEventListener('click', () => setCalSheetOpen(false));
    calSheetReset?.addEventListener('click', () => calResetBtn?.click());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && calFiltersGridBox.classList.contains('is-open')) setCalSheetOpen(false);
    });
    if (calSheetHandle) {
      let dragStartY = 0;
      let dragDeltaY = 0;
      let dragging = false;
      calSheetHandle.addEventListener('pointerdown', (e) => {
        if (window.innerWidth > 768) return;
        dragging = true;
        dragStartY = e.clientY;
        dragDeltaY = 0;
        calFiltersGridBox.style.transition = 'none';
        calSheetHandle.setPointerCapture?.(e.pointerId);
      });
      calSheetHandle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        dragDeltaY = Math.max(0, e.clientY - dragStartY);
        calFiltersGridBox.style.transform = `translateY(${dragDeltaY}px)`;
      });
      const endCalDrag = () => {
        if (!dragging) return;
        dragging = false;
        calFiltersGridBox.style.transition = '';
        if (dragDeltaY > 75) setCalSheetOpen(false);
        else calFiltersGridBox.style.transform = '';
      };
      calSheetHandle.addEventListener('pointerup', endCalDrag);
      calSheetHandle.addEventListener('pointercancel', endCalDrag);
    }
  }

  const courseByNameMap = new Map(DATA.courses.map((c) => [c.name, c]));
  const jumpToCourseFiles = (repoCourseName) => {
    const c = courseByNameMap.get(repoCourseName);
    if (!c) return;
    openCatalog('tab-btn-files');
    searchInput.value = '';
    filterYear.value = c.yearGroup;
    updateCourseOptions();
    filterCourse.value = c.name;
    updateProfOptions();
    filterProf.value = '';
    activeSubpath = '';
    applyFileFilters();
  };

  function renderCalendar(syncUrl = true) {
    if (!calResultsEl) return;
    const qNorm = normText(calSearch ? calSearch.value.trim() : '');
    const tokens = qNorm ? qNorm.split(/\s+/) : [];
    const yr = calYearFilter ? calYearFilter.value : '';
    const reg = calRegFilter ? calRegFilter.value : 'current';
    const mo = calMonthFilter ? calMonthFilter.value : '';

    const activeDropdownCount = [yr, reg !== 'current' ? reg : '', mo].filter(Boolean).length;
    if (calMobileFiltersLabel) {
      calMobileFiltersLabel.textContent = activeDropdownCount > 0 ? `Filtri (${activeDropdownCount})` : 'Filtri';
    }
    if (calUpcomingChip) calUpcomingChip.setAttribute('aria-pressed', calUpcomingOnly ? 'true' : 'false');
    if (calPinnedChip) calPinnedChip.setAttribute('aria-pressed', calPinnedOnly ? 'true' : 'false');
    calViewBtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.calView === calViewMode ? 'true' : 'false'));
    if (calMonthPillsEl) {
      calMonthPillsEl.querySelectorAll('[data-cal-month-pill]').forEach((p) => {
        p.setAttribute('aria-pressed', p.dataset.calMonthPill === mo ? 'true' : 'false');
      });
    }

    const hasNonDefault = Boolean(qNorm || yr || reg !== 'current' || mo || !calUpcomingOnly || calPinnedOnly);
    if (calResetBtn) calResetBtn.hidden = !hasNonDefault;

    const entries = Array.isArray(CAL_DATA.entries) ? CAL_DATA.entries : [];

    const matchesEntryMeta = (e) => {
      if (yr && e.yearGroup !== yr) return false;
      if (reg === 'current' && e.regolamento === 'Vecchio Regolamento') return false;
      if (reg !== 'current' && reg !== 'all' && e.regolamento !== reg) return false;
      if (calPinnedOnly && !pinnedCourses.has(e.repoCourse || e.course)) return false;
      if (tokens.length > 0) {
        const datesText = (e.dates || [])
          .map((d) => `${d.display} ${d.weekLabel} ${CAL_MONTH_NAMES_IT[d.month] || ''} ${d.year}`)
          .join(' ');
        const blob = normText(`${e.course} ${e.repoCourse || ''} ${e.aliases || ''} ${e.prof} ${e.channel} ${e.yearGroup} ${e.regolamento} ${e.note || ''} ${datesText}`);
        for (const tk of tokens) {
          if (!blob.includes(tk)) return false;
        }
      }
      return true;
    };

    // Update month pills live counts to match active Year / Regolamento / Upcoming / Pinned / Search filters
    if (calMonthPillsEl) {
      const liveMonthCounts = new Map();
      let liveAllCount = 0;
      entries.forEach((e) => {
        if (!matchesEntryMeta(e)) return;
        (e.dates || []).forEach((d) => {
          if (calUpcomingOnly && d.iso < todayIso) return;
          liveAllCount += 1;
          liveMonthCounts.set(d.monthKey, (liveMonthCounts.get(d.monthKey) || 0) + 1);
        });
      });
      calMonthPillsEl.querySelectorAll('[data-cal-month-pill]').forEach((p) => {
        const k = p.dataset.calMonthPill;
        const cnt = k ? (liveMonthCounts.get(k) || 0) : liveAllCount;
        const cntEl = p.querySelector('.pill-cnt');
        if (cntEl) cntEl.textContent = String(cnt);
        p.hidden = Boolean(k && cnt === 0 && mo !== k);
        p.setAttribute('aria-pressed', k === mo ? 'true' : 'false');
      });
    }

    const filterDatesForEntry = (e, requireUpcoming) => {
      return (e.dates || []).filter((d) => {
        if (requireUpcoming && d.iso < todayIso) return false;
        if (mo && d.monthKey !== mo) return false;
        return true;
      });
    };

    const filteredEntries = entries.filter((e) => {
      if (!matchesEntryMeta(e)) return false;
      const visibleDates = filterDatesForEntry(e, calUpcomingOnly);
      if (calViewMode === 'timeline') {
        return visibleDates.length > 0;
      }
      if (mo) return visibleDates.length > 0;
      if (calUpcomingOnly) {
        // In "Prossimi" mostra i canali con appelli futuri oppure con note informative (es. CLA, Magistrale, senza date)
        return visibleDates.length > 0 || (e.dates || []).length === 0;
      }
      return true;
    });

    let totalVisibleDates = 0;
    filteredEntries.forEach((e) => {
      totalVisibleDates += filterDatesForEntry(e, calUpcomingOnly).length;
    });

    // Sort pinned courses first in courses view so user's exams stay at the top
    const isEntryPinned = (e) => pinnedCourses.has(e.repoCourse || e.course);
    filteredEntries.sort((a, b) => Number(isEntryPinned(b)) - Number(isEntryPinned(a)));

    // Pinned courses upcoming exams spotlight strip at top of Calendar
    if (calPinnedSpotlightEl) {
      const pinnedUpcoming = [];
      if (pinnedCourses.size > 0 && !calPinnedOnly && !qNorm) {
        entries.forEach((e) => {
          if (!isEntryPinned(e)) return;
          const nextD = (e.dates || []).find((d) => d.iso >= todayIso);
          if (nextD) pinnedUpcoming.push({ entry: e, date: nextD });
        });
        pinnedUpcoming.sort((a, b) => a.date.iso.localeCompare(b.date.iso));
      }
      if (pinnedUpcoming.length > 0) {
        calPinnedSpotlightEl.hidden = false;
        calPinnedSpotlightEl.innerHTML = `
          <div class="cal-pinned-spotlight-head">
            <span style="display:inline-flex;align-items:center;gap:6px;">${SVG_ICONS.starFilled} Prossimi appelli dei tuoi corsi fissati</span>
            <span class="meta-tag">${pinnedUpcoming.length}</span>
          </div>
          <div class="cal-pinned-strip"></div>
        `;
        const strip = calPinnedSpotlightEl.querySelector('.cal-pinned-strip');
        pinnedUpcoming.slice(0, 6).forEach(({ entry: e, date: d }) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cal-pinned-mini';
          btn.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <strong style="font-size:0.8125rem;color:var(--primary-text);">${escapeHtml(getWeekdayShort(d.iso))} ${escapeHtml(d.display)}</strong>
              <span class="${getCountdownClass(d.iso)}">${escapeHtml(formatCountdown(d.iso))}</span>
            </div>
            <strong style="font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(e.course)}</strong>
            <span style="font-size:0.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(e.channel || e.prof || e.yearGroup)}</span>
          `;
          btn.addEventListener('click', () => {
            if (calSearch) calSearch.value = e.course;
            renderCalendar();
          });
          strip.appendChild(btn);
        });
      } else {
        calPinnedSpotlightEl.hidden = true;
        calPinnedSpotlightEl.innerHTML = '';
      }
    }

    if (calResultsCount) {
      calResultsCount.textContent = calViewMode === 'timeline'
        ? `${totalVisibleDates} ${totalVisibleDates === 1 ? 'appello' : 'appelli'} in calendario`
        : `${filteredEntries.length} ${filteredEntries.length === 1 ? 'canale trovato' : 'canali trovati'} • ${totalVisibleDates} appelli`;
    }
    if (calSheetApply) {
      calSheetApply.textContent = `Mostra ${totalVisibleDates} appelli`;
    }

    calResultsEl.innerHTML = '';

    if (filteredEntries.length === 0) {
      const pastAvailable = calUpcomingOnly && entries.some((e) => matchesEntryMeta(e) && filterDatesForEntry(e, false).length > 0);
      const qRaw = calSearch ? calSearch.value.trim() : '';
      const calIssueHref = `${REPO_URL}/issues/new?template=problema_calendario.yml${qRaw ? `&title=${encodeURIComponent('[Calendario] ' + qRaw)}` : ''}`;
      calResultsEl.innerHTML = `
        <div class="empty-state-card">
          <h2>Nessun appello trovato con i filtri attuali</h2>
          <p>${pastAvailable
            ? 'Tutti gli appelli di questa ricerca si sono già svolti prima di oggi. Puoi includere anche gli appelli passati della sessione.'
            : 'Prova a cercare con un\'altra sigla (es. ADE, APSD, BD), a cambiare regolamento (Nuovo/Vecchio) oppure segnala un appello mancante.'
          }</p>
          <div class="empty-state-actions">
            ${pastAvailable ? '<button type="button" class="btn btn-primary" id="cal-empty-show-past">Mostra anche appelli passati</button>' : ''}
            <button type="button" class="btn" id="cal-empty-reset">Azzera filtri calendario</button>
            <a class="btn" href="${calIssueHref}" target="_blank" rel="noopener">${SVG_ICONS.alertCircle} Segnala appello mancante</a>
          </div>
        </div>
      `;
      document.getElementById('cal-empty-show-past')?.addEventListener('click', () => {
        calUpcomingOnly = false;
        renderCalendar();
      });
      document.getElementById('cal-empty-reset')?.addEventListener('click', () => calResetBtn.click());
      if (syncUrl) syncUrlState('tab-btn-calendar');
      return;
    }

    if (calViewMode === 'timeline') {
      const events = [];
      filteredEntries.forEach((e) => {
        filterDatesForEntry(e, calUpcomingOnly).forEach((d) => {
          events.push({ entry: e, date: d });
        });
      });
      events.sort((a, b) => a.date.iso.localeCompare(b.date.iso) || a.entry.course.localeCompare(b.entry.course, 'it'));

      const byMonth = new Map();
      events.forEach((ev) => {
        const k = ev.date.monthKey;
        if (!byMonth.has(k)) byMonth.set(k, []);
        byMonth.get(k).push(ev);
      });

      const frag = document.createDocumentFragment();
      for (const [mKey, list] of byMonth.entries()) {
        const firstD = list[0].date;
        const monthLabel = `${CAL_MONTH_NAMES_IT[firstD.month] || ''} ${firstD.year}`;
        const sec = document.createElement('div');
        sec.className = 'timeline-month-group';
        sec.innerHTML = `
          <div class="timeline-month-title">
            <span>${escapeHtml(monthLabel)}</span>
            <span class="meta-tag">${list.length} ${list.length === 1 ? 'appello' : 'appelli'}</span>
          </div>
          <div class="timeline-list"></div>
        `;
        const listEl = sec.querySelector('.timeline-list');
        list.forEach(({ entry: e, date: d }) => {
          const isPast = d.iso < todayIso;
          const isPinnedEx = isEntryPinned(e);
          const wd = getWeekdayShort(d.iso);
          const cd = formatCountdown(d.iso);
          const hasRepo = Boolean(e.repoCourse && courseByNameMap.has(e.repoCourse));
          const row = document.createElement('div');
          row.className = `timeline-row${isPast ? ' is-past' : ''}${isPinnedEx ? ' is-pinned-exam' : ''}`;
          row.innerHTML = `
            <div class="timeline-left">
              <div class="timeline-date-box">
                <span>${escapeHtml(wd)}</span>
                <strong>${String(d.day).padStart(2, '0')}</strong>
                <span>${escapeHtml(CAL_MONTH_SHORT_IT[d.month] || '')}</span>
              </div>
              <div class="timeline-info">
                <div class="timeline-course">
                  <span>${escapeHtml(e.course)}</span>
                  ${isPinnedEx ? `<span class="pinned-exam-badge">${SVG_ICONS.starFilled} Fissato</span>` : ''}
                  ${e.channel ? `<span class="channel-badge">${escapeHtml(e.channel)}</span>` : ''}
                  ${e.regolamento === 'Vecchio Regolamento' ? '<span class="reg-badge">Vecchio Reg.</span>' : ''}
                  ${d.isTentative ? `<span class="exam-tentative-badge" title="${escapeHtml(d.warning || 'Verificare sul PDF DIETI')}">Verificare sul PDF DIETI</span>` : ''}
                </div>
                <div class="timeline-sub">
                  ${[e.yearGroup, e.semester ? `${e.semester} sem` : '', e.prof || ''].filter(Boolean).map(escapeHtml).join(' • ')}
                </div>
              </div>
            </div>
            <div class="timeline-actions">
              <span class="${getCountdownClass(d.iso)}">${escapeHtml(cd)}</span>
              ${hasRepo ? `<button type="button" class="btn" data-cal-jump="${escapeHtml(e.repoCourse)}">${SVG_ICONS.search} Materiale</button>` : ''}
            </div>
          `;
          row.querySelector('[data-cal-jump]')?.addEventListener('click', () => jumpToCourseFiles(e.repoCourse));
          listEl.appendChild(row);
        });
        frag.appendChild(sec);
      }
      calResultsEl.appendChild(frag);
      if (syncUrl) syncUrlState('tab-btn-calendar');
      return;
    }

    // Vista "courses" (Per Corso / Canale)
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    const frag = document.createDocumentFragment();

    filteredEntries.forEach((e) => {
      const card = document.createElement('article');
      const isPinnedEx = isEntryPinned(e);
      card.className = `calendar-card${e.regolamento === 'Vecchio Regolamento' ? ' is-old-reg' : ''}${isPinnedEx ? ' is-pinned-exam' : ''}`;
      const futureDates = (e.dates || []).filter((d) => d.iso >= todayIso);
      const nextDate = futureDates[0] || null;
      const displayDates = (e.dates || []).filter((d) => {
        if (mo && d.monthKey !== mo) return false;
        if (calUpcomingOnly && d.iso < todayIso) return false;
        return true;
      });
      const hasRepo = Boolean(e.repoCourse && courseByNameMap.has(e.repoCourse));

      const datesHtml = displayDates.map((d) => {
        const isPast = d.iso < todayIso;
        const isNext = nextDate && d.iso === nextDate.iso;
        const wd = getWeekdayShort(d.iso);
        const tentativeCls = d.isTentative ? ' is-tentative' : '';
        const cls = (isNext ? 'exam-date-pill is-next' : (isPast ? 'exam-date-pill is-past' : 'exam-date-pill')) + tentativeCls;
        const titleTxt = d.isTentative
          ? (d.warning || 'Verificare sul PDF DIETI')
          : (isNext ? 'Prossimo appello disponibile' : (isPast ? 'Appello passato' : 'Appello programmato'));
        return `
          <span class="${cls}" title="${escapeHtml(titleTxt)}">
            <strong>${escapeHtml(wd)} ${escapeHtml(d.display)}${d.isTentative ? ' ⚠' : ''}</strong>
            <span class="exam-date-sub">${d.isTentative ? 'Verificare sul PDF DIETI' : `${escapeHtml(CAL_MONTH_NAMES_IT[d.month] || '')} ${d.year}`}</span>
          </span>
        `;
      }).join('');

      card.innerHTML = `
        <div>
          <div class="calendar-card-head">
            <h2 class="calendar-card-title">${escapeHtml(e.course)}</h2>
            ${e.channel ? `<span class="channel-badge">${escapeHtml(e.channel)}</span>` : ''}
          </div>
          <div class="course-meta-row">
            <span class="meta-tag is-year">${escapeHtml(e.yearGroup)}${e.semester ? ` • ${escapeHtml(e.semester)} sem` : ''}</span>
            ${isPinnedEx ? `<span class="pinned-exam-badge">${SVG_ICONS.starFilled} Corso fissato</span>` : ''}
            ${e.regolamento === 'Vecchio Regolamento' ? '<span class="reg-badge">Vecchio Regolamento</span>' : ''}
          </div>
        </div>
        ${(e.prof || e.email) ? `
          <div class="calendar-prof-row">
            <strong>${escapeHtml(e.prof || 'Docente da definire')}</strong>
            ${e.email ? `<a class="calendar-prof-mail" href="mailto:${escapeHtml(e.email.split('/')[0].trim())}">${escapeHtml(e.email)}</a>` : ''}
          </div>
        ` : ''}
        ${nextDate ? `
          <div class="cal-next-banner">
            <span>Prossimo: ${escapeHtml(getWeekdayShort(nextDate.iso))} ${escapeHtml(nextDate.display)}</span>
            <span class="${getCountdownClass(nextDate.iso)}">${escapeHtml(formatCountdown(nextDate.iso))}</span>
          </div>
        ` : ''}
        ${displayDates.length > 0 ? `<div class="cal-dates-list">${datesHtml}</div>` : ''}
        ${e.note ? `<div class="cal-note-box">${escapeHtml(e.note)}</div>` : ''}
        ${(!e.note && (e.dates || []).length === 0) ? '<div class="cal-note-box">Nessuna data pubblicata al momento in questo calendario DIETI.</div>' : ''}
        ${hasRepo ? `
          <div class="calendar-card-footer">
            <button type="button" class="btn" data-cal-jump="${escapeHtml(e.repoCourse)}">${SVG_ICONS.search} Materiale e tracce (${courseByNameMap.get(e.repoCourse).fileCount} file)</button>
          </div>
        ` : ''}
      `;
      card.querySelector('[data-cal-jump]')?.addEventListener('click', () => jumpToCourseFiles(e.repoCourse));
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    calResultsEl.appendChild(grid);
    if (syncUrl) syncUrlState('tab-btn-calendar');
  }

  let calSearchDebounce = null;
  if (calSearch) {
    calSearch.addEventListener('input', () => {
      clearTimeout(calSearchDebounce);
      calSearchDebounce = setTimeout(() => renderCalendar(), 120);
    });
  }
  calYearFilter?.addEventListener('change', () => renderCalendar());
  calRegFilter?.addEventListener('change', () => renderCalendar());
  calMonthFilter?.addEventListener('change', () => renderCalendar());
  calUpcomingChip?.addEventListener('click', () => {
    calUpcomingOnly = !calUpcomingOnly;
    renderCalendar();
  });
  calPinnedChip?.addEventListener('click', () => {
    calPinnedOnly = !calPinnedOnly;
    renderCalendar();
  });
  calViewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      calViewMode = btn.dataset.calView;
      renderCalendar();
    });
  });
  calResetBtn?.addEventListener('click', () => {
    if (calSearch) calSearch.value = '';
    if (calYearFilter) calYearFilter.value = '';
    if (calRegFilter) calRegFilter.value = 'current';
    if (calMonthFilter) calMonthFilter.value = '';
    calUpcomingOnly = true;
    calPinnedOnly = false;
    renderCalendar();
  });
  document.getElementById('copy-calendar-link-btn')?.addEventListener('click', () => {
    syncUrlState('tab-btn-calendar');
    copyText(location.href, 'Link al calendario filtrato copiato');
  });

  // Hydrate filters from URL query string & hash on load / popstate
  const hydrateFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const hasQueryFilters = ['q', 'year', 'course', 'prof', 'cat', 'sub', 'sort', 'group'].some((k) => params.has(k));
    const hasCalFilters = ['cal_q', 'cal_year', 'cal_reg', 'cal_month', 'cal_past', 'cal_pins', 'cal_view'].some((k) => params.has(k));

    if (params.has('q')) searchInput.value = params.get('q');
    if (params.has('year')) filterYear.value = params.get('year');
    updateCourseOptions();
    if (params.has('course')) filterCourse.value = params.get('course');
    updateProfOptions();
    if (params.has('prof')) filterProf.value = params.get('prof');
    if (params.has('cat')) filterCat.value = params.get('cat');
    if (params.has('sub')) activeSubpath = params.get('sub');
    if (params.has('sort')) sortSelect.value = params.get('sort');
    if (params.get('group') === '1') {
      groupByFolder = true;
      toggleGroupBtn.setAttribute('aria-pressed', 'true');
    }

    if (calSearch) calSearch.value = params.get('cal_q') || '';
    if (calYearFilter) calYearFilter.value = params.get('cal_year') || '';
    if (calRegFilter) calRegFilter.value = params.get('cal_reg') || 'current';
    if (calMonthFilter) calMonthFilter.value = params.get('cal_month') || '';
    calUpcomingOnly = params.get('cal_past') !== '1';
    calPinnedOnly = params.get('cal_pins') === '1';
    calViewMode = params.get('cal_view') === 'timeline' ? 'timeline' : 'courses';

    const h = location.hash;
    if (h === '#calendario' || hasCalFilters) {
      calendarRendered = true;
      renderCalendar(false);
      openCatalog('tab-btn-calendar', false);
    } else if (h === '#catalogo' || hasQueryFilters) {
      filesRendered = true;
      applyFileFilters(false);
      openCatalog('tab-btn-files', false);
    } else if (h === '#corsi') {
      coursesRendered = true;
      renderCourses();
      openCatalog('tab-btn-courses', false);
    } else if (h === '#mappe') {
      openCatalog('tab-btn-hub', false);
    } else {
      openHome(false);
    }
  };

  window.addEventListener('popstate', () => {
    if (ignoreModalBackPopstate > 0) {
      ignoreModalBackPopstate -= 1;
      return;
    }
    const openDlg = document.querySelector('dialog[open]');
    if (openDlg) {
      const st = getDialogState(openDlg);
      st.closedViaPopstate = true;
      openDlg.close();
      return;
    }
    hydrateFromUrl();
  });

  // DIETI Official Course Site Status Monitor (Issue #36: Online / Lento / Manutenzione / Down)
  const DIETI_SITE_URL = 'https://informatica.dieti.unina.it/index.php/it/';
  const DIETI_STATUS_LIVE_URL = 'https://raw.githubusercontent.com/Carloj005/UNINA-INFORMATICA/status-data/dieti_status.json';
  const DIETI_STATUS_LOCAL_URL = './data/dieti_status.json';
  const statusModal = document.getElementById('status-modal');
  const statusModalBody = document.getElementById('status-modal-body');
  const statusTriggers = [...document.querySelectorAll('[data-open-status]')];

  const DIETI_STATUS_META = {
    online: { cls: 'is-online', label: 'Online', defaultSummary: 'Il sito del Corso di Laurea DIETI è raggiungibile e risponde regolarmente.' },
    degraded: { cls: 'is-degraded', label: 'Lento', defaultSummary: 'Il sito DIETI risponde lentamente oppure la pagina calendario presenta problemi.' },
    maintenance: { cls: 'is-maintenance', label: 'Manutenzione', defaultSummary: 'Il sito DIETI risulta temporaneamente in manutenzione o offline.' },
    down: { cls: 'is-down', label: 'Down', defaultSummary: 'Il sito DIETI non è al momento raggiungibile.' },
    unknown: { cls: 'is-loading', label: 'Non verificato', defaultSummary: 'In attesa del primo controllo automatico del sito DIETI.' }
  };

  let dietiStatusData = null;
  let dietiStatusLoading = false;

  const formatRelativeTimeIt = (isoStr) => {
    if (!isoStr) return '';
    const dt = new Date(isoStr);
    if (Number.isNaN(dt.getTime())) return '';
    const diffSec = Math.max(0, Math.round((Date.now() - dt.getTime()) / 1000));
    if (diffSec < 60) return 'pochi secondi fa';
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min fa`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `${diffH} ${diffH === 1 ? 'ora' : 'ore'} fa`;
    const diffD = Math.round(diffH / 24);
    return `${diffD} ${diffD === 1 ? 'giorno' : 'giorni'} fa`;
  };

  const formatLocalDateTimeIt = (isoStr) => {
    if (!isoStr) return '—';
    const dt = new Date(isoStr);
    if (Number.isNaN(dt.getTime())) return isoStr;
    return dt.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const isStatusStale = (isoStr) => {
    if (!isoStr) return false;
    const dt = new Date(isoStr);
    return !Number.isNaN(dt.getTime()) && (Date.now() - dt.getTime()) > 2 * 60 * 60 * 1000;
  };

  const renderStatusBadges = () => {
    const data = dietiStatusData;
    const stKey = (data && DIETI_STATUS_META[data.status]) ? data.status : 'unknown';
    const meta = DIETI_STATUS_META[stKey];
    const displayLabel = (data && data.label) ? data.label : meta.label;
    const rel = data ? formatRelativeTimeIt(data.checkedAt) : '';
    const latencyStr = (data && data.latencyMs > 0 && stKey !== 'down') ? `${data.latencyMs} ms` : '';
    const tooltipParts = [
      `Stato sito DIETI: ${displayLabel}`,
      latencyStr,
      rel ? `aggiornato ${rel}` : ''
    ].filter(Boolean);

    statusTriggers.forEach((btn) => {
      btn.classList.remove('is-online', 'is-degraded', 'is-maintenance', 'is-down', 'is-loading');
      btn.classList.add(meta.cls);
      const lblEl = btn.querySelector('.dieti-status-label');
      if (lblEl) {
        lblEl.textContent = `Sito DIETI: ${displayLabel}`;
      }
      btn.title = `${tooltipParts.join(' · ')} — Clicca per i dettagli`;
      btn.setAttribute('aria-label', `${tooltipParts.join(', ')}. Apri dettagli stato sito DIETI.`);
    });
  };

  const renderStatusModal = () => {
    if (!statusModalBody) return;
    const data = dietiStatusData;
    const stKey = (data && DIETI_STATUS_META[data.status]) ? data.status : 'unknown';
    const meta = DIETI_STATUS_META[stKey];
    const displayLabel = (data && data.label) ? data.label : meta.label;
    const summary = (data && data.summary) ? data.summary : meta.defaultSummary;
    const rel = data ? formatRelativeTimeIt(data.checkedAt) : '';
    const exact = data ? formatLocalDateTimeIt(data.checkedAt) : '—';
    const stale = data ? isStatusStale(data.checkedAt) : false;
    const services = (data && Array.isArray(data.services)) ? data.services : [];
    const history = (data && Array.isArray(data.history)) ? data.history : [];
    const uptimeStr = (data && typeof data.uptimePct === 'number') ? `${data.uptimePct}% uptime` : '';

    const servicesHtml = services.length > 0
      ? `
        <div class="status-services">
          ${services.map((svc) => {
            const sMeta = DIETI_STATUS_META[svc.status] || DIETI_STATUS_META.unknown;
            const sLbl = svc.status === 'online' ? 'Online'
              : (svc.status === 'maintenance' ? 'Manutenzione'
                : (svc.status === 'degraded' ? 'Lento' : (svc.status === 'down' ? 'Down' : 'N/D')));
            const safeUrl = isSafeHttpsUrl(svc.url) ? svc.url : DIETI_SITE_URL;
            return `
              <div class="status-service-row">
                <div class="status-service-info">
                  <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener" class="status-service-name">${escapeHtml(svc.name || 'Servizio DIETI')}</a>
                  <span class="status-service-detail">${escapeHtml(svc.detail || '')}</span>
                </div>
                <span class="status-pill-tag ${sMeta.cls}"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(sLbl)}</span>
              </div>
            `;
          }).join('')}
        </div>
      `
      : '';

    const historyHtml = history.length > 0
      ? `
        <div class="status-history">
          <div class="status-history-head">
            <span>${history.length === 1 ? 'Ultimo controllo automatico' : `Ultimi ${history.length} controlli automatici`}</span>
            ${uptimeStr ? `<strong>${escapeHtml(uptimeStr)}</strong>` : ''}
          </div>
          <div class="status-history-bar" role="img" aria-label="Storico ultimi ${history.length} controlli stato DIETI${uptimeStr ? `, ${uptimeStr}` : ''}">
            ${history.map((h) => {
              const hMeta = DIETI_STATUS_META[h.s] || DIETI_STATUS_META.unknown;
              const hTip = `${formatLocalDateTimeIt(h.t)} • ${hMeta.label}${h.ms ? ` (${h.ms} ms)` : ''}`;
              return `<span class="status-history-seg ${hMeta.cls}" title="${escapeHtml(hTip)}"></span>`;
            }).join('')}
          </div>
          <div class="status-history-legend">
            <span><i class="status-dot is-online"></i>Online</span>
            <span><i class="status-dot is-degraded"></i>Lento</span>
            <span><i class="status-dot is-maintenance"></i>Manutenzione</span>
            <span><i class="status-dot is-down"></i>Down</span>
          </div>
        </div>
      `
      : '';

    const offlineTipHtml = (stKey === 'maintenance' || stKey === 'down')
      ? `<div class="status-offline-tip">${SVG_ICONS.checkCircle} <span>Anche se il sito DIETI è offline o in manutenzione, <strong>catalogo file, appunti, codici Teams e copia sincronizzata del calendario esami</strong> qui sul portale restano sempre consultabili.</span></div>`
      : '';

    statusModalBody.innerHTML = `
      <div class="status-hero ${meta.cls}">
        <div class="status-hero-top">
          <span class="status-pill-tag ${meta.cls}"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(displayLabel)}</span>
          <span class="status-checked-time">${rel ? `Controllato ${escapeHtml(rel)} (${escapeHtml(exact)})` : 'In attesa di controllo'}</span>
        </div>
        <p class="status-hero-summary">${escapeHtml(summary)}</p>
        ${stale ? '<p class="status-stale-note">Nota: l\'ultimo snapshot ha più di 2 ore; clicca "Aggiorna stato" o verifica direttamente sul sito DIETI.</p>' : ''}
      </div>
      ${offlineTipHtml}
      ${servicesHtml}
      ${historyHtml}
      <div class="status-actions">
        <button type="button" class="btn" id="status-refresh-btn" ${dietiStatusLoading ? 'disabled' : ''}>${SVG_ICONS.refresh} ${dietiStatusLoading ? 'Aggiornamento…' : 'Aggiorna stato'}</button>
        <a class="btn btn-primary" href="${DIETI_SITE_URL}" target="_blank" rel="noopener">${SVG_ICONS.externalLink} Apri sito DIETI</a>
        <a class="btn" href="${REPO_URL}/issues/new?template=problema_calendario.yml" target="_blank" rel="noopener">${SVG_ICONS.calendar} Segnala problema calendario</a>
      </div>
    `;
    document.getElementById('status-refresh-btn')?.addEventListener('click', () => {
      fetchDietiStatus(true);
    });
  };

  async function fetchDietiStatus(forceFresh = false) {
    if (dietiStatusLoading) return;
    dietiStatusLoading = true;
    if (statusModal?.open) renderStatusModal();

    const cacheBust = forceFresh ? Date.now() : Math.floor(Date.now() / 300000);
    const urls = [
      `${DIETI_STATUS_LIVE_URL}?t=${cacheBust}`,
      `${DIETI_STATUS_LOCAL_URL}?t=${cacheBust}`
    ];

    let loaded = null;
    for (const u of urls) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 5000);
        const resp = await fetch(u, { signal: ctrl.signal, cache: forceFresh ? 'no-store' : 'default' });
        clearTimeout(timer);
        if (!resp.ok) continue;
        const parsed = await resp.json();
        if (parsed && typeof parsed === 'object' && parsed.status) {
          loaded = parsed;
          if (parsed.status !== 'unknown' || u === urls[urls.length - 1]) break;
        }
      } catch {}
    }

    dietiStatusLoading = false;
    if (loaded) {
      dietiStatusData = loaded;
    } else if (!dietiStatusData) {
      dietiStatusData = { status: 'unknown', label: 'Non verificato', checkedAt: '', services: [], history: [] };
    }
    renderStatusBadges();
    if (statusModal?.open) renderStatusModal();
    if (forceFresh) {
      const lbl = (dietiStatusData && dietiStatusData.label) || 'aggiornato';
      showToast(`Stato sito DIETI: ${lbl}`);
    }
  }

  function openStatusModal() {
    if (!statusModal) return;
    renderStatusModal();
    openDialogWithHistory(statusModal);
    if (!dietiStatusData || dietiStatusData.status === 'unknown') {
      fetchDietiStatus(true);
    }
  }

  statusTriggers.forEach((btn) => {
    btn.addEventListener('click', openStatusModal);
  });

  // Render Home Section 4: Scorciatoie e contributi rapidi (mantiene index.html leggero < 40 KB)
  const renderHomeShortcuts = () => {
    const grid = document.getElementById('home-shortcuts-grid');
    if (!grid) return;
    const acYr = (DATA.examCalendar && DATA.examCalendar.academicYear) || '2026/2027';
    const uploadSvg = '<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>';
    const shortcuts = [
      { label: 'Segnala codice Teams', href: `${REPO_URL}/issues/new?template=codice_teams.yml`, icon: SVG_ICONS.plus },
      { label: 'Invia appunti o tracce', href: `${REPO_URL}/issues/new?template=richiesta_o_materiale.yml`, icon: uploadSvg },
      { label: 'Invia traccia progetto', href: `${REPO_URL}/issues/new?template=traccia_progetto.yml`, icon: SVG_ICONS.code },
      { label: 'Segnala problema calendario', href: `${REPO_URL}/issues/new?template=problema_calendario.yml`, icon: SVG_ICONS.calendar },
      { label: `Orario lezioni ${acYr}`, href: `${REPO_URL}/raw/master/info-generali/Orario%20Lezioni%202026-2027.pdf`, icon: SVG_ICONS.download },
      { label: 'Gruppi Telegram studenti', href: 'https://t.me/+7HOZaOMbgSphNGM0', icon: SVG_ICONS.send }
    ];
    grid.innerHTML = shortcuts.map((s) => `
      <a class="shortcut-card" href="${escapeHtml(s.href)}" target="_blank" rel="noopener">
        <span class="shortcut-left">
          <span class="shortcut-icon-box" aria-hidden="true">${s.icon}</span>
          <span>${escapeHtml(s.label)}</span>
        </span>
        <span class="shortcut-arrow" aria-hidden="true">${SVG_ICONS.chevRight}</span>
      </a>
    `).join('');
  };

  syncFavBadge();
  renderPinnedHome();
  renderHomeShortcuts();
  hydrateFromUrl();
  fetchDietiStatus(false);

  // Register Service Worker for offline shell & cached catalog/maps
  const registerSW = () => {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  };
  if (document.readyState === 'complete') registerSW();
  else window.addEventListener('load', registerSW);
})();
