(function registerGymflowSupabase(global) {
  const SUPABASE_URL = 'https://pawooalkgiveltrbylqe.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_T-l5NHtJlVXELrzRoeAlzg_bzJ6F2pR';

  function createClient() {
    if (!global.supabase || typeof global.supabase.createClient !== 'function') {
      throw new Error('Supabase client library is not loaded.');
    }

    return global.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async function getSession(client) {
    if (!client || !client.auth || typeof client.auth.getSession !== 'function') {
      return null;
    }

    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error('Session check failed:', error.message || error);
      return null;
    }

    return data && data.session ? data.session : null;
  }

  async function requireSession(client, redirectPath) {
    const session = await getSession(client);
    if (session) return session;

    if (redirectPath) {
      global.location.replace(redirectPath);
    }

    return null;
  }

  async function resolveUserRole(client, user) {
    if (!global.GymflowRoles || typeof global.GymflowRoles.resolveUserRole !== 'function') {
      return 'member';
    }

    return global.GymflowRoles.resolveUserRole(client, user);
  }

  function bindLogoutButton(client, options) {
    if (!global.document || !client?.auth || typeof client.auth.signOut !== 'function') {
      return null;
    }

    const opts = options || {};
    const buttonId = opts.buttonId || 'logout-btn';
    const redirectPath = opts.redirectPath || 'login.html';
    const button = global.document.getElementById(buttonId);
    if (!button || button.dataset.logoutBound === 'true') {
      return button;
    }

    button.addEventListener('click', async () => {
      if (typeof opts.shouldSkipSignOut === 'function' && opts.shouldSkipSignOut()) {
        global.location.replace(redirectPath);
        return;
      }

      await client.auth.signOut();

      if (typeof opts.onSignedOut === 'function') {
        opts.onSignedOut();
      }

      global.location.replace(redirectPath);
    });

    button.dataset.logoutBound = 'true';
    return button;
  }

  global.GymflowSupabase = {
    SUPABASE_URL,
    SUPABASE_KEY,
    createClient,
    getSession,
    requireSession,
    resolveUserRole,
    bindLogoutButton,
  };
})(window);
