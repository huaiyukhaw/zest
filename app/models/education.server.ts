import { json } from "@remix-run/node";
import type { Education } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";

export type { Education } from "@prisma/client";
export type EducationNotFoundResponse = ThrownResponse<404, string>;

export const getAllEducationByUsername = async ({
  profileUsername,
  published,
}: Pick<Education, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.education.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
  });
};

export const getEducation = async (id: Education["id"]) => {
  return prisma.education.findUnique({
    where: {
      id,
    },
  });
};

export const getEducationOrThrow = async (id: Education["id"]) => {
  const education = await prisma.education.findUnique({
    where: {
      id,
    },
  });
  if (!education) {
    throw json(`Education not found`, { status: 404 });
  }
  return education;
};

export const deleteEducation = async (id: Education["id"]) => {
  return prisma.education.delete({
    where: {
      id,
    },
  });
};

export const publishEducation = async (id: Education["id"]) => {
  return prisma.education.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishEducation = async (id: Education["id"]) => {
  return prisma.education.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateEducation = async ({
  id,
  from,
  to,
  degree,
  school,
  location,
  url,
  description,
  published,
}: Pick<
  Education,
  | "id"
  | "from"
  | "to"
  | "degree"
  | "school"
  | "location"
  | "url"
  | "description"
  | "published"
>) => {
  return prisma.education.update({
    data: {
      from,
      to,
      degree,
      school,
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

export const createEducation = async ({
  from,
  to,
  degree,
  school,
  location,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  Education,
  | "from"
  | "to"
  | "degree"
  | "school"
  | "location"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.education.create({
    data: {
      from,
      to,
      degree,
      school,
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
