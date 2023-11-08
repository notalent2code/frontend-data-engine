import { User } from '@prisma/client';

export type UserSession = Pick<
  User,
  'id' | 'first_name' | 'last_name' | 'email' | 'role'
>;
