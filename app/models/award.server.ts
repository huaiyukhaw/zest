import { json } from "@remix-run/node";
import type { Award } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";

export type { Award } from "@prisma/client";
export type AwardNotFoundResponse = ThrownResponse<404, string>;

export const getAllAwardsByUsername = async ({
  profileUsername,
  published,
}: Pick<Award, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.award.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getAward = async (id: Award["id"]) => {
  return prisma.award.findUnique({
    where: {
      id,
    },
  });
};

export const getAwardOrThrow = async (id: Award["id"]) => {
  const award = await prisma.award.findUnique({
    where: {
      id,
    },
  });
  if (!award) {
    throw json(`Award not found`, { status: 404 });
  }
  return award;
};

export const deleteAward = async (id: Award["id"]) => {
  return prisma.award.delete({
    where: {
      id,
    },
  });
};

export const publishAward = async (id: Award["id"]) => {
  return prisma.award.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishAward = async (id: Award["id"]) => {
  return prisma.award.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateAward = async ({
  id,
  title,
  year,
  presenter,
  url,
  description,
  published,
}: Pick<
  Award,
  "id" | "title" | "year" | "presenter" | "url" | "description" | "published"
>) => {
  return prisma.award.update({
    data: {
      title,
      year,
      presenter,
      url,
      description,
      published,
    },
    where: {
      id: id,
    },
  });
};

export const createAward = async ({
  title,
  year,
  presenter,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  Award,
  | "title"
  | "year"
  | "presenter"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.award.create({
    data: {
      title,
      year,
      presenter,
      url,
      description,
      published,
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
