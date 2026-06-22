export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export type UserRole = 'user' | 'Admin';

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailDto {
  newEmail: string;
  password: string;
}
