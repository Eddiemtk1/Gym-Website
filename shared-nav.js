(function registerGymflowNav(global) {
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
      link.hidden ? 'hidden' : '',
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
    if (role === 'trainer' || role === 'admin' || role === 'staff') {
      return [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { label: 'Timetable', href: 'Timetable.html', icon: 'event_note' },
        { label: 'Manage Timetable', href: 'StaffClass.html', icon: 'edit_calendar', emphasis: true },
        { label: 'Edit Classes', href: 'StaffEdit.html', icon: 'update', emphasis: true },
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
    getRoleLinks,
    getPublicLinks,
    renderLinks,
    renderRoleMenu,
    renderPublicMenu,
    initMenuNav
  };
})(window);
