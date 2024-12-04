import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export const hashedPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};
