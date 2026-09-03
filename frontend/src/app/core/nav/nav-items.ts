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
    route: '/dashboard/admin',
    roles: ['super_admin', 'admin']
  },
  // {
  //   label: 'Dashboard',
  //   icon: 'grid_view',
  //   route: '/dashboard/trainer',
  //   roles: ['trainer', 'trainer']
  // },
  // {
  //   label: 'Dashboard',
  //   icon: 'grid_view',
  //   route: '/dashboard/member',
  //   roles: ['member', 'member']
  // },
  // 2. Members Management
  {
    label: 'Members',
    icon: 'group',
    route: '/members',
    roles: ['super_admin', 'super_admin', 'admin', 'admin']
  },

  // 3. Trainers Management
  {
    label: 'Trainers',
    icon: 'sports',
    route: '/members/trainers',
    roles: ['super_admin', 'super_admin', 'admin', 'admin']
  },

  { label: 'My Members', icon: 'group', route: '/my-members',
    roles: ['trainer'] },

  { label: 'Classes', icon: 'fitness_center', route: '/classes',
    roles: ['super_admin', 'admin', 'member', 'trainer'] },

  { label: 'My Classes', icon: 'event_available', route: '/classes/mine',
    roles: ['member'] },

  { label: 'Workout Plans', icon: 'assignment', route: '/workouts',
    roles: ['super_admin', 'admin', 'member', 'trainer'] },

  // 6. Health Records
  {
    label: 'Attendance',
    icon: 'how_to_reg',
    route: '/attendance',
    roles: ['super_admin', 'super_admin', 'admin', 'admin', 'member', 'member', 'trainer', 'trainer']
  },

  // 7. Membership Plans
  {
    label: 'Membership Plans',
    icon: 'card_membership',
    route: '/plans',
    roles: ['super_admin', 'super_admin', 'admin', 'admin', 'member', 'member']
  },

  // 8. Subscriptions
  {
    label: 'Subscriptions',
    icon: 'autorenew',
    route: '/subscriptions',
    roles: ['super_admin', 'super_admin', 'admin', 'admin', 'member', 'member']
  },

  // 9. Payments
  {
    label: 'Payments',
    icon: 'payments',
    route: '/payments',
    roles: ['super_admin', 'super_admin', 'admin', 'admin']
  },

  // 10. Attendance
  {
    label: 'Health Records',
    icon: 'monitor_heart',
    route: '/health',
    roles: ['super_admin', 'super_admin', 'admin', 'admin', 'member', 'member']
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