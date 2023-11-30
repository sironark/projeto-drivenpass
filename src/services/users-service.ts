import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { duplicatedEmailError } from '@/errors/duplicate-email-error';
import { userRepository } from '@/repositories/users-repository';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;

export const userService = {
  createUser,
};
