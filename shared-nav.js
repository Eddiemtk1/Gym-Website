(function registerGymflowNav(global) {
  function getRoleLabel(role) {
    const resolvedRole = normalizeRole(role);
    if (resolvedRole === 'admin') return 'Admin';
    if (resolvedRole === 'trainer') return 'Trainer';
    return 'Member';
  }

  function getAvatarInitial(name) {
    const text = String(name || '').trim();
    return text ? text.charAt(0).toUpperCase() : 'M';
  }

  function getDefaultAvatarDataUri(initial) {
    const safeInitial = (String(initial || 'M').match(/[A-Za-z0-9]/) || ['M'])[0].toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' fill='#131313'/><circle cx='40' cy='40' r='38' fill='#1a1a1a' stroke='#00E0FF' stroke-width='2'/><text x='40' y='52' text-anchor='middle' font-family='Inter,Arial,sans-serif' font-size='30' font-weight='700' fill='#00E0FF'>${safeInitial}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function applyProfileMini(options) {
    const opts = options || {};
    const nameEl = opts.nameId ? document.getElementById(opts.nameId) : null;
    const subtitleEl = opts.subtitleId ? document.getElementById(opts.subtitleId) : null;
    const avatarImgEl = opts.avatarImgId ? document.getElementById(opts.avatarImgId) : null;
    const avatarInitialEl = opts.avatarInitialId ? document.getElementById(opts.avatarInitialId) : null;

    const fallbackName = String(opts.fallbackName || 'Member');
    const displayName = String(opts.name || fallbackName).trim() || fallbackName;
    const displaySubtitle = opts.subtitle;
    const avatarUrl = String(opts.avatarUrl || '').trim();
    const avatarInitial = getAvatarInitial(displayName);

    if (nameEl) {
      nameEl.textContent = displayName;
    }

    if (subtitleEl && typeof displaySubtitle === 'string') {
      subtitleEl.textContent = displaySubtitle;
    }

    if (avatarImgEl) {
      avatarImgEl.src = avatarUrl || getDefaultAvatarDataUri(avatarInitial);
      avatarImgEl.classList.remove('hidden');
    }

    if (avatarInitialEl) {
      avatarInitialEl.textContent = avatarInitial;
      avatarInitialEl.classList.add('hidden');
    }
  }

  function normalizeRole(role) {
    const value = String(role || 'member').toLowerCase();
    if (value === 'staff') return 'admin';
    if (value === 'admin' || value === 'trainer') return value;
    return 'member';
  }

  function normalizePath(path) {
    return String(path || '').split('?')[0].toLowerCase();
  }

  function isActiveLink(linkHref, activeHref) {
    return normalizePath(linkHref) === normalizePath(activeHref);
  }

  function linkMarkup(link, activeHref) {
    const classes = [
      'site-nav-link',
      link.emphasis ? 'emphasis' : '',
      isActiveLink(link.href, activeHref) ? 'is-active' : ''
    ].filter(Boolean).join(' ');

    const idAttr = link.id ? ` id="${link.id}"` : '';

    return `
      <a${idAttr} class="${classes}" href="${link.href}">
        <span class="link-left">
          <span class="material-symbols-outlined" style="font-size: 20px;">${link.icon}</span>
          <span>${link.label}</span>
        </span>
        <span class="material-symbols-outlined link-arrow" style="font-size: 18px;">arrow_outward</span>
      </a>
    `;
  }

  function getRoleLinks(role) {
    const resolvedRole = normalizeRole(role);

    if (resolvedRole === 'admin') {
      return [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { label: 'Timetable', href: 'Timetable.html', icon: 'event_note' },
        { label: 'Trainer Assignment', href: 'assign-trainer.html', icon: 'manage_accounts', emphasis: true },
        { label: 'Manage Timetable', href: 'StaffClass.html', icon: 'edit_calendar', emphasis: true },
        { label: 'Edit Classes', href: 'StaffEdit.html', icon: 'update', emphasis: true },
        { label: 'Trainer Report', href: 'trainer-report.html', icon: 'summarize' },
        { label: 'Profile', href: 'profile.html', icon: 'settings' }
      ];
    }

    if (resolvedRole === 'trainer') {
      return [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { label: 'Timetable', href: 'Timetable.html', icon: 'event_note' },
        { label: 'My Schedule', href: 'trainer-schedule.html', icon: 'event_available', emphasis: true },
        { label: 'Trainer Report', href: 'trainer-report.html', icon: 'summarize' },
        { label: 'Profile', href: 'profile.html', icon: 'settings' }
      ];
    }

    return [
      { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
      { label: 'Memberships', href: 'membership.html', icon: 'card_membership' },
      { label: 'Timetable', href: 'Timetable.html', icon: 'event_note' },
      { label: 'Profile', href: 'profile.html', icon: 'person' }
    ];
  }

  function getPublicLinks() {
    return [
      { label: 'Home', href: 'index.html', icon: 'home' },
      { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
      { label: 'Memberships', href: 'membership.html', icon: 'card_membership' },
      { label: 'Timetable', href: 'Timetable.html', icon: 'event_note' }
    ];
  }

  function resolveNavElement(navOrId) {
    if (!navOrId) return null;
    if (typeof navOrId === 'string') return document.getElementById(navOrId);
    return navOrId;
  }

  function renderLinks(options) {
    const nav = resolveNavElement(options.navId || options.nav);
    if (!nav) return;

    const links = options.links || [];
    const activeHref = options.activeHref || options.active || '';
    nav.innerHTML = links.map(link => linkMarkup(link, activeHref)).join('');
  }

  function renderRoleMenu(options) {
    renderLinks({
      navId: options.navId || options.nav,
      links: getRoleLinks(options.role || 'member'),
      activeHref: options.activeHref || options.active
    });
  }

  function renderPublicMenu(options) {
    renderLinks({
      navId: options.navId || options.nav,
      links: getPublicLinks(),
      activeHref: options.activeHref || options.active
    });
  }

  function initMenuNav(options) {
    const opts = options || {};
    const toggleBtn = document.getElementById(opts.toggleId || 'menu-toggle');
    const panel = document.getElementById(opts.panelId || 'menu-panel');
    const icon = document.getElementById(opts.iconId || 'menu-icon');

    if (!toggleBtn || !panel || !icon) return;
    if (toggleBtn.dataset.navInit === 'true') return;

    const setOpenState = (isOpen) => {
      panel.classList.toggle('hidden', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      icon.innerText = isOpen ? 'close' : 'menu';
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      setOpenState(!isOpen);
    });

    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        setOpenState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpenState(false);
    });

    toggleBtn.dataset.navInit = 'true';
  }

  global.GymflowNav = {
    normalizeRole,
    getRoleLabel,
    getRoleLinks,
    getPublicLinks,
    applyProfileMini,
    renderLinks,
    renderRoleMenu,
    renderPublicMenu,
    initMenuNav
  };
})(window);
