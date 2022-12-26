import { json } from "@remix-run/node";
import type { Exhibition, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Exhibition } from "@prisma/client";
export type ExhibitionNotFoundResponse = ThrownResponse<404, string>;

export type ExhibitionsWithPostsIncluded = Array<
  Prisma.ExhibitionGetPayload<{
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

export const getAllExhibitionsByUsername = ({
  profileUsername,
  published,
}: Pick<Exhibition, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.exhibition.findMany({
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

export const getExhibition = (id: Exhibition["id"]) => {
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

export const deleteExhibition = (id: Exhibition["id"]) => {
  return prisma.exhibition.delete({
    where: {
      id,
    },
  });
};

export const publishExhibition = (id: Exhibition["id"]) => {
  return prisma.exhibition.update({
    data: {
      published: true,
    },
    where: {
      id,
    },
  });
};

export const unpublishExhibition = (id: Exhibition["id"]) => {
  return prisma.exhibition.update({
    data: {
      published: false,
    },
    where: {
      id,
    },
  });
};

export const updateExhibition = ({
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
      id,
    },
  });
};

export const createExhibition = ({
  title,
  year,
  venue,
  location,
  url,
  description,
  profileUsername,
}: Pick<
  Exhibition,
  | "title"
  | "year"
  | "venue"
  | "location"
  | "url"
  | "description"
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
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
