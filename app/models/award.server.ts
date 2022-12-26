import { json } from "@remix-run/node";
import type { Award, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Award } from "@prisma/client";
export type AwardNotFoundResponse = ThrownResponse<404, string>;

export type AwardsWithPostsIncluded = Array<
  Prisma.AwardGetPayload<{
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

export const getAllAwardsByUsername = ({
  profileUsername,
  published,
}: Pick<Award, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.award.findMany({
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

export const getAward = (id: Award["id"]) => {
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

export const deleteAward = (id: Award["id"]) => {
  return prisma.award.delete({
    where: {
      id,
    },
  });
};

export const publishAward = (id: Award["id"]) => {
  return prisma.award.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishAward = (id: Award["id"]) => {
  return prisma.award.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateAward = ({
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

export const createAward = ({
  title,
  year,
  presenter,
  url,
  description,
  profileUsername,
}: Pick<
  Award,
  "title" | "year" | "presenter" | "url" | "description" | "profileUsername"
>) => {
  return prisma.award.create({
    data: {
      title,
      year,
      presenter,
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
