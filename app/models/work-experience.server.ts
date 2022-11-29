import { json } from "@remix-run/node";
import type { WorkExperience } from "@prisma/client";
export type { WorkExperience } from "@prisma/client";
import { prisma } from "~/db.server";
import { ThrownResponse } from "@remix-run/react";

export type WorkExperienceNotFoundResponse = ThrownResponse<404, string>;

export const getAllWorkExperienceByUsername = async ({
  profileUsername,
  published,
}: Pick<WorkExperience, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.workExperience.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
  });
};

export const getWorkExperience = async (id: WorkExperience["id"]) => {
  return prisma.workExperience.findUnique({
    where: {
      id,
    },
  });
};

export const getWorkExperienceOrThrow = async (id: WorkExperience["id"]) => {
  const workExperience = await prisma.workExperience.findUnique({
    where: {
      id,
    },
  });
  if (!workExperience) {
    throw json(`WorkExperience not found`, { status: 404 });
  }
  return workExperience;
};

export const deleteWorkExperience = async (id: WorkExperience["id"]) => {
  return prisma.workExperience.delete({
    where: {
      id,
    },
  });
};

export const publishWorkExperience = async (id: WorkExperience["id"]) => {
  return prisma.workExperience.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishWorkExperience = async (id: WorkExperience["id"]) => {
  return prisma.workExperience.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateWorkExperience = async ({
  id,
  from,
  to,
  title,
  company,
  location,
  url,
  description,
  published,
}: Pick<
  WorkExperience,
  | "id"
  | "from"
  | "to"
  | "title"
  | "company"
  | "location"
  | "url"
  | "description"
  | "published"
>) => {
  return prisma.workExperience.update({
    data: {
      from,
      to,
      title,
      company,
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

export const createWorkExperience = async ({
  from,
  to,
  title,
  company,
  location,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  WorkExperience,
  | "from"
  | "to"
  | "title"
  | "company"
  | "location"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.workExperience.create({
    data: {
      from,
      to,
      title,
      company,
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
