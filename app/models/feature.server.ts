import { json } from "@remix-run/node";
import type { Feature, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Feature } from "@prisma/client";
export type FeatureNotFoundResponse = ThrownResponse<404, string>;

export type FeaturesWithPostsIncluded = Array<
  Prisma.FeatureGetPayload<{
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

export const getAllFeaturesByUsername = ({
  profileUsername,
  published,
}: Pick<Feature, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.feature.findMany({
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

export const getFeature = (id: Feature["id"]) => {
  return prisma.feature.findUnique({
    where: {
      id,
    },
  });
};

export const getFeatureOrThrow = async (id: Feature["id"]) => {
  const feature = await prisma.feature.findUnique({
    where: {
      id,
    },
  });
  if (!feature) {
    throw json(`Feature not found`, { status: 404 });
  }
  return feature;
};

export const deleteFeature = (id: Feature["id"]) => {
  return prisma.feature.delete({
    where: {
      id,
    },
  });
};

export const publishFeature = (id: Feature["id"]) => {
  return prisma.feature.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishFeature = (id: Feature["id"]) => {
  return prisma.feature.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateFeature = ({
  id,
  title,
  year,
  publisher,
  url,
  description,
  published,
}: Pick<
  Feature,
  "id" | "title" | "year" | "publisher" | "url" | "description" | "published"
>) => {
  return prisma.feature.update({
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

export const createFeature = ({
  title,
  year,
  publisher,
  url,
  description,
  profileUsername,
}: Pick<
  Feature,
  "title" | "year" | "publisher" | "url" | "description" | "profileUsername"
>) => {
  return prisma.feature.create({
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
