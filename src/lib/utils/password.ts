import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10;

export async function saltAndHashPassword(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
}

export async function comparePassword(password: string, hashedPass: string) {
    return bcrypt.compare(password, hashedPass);
}