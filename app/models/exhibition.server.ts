import { json } from "@remix-run/node";
import type { Exhibition } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";

export type { Exhibition } from "@prisma/client";
export type ExhibitionNotFoundResponse = ThrownResponse<404, string>;

export const getAllExhibitionsByUsername = async ({
  profileUsername,
  published,
}: Pick<Exhibition, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.exhibition.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getExhibition = async (id: Exhibition["id"]) => {
  return prisma.exhibition.findUnique({
    where: {
      id,
    },
  });
};

export const getExhibitionOrThrow = async (id: Exhibition["id"]) => {
  const exhibition = await prisma.exhibition.findUnique({
    where: {
      id,
    },
  });
  if (!exhibition) {
    throw json(`Exhibition not found`, { status: 404 });
  }
  return exhibition;
};

export const deleteExhibition = async (id: Exhibition["id"]) => {
  return prisma.exhibition.delete({
    where: {
      id,
    },
  });
};

export const publishExhibition = async (id: Exhibition["id"]) => {
  return prisma.exhibition.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishExhibition = async (id: Exhibition["id"]) => {
  return prisma.exhibition.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateExhibition = async ({
  id,
  title,
  year,
  venue,
  location,
  url,
  description,
  published,
}: Pick<
  Exhibition,
  | "id"
  | "title"
  | "year"
  | "venue"
  | "location"
  | "url"
  | "description"
  | "published"
>) => {
  return prisma.exhibition.update({
    data: {
      title,
      year,
      venue,
      location,
      url,
      description,
      published,
    },
    where: {
      id: id,
    },
  });
};

export const createExhibition = async ({
  title,
  year,
  venue,
  location,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  Exhibition,
  | "title"
  | "year"
  | "venue"
  | "location"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.exhibition.create({
    data: {
      title,
      year,
      venue,
      location,
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
