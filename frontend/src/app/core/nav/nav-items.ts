import { Role } from '../models/models';

export interface NavItem {
  label: string;
  icon: string;         // Material icon name
  route: string;
  roles: (Role | string)[]; // which roles see this item
}

/** Sidebar menu. Each item is filtered by the logged-in user's role. */
export const NAV_ITEMS: NavItem[] = [
  // 1. Super Admin Dashboard (Restricted to Super Admin only)
  {
    label: 'Dashboard',
    icon: 'grid_view',
    route: '/dashboard',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin']
  },

  // 2. Members Management
  {
    label: 'Members',
    icon: 'group',
    route: '/members',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin']
  },

  // 3. Trainers Management
  {
    label: 'Trainers',
    icon: 'sports',
    route: '/members/trainers',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin']
  },

  { label: 'My Members', icon: 'group', route: '/my-members',
    roles: ['Trainer'] },

  { label: 'Classes', icon: 'fitness_center', route: '/classes',
    roles: ['Super Admin', 'Admin', 'Member', 'Trainer'] },

  { label: 'My Classes', icon: 'event_available', route: '/classes/mine',
    roles: ['Member'] },

  { label: 'Workout Plans', icon: 'assignment', route: '/workouts',
    roles: ['Super Admin', 'Admin', 'Member', 'Trainer'] },

  // 6. Attendance
  {
    label: 'Attendance',
    icon: 'how_to_reg',
    route: '/attendance',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin', 'Member', 'member', 'Trainer', 'trainer']
  },

  // 7. Membership Plans
  {
    label: 'Membership Plans',
    icon: 'card_membership',
    route: '/plans',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin', 'Member', 'member']
  },

  // 8. Subscriptions
  {
    label: 'Subscriptions',
    icon: 'autorenew',
    route: '/subscriptions',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin', 'Member', 'member']
  },

  // 9. Payments
  {
    label: 'Payments',
    icon: 'payments',
    route: '/payments',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin']
  },

  // 10. Health Records
  {
    label: 'Health Records',
    icon: 'monitor_heart',
    route: '/health',
    roles: ['Super Admin', 'super_admin', 'Admin', 'admin', 'Member', 'member']
  },
];

/** Filters navigation items for the given role safely with case-insensitive check */
export function navForRole(role: Role | string | null): NavItem[] {
  if (!role) return [];

  const normalizedUserRole = role.toString().toLowerCase().replace(/\s+/g, '_');

  return NAV_ITEMS.filter((item) =>
    item.roles.some((r) => r.toString().toLowerCase().replace(/\s+/g, '_') === normalizedUserRole)
  );
}