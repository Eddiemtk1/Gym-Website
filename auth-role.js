(function registerGymflowRoleHelpers(global) {
  const VALID_ROLES = new Set(['admin', 'staff', 'trainer', 'member']);

  function normalizeRole(value) {
    const role = String(value || '').toLowerCase();
    if (!VALID_ROLES.has(role)) return null;
    return role === 'staff' ? 'admin' : role;
  }

  function getHomeRoute(role) {
    const normalizedRole = normalizeRole(role) || 'member';
    if (normalizedRole === 'admin') return 'assign-trainer.html';
    if (normalizedRole === 'trainer') return 'trainer-schedule.html';
    return 'dashboard.html';
  }

  async function resolveUserRole(db, user) {
    if (!db || !user?.id) return 'member';

    const { data: profile, error: profileError } = await db
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const profileRole = profileError ? null : normalizeRole(profile?.role);
    if (profileRole) return profileRole;

    const metadataRole = normalizeRole(user?.user_metadata?.role || user?.app_metadata?.role);
    if (metadataRole) return metadataRole;

    const { data: trainer } = await db
      .from('trainers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    return trainer ? 'trainer' : 'member';
  }

  async function redirectToRoleHome(db, user) {
    const role = await resolveUserRole(db, user);
    global.location.replace(getHomeRoute(role));
    return role;
  }

  global.GymflowRoles = {
    normalizeRole,
    getHomeRoute,
    resolveUserRole,
    redirectToRoleHome,
  };
})(window);
