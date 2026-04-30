import bcrypt from "bcrypt";

const salt = 10;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, salt);
};

export const comparePasswod = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};
