export const ROLE_LEVEL = {
  super_admin: 7,
  admin: 6,
  tv_admin: 5,
  editor: 4,
  tv_operator: 3,
  reporter: 2,
  advertiser: 1,
}

export function canManage(currentRole, targetRole) {
  return ROLE_LEVEL[currentRole] > ROLE_LEVEL[targetRole]
}