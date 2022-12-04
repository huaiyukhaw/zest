import { json } from "@remix-run/node";
import type { Feature } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";

export type { Feature } from "@prisma/client";
export type FeatureNotFoundResponse = ThrownResponse<404, string>;

export const getAllFeaturesByUsername = async ({
  profileUsername,
  published,
}: Pick<Feature, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.feature.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getFeature = async (id: Feature["id"]) => {
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

export const deleteFeature = async (id: Feature["id"]) => {
  return prisma.feature.delete({
    where: {
      id,
    },
  });
};

export const publishFeature = async (id: Feature["id"]) => {
  return prisma.feature.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishFeature = async (id: Feature["id"]) => {
  return prisma.feature.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateFeature = async ({
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

export const createFeature = async ({
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
