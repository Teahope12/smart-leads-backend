export const UserRole = {
  ADMIN: 'Admin',
  SALES_USER: 'Sales User'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];