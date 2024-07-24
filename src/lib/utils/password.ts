import argon2 from 'argon2';

export async function saltAndHashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return argon2.verify(hashedPassword, password);
}