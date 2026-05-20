(function () {
  const STAFF_ACCENT = "#00E0FF";
  const DEFAULT_FOOTER_MARKUP = `
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <p class="font-headline text-2xl font-black text-primary uppercase tracking-tight">GymFlow</p>
          <p class="text-on-surface-variant text-sm mt-3 max-w-md">
            Flexible memberships, modern equipment, and expert support for every training level.
          </p>
        </div>
        <div class="md:text-right space-y-4">
          <div class="flex flex-wrap gap-6 md:justify-end text-[11px] font-bold uppercase tracking-widest">
            <a class="text-on-surface-variant hover:text-primary transition-colors" href="index.html">Home</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors" href="membership.html">Memberships</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors" href="Timetable.html">Timetable</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors" href="dashboard.html">Dashboard</a>
            <a class="text-on-surface-variant hover:text-primary transition-colors" href="login.html">Staff Login</a>
          </div>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">© ${new Date().getFullYear()} GymFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const BASE_TAILWIND_CONFIG = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: "var(--primary-color, #00E0FF)",
          "on-primary": "#0e0e0e",
          background: "#0e0e0e",
          surface: "#131313",
          "surface-variant": "#1a1a1a",
          outline: "#404040",
          "on-surface": "#ffffff",
          "on-surface-variant": "#a3a3a3"
        },
        fontFamily: {
          headline: ["Lexend", "sans-serif"],
          body: ["Inter", "sans-serif"],
          label: ["Inter", "sans-serif"]
        },
        borderRadius: {
          DEFAULT: "0px",
          lg: "0px",
          xl: "0px",
          full: "9999px"
        }
      }
    }
  };

  function cloneConfig(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function deepMerge(target, source) {
    Object.keys(source).forEach(function (key) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        deepMerge(targetValue, sourceValue);
        return;
      }

      target[key] = sourceValue;
    });

    return target;
  }

  function ensureGlobalFooter(options) {
    const opts = options || {};
    const body = document.body;
    if (!body) return null;
    if (body.dataset.hideGlobalFooter === "true") return null;

    let footer = document.getElementById("gymflow-global-footer");
    if (footer) return footer;

    const existingFooters = Array.from(document.querySelectorAll("footer"));
    if (existingFooters.length > 0) {
      return existingFooters[existingFooters.length - 1];
    }

    footer = document.createElement("footer");
    footer.id = "gymflow-global-footer";
    footer.className = "bg-black border-t border-white/10 mt-16 relative z-20";
    footer.innerHTML = opts.markup || DEFAULT_FOOTER_MARKUP;
    body.appendChild(footer);
    return footer;
  }

  function initGlobalFooter() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        ensureGlobalFooter();
      }, { once: true });
      return;
    }

    ensureGlobalFooter();
  }

  window.applyGymflowTailwindConfig = function applyGymflowTailwindConfig(overrides) {
    const config = cloneConfig(BASE_TAILWIND_CONFIG);

    if (isPlainObject(overrides)) {
      deepMerge(config, overrides);
    }

    tailwind.config = config;
    return config;
  };

  window.GymflowTheme = {
    staffAccent: STAFF_ACCENT,
    applyStaffAccent: function applyStaffAccent() {
      document.documentElement.style.setProperty("--primary-color", STAFF_ACCENT);
      return STAFF_ACCENT;
    },
    injectGlobalFooter: ensureGlobalFooter
  };

  initGlobalFooter();
})();
