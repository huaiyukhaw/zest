import { json } from "@remix-run/node";
import type { Prisma, Speaking } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Speaking } from "@prisma/client";
export type SpeakingNotFoundResponse = ThrownResponse<404, string>;

export type SpeakingWithPostsIncluded = Array<
  Prisma.SpeakingGetPayload<{
    include: {
      posts: {
        include: {
          post: {
            select: {
              title: true;
              content: true;
              published: true;
            };
          };
        };
      };
    };
  }>
>;

export const getAllSpeakingByUsername = ({
  profileUsername,
  published,
}: Pick<Speaking, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.speaking.findMany({
    include: {
      posts: {
        include: {
          post: {
            select: {
              title: true,
              content: true,
              published: true,
            },
          },
        },
        orderBy: {
          assignedAt: "desc",
        },
      },
    },
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getSpeaking = (id: Speaking["id"]) => {
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

export const deleteSpeaking = (id: Speaking["id"]) => {
  return prisma.speaking.delete({
    where: {
      id,
    },
  });
};

export const publishSpeaking = (id: Speaking["id"]) => {
  return prisma.speaking.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishSpeaking = (id: Speaking["id"]) => {
  return prisma.speaking.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateSpeaking = ({
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

export const createSpeaking = ({
  title,
  year,
  event,
  location,
  url,
  description,
  profileUsername,
}: Pick<
  Speaking,
  | "title"
  | "year"
  | "event"
  | "location"
  | "url"
  | "description"
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
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
