import { json } from "@remix-run/node";
import type { Link } from "@prisma/client";
export type { Link } from "@prisma/client";
import { prisma } from "~/db.server";
import { ThrownResponse } from "@remix-run/react";

export type LinkNotFoundResponse = ThrownResponse<404, string>;

export const getAllLinksByUsername = async ({
  profileUsername,
  published,
}: Pick<Link, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.link.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getLink = async (id: Link["id"]) => {
  return prisma.link.findUnique({
    where: {
      id,
    },
  });
};

export const getLinkOrThrow = async (id: Link["id"]) => {
  const link = await prisma.link.findUnique({
    where: {
      id,
    },
  });
  if (!link) {
    throw json(`Link not found`, { status: 404 });
  }
  return link;
};

export const deleteLink = async (id: Link["id"]) => {
  return prisma.link.delete({
    where: {
      id,
    },
  });
};

export const publishLink = async (id: Link["id"]) => {
  return prisma.link.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishLink = async (id: Link["id"]) => {
  return prisma.link.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateLink = async ({
  id,
  name,
  username,
  url,
  published,
}: Pick<Link, "id" | "name" | "username" | "url" | "published">) => {
  return prisma.link.update({
    data: {
      name,
      username,
      url,
      published,
    },
    where: {
      id: id,
    },
  });
};

export const createLink = async ({
  name,
  username,
  url,
  published,
  profileUsername,
}: Pick<
  Link,
  "name" | "username" | "url" | "published" | "profileUsername"
>) => {
  return prisma.link.create({
    data: {
      name,
      username,
      url,
      published,
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
