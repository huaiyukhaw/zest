import type { Password, User } from "@prisma/client";
import type { ThrownResponse } from "@remix-run/react";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
export type UserNotFoundResponse = ThrownResponse<404, string>;

export const isEmailAvailable = async (email: User["email"]) => {
  const user = await getUserByEmail(email);

  return user ? false : true;
};

export const getUserById = (id: User["id"]) => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByIdOrThrow = async (id: User["id"]) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw json(`User not found`, { status: 404 });
  }
  return user;
};

export const getUserByEmail = (email: User["email"]) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserByEmailOrThrow = async (email: User["email"]) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw json(`User not found`, { status: 404 });
  }
  return user;
};

export const createUser = async (email: User["email"], password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
};

export const deleteUserByEmail = (email: User["email"]) => {
  return prisma.user.delete({ where: { email } });
};

export const verifyLogin = async (
  email: User["email"],
  password: Password["hash"]
) => {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
};
