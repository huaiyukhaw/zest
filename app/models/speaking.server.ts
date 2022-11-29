import { json } from "@remix-run/node";
import type { Speaking } from "@prisma/client";
export type { Speaking } from "@prisma/client";
import { prisma } from "~/db.server";
import { ThrownResponse } from "@remix-run/react";

export type SpeakingNotFoundResponse = ThrownResponse<404, string>;

export const getAllSpeakingByUsername = async ({
  profileUsername,
  published,
}: Pick<Speaking, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.speaking.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getSpeaking = async (id: Speaking["id"]) => {
  return prisma.speaking.findUnique({
    where: {
      id,
    },
  });
};

export const getSpeakingOrThrow = async (id: Speaking["id"]) => {
  const speaking = await prisma.speaking.findUnique({
    where: {
      id,
    },
  });
  if (!speaking) {
    throw json(`Speaking not found`, { status: 404 });
  }
  return speaking;
};

export const deleteSpeaking = async (id: Speaking["id"]) => {
  return prisma.speaking.delete({
    where: {
      id,
    },
  });
};

export const publishSpeaking = async (id: Speaking["id"]) => {
  return prisma.speaking.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishSpeaking = async (id: Speaking["id"]) => {
  return prisma.speaking.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateSpeaking = async ({
  id,
  title,
  year,
  event,
  location,
  url,
  description,
  published,
}: Pick<
  Speaking,
  | "id"
  | "title"
  | "year"
  | "event"
  | "location"
  | "url"
  | "description"
  | "published"
>) => {
  return prisma.speaking.update({
    data: {
      title,
      year,
      event,
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

export const createSpeaking = async ({
  title,
  year,
  event,
  location,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  Speaking,
  | "title"
  | "year"
  | "event"
  | "location"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.speaking.create({
    data: {
      title,
      year,
      event,
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
