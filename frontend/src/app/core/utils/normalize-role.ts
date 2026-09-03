import { Role } from '../models/models';

const CANONICAL_ROLES: Role[] = ['super_admin', 'admin', 'member', 'trainer'];

/**
 * Maps any casing/formatting variant of a role (e.g. "admin", "super_admin",
 * "TRAINER") coming back from the API to its canonical value, so role-based
 * UI (sidebar, guards, chips) matches correctly regardless of how the role
 * was stored in the database.
 */
export function normalizeRole(role: string | null | undefined): Role | null {
  if (!role) return null;
  const key = String(role).trim().toLowerCase().replace(/[_\s]+/g, ' ');
  const match = CANONICAL_ROLES.find((r) => r.toLowerCase() === key);
  return match ?? (role as Role);
}
