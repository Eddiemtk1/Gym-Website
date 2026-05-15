(function () {
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

  window.applyGymflowTailwindConfig = function applyGymflowTailwindConfig(overrides) {
    const config = cloneConfig(BASE_TAILWIND_CONFIG);

    if (isPlainObject(overrides)) {
      deepMerge(config, overrides);
    }

    tailwind.config = config;
    return config;
  };
})();
