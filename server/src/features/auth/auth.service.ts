import { prisma } from "../../config/db";
import { comparePasswod, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { publicUserSelect } from "../../utils/userSelect";

type registerPayloadType = {
  name: string;
  email: string;
  password: string;
};

type loginPayloadType = {
  email: string;
  password: string;
};

export const registerUser = async (data: registerPayloadType) => {
  const isExistingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (isExistingUser) {
    throw new Error("User already Exists");
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: publicUserSelect,
  });

  return { user };
};

export const loginUser = async (data: loginPayloadType) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user)
    throw new Error(
      "Are you sure you registered and entered Valid Credentials",
    );

  const isValid = await comparePasswod(data.password, user.password);

  if (!isValid) throw new Error("Invalid credentials");

  const token = signToken({ userId: user.id });

  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: publicUserSelect,
  });

  return { user: safeUser!, token };
};

type UpdateProfileInput = {
  name?: string;
  avatarUrl?: string;
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: publicUserSelect,
  });
};
