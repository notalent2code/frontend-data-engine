import { User } from '@prisma/client';

export type Session = Pick<
  User,
  'id' | 'first_name' | 'last_name' | 'email' | 'role'
> & {
  token: string;
};
