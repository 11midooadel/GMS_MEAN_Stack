import { Role } from '../models/models';

export interface NavItem {
  label: string;
  icon: string;         // Material icon name
  route: string;
  roles: Role[];        // which roles see this item
}

/** Sidebar menu. Each item is filtered by the logged-in user's role. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'grid_view', route: '/dashboard',
    roles: ['Super Admin', 'Admin', 'Member', 'Trainer'] },

  { label: 'Members', icon: 'group', route: '/members',
    roles: ['Super Admin', 'Admin'] },

  { label: 'Trainers', icon: 'sports', route: '/members/trainers',
    roles: ['Super Admin', 'Admin'] },

  { label: 'My Members', icon: 'group', route: '/my-members',
    roles: ['Trainer'] },

  { label: 'Classes', icon: 'fitness_center', route: '/classes',
    roles: ['Super Admin', 'Admin', 'Member', 'Trainer'] },

  { label: 'My Classes', icon: 'event_available', route: '/classes/mine',
    roles: ['Member'] },

  { label: 'Workout Plans', icon: 'assignment', route: '/workouts',
    roles: ['Super Admin', 'Admin', 'Member', 'Trainer'] },

  { label: 'Attendance', icon: 'how_to_reg', route: '/attendance',
    roles: ['Super Admin', 'Admin', 'Member', 'Trainer'] },

  { label: 'Membership Plans', icon: 'card_membership', route: '/plans',
    roles: ['Super Admin', 'Admin', 'Member'] },

  { label: 'Subscriptions', icon: 'autorenew', route: '/subscriptions',
    roles: ['Super Admin', 'Admin', 'Member'] },

  { label: 'Payments', icon: 'payments', route: '/payments',
    roles: ['Super Admin', 'Admin', 'Member'] },

  { label: 'Health Records', icon: 'monitor_heart', route: '/health',
    roles: ['Super Admin', 'Admin', 'Member'] },
];

export function navForRole(role: Role | null): NavItem[] {
  if (!role) return [];
  return NAV_ITEMS.filter((i) => i.roles.includes(role));
}
