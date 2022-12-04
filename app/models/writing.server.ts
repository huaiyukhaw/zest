import { json } from "@remix-run/node";
import type { Writing } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";

export type { Writing } from "@prisma/client";
export type WritingNotFoundResponse = ThrownResponse<404, string>;

export const getAllWritingByUsername = async ({
  profileUsername,
  published,
}: Pick<Writing, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.writing.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getWriting = async (id: Writing["id"]) => {
  return prisma.writing.findUnique({
    where: {
      id,
    },
  });
};

export const getWritingOrThrow = async (id: Writing["id"]) => {
  const writing = await prisma.writing.findUnique({
    where: {
      id,
    },
  });
  if (!writing) {
    throw json(`Writing not found`, { status: 404 });
  }
  return writing;
};

export const deleteWriting = async (id: Writing["id"]) => {
  return prisma.writing.delete({
    where: {
      id,
    },
  });
};

export const publishWriting = async (id: Writing["id"]) => {
  return prisma.writing.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishWriting = async (id: Writing["id"]) => {
  return prisma.writing.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateWriting = async ({
  id,
  title,
  year,
  publisher,
  url,
  description,
  published,
}: Pick<
  Writing,
  "id" | "title" | "year" | "publisher" | "url" | "description" | "published"
>) => {
  return prisma.writing.update({
    data: {
      title,
      year,
      publisher,
      url,
      description,
      published,
    },
    where: {
      id: id,
    },
  });
};

export const createWriting = async ({
  title,
  year,
  publisher,
  url,
  description,
  profileUsername,
}: Pick<
  Writing,
  "title" | "year" | "publisher" | "url" | "description" | "profileUsername"
>) => {
  return prisma.writing.create({
    data: {
      title,
      year,
      publisher,
      url,
      description,
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
