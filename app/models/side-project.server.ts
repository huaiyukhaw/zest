import { json } from "@remix-run/node";
import type { SideProject } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";

export type { SideProject } from "@prisma/client";
export type SideProjectNotFoundResponse = ThrownResponse<404, string>;

export const getAllSideProjectsByUsername = async ({
  profileUsername,
  published,
}: Pick<SideProject, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.sideProject.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getSideProject = async (id: SideProject["id"]) => {
  return prisma.sideProject.findUnique({
    where: {
      id,
    },
  });
};

export const getSideProjectOrThrow = async (id: SideProject["id"]) => {
  const sideProject = await prisma.sideProject.findUnique({
    where: {
      id,
    },
  });
  if (!sideProject) {
    throw json(`SideProject not found`, { status: 404 });
  }
  return sideProject;
};

export const deleteSideProject = async (id: SideProject["id"]) => {
  return prisma.sideProject.delete({
    where: {
      id,
    },
  });
};

export const publishSideProject = async (id: SideProject["id"]) => {
  return prisma.sideProject.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishSideProject = async (id: SideProject["id"]) => {
  return prisma.sideProject.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateSideProject = async ({
  id,
  title,
  year,
  company,
  url,
  description,
  published,
}: Pick<
  SideProject,
  "id" | "title" | "year" | "company" | "url" | "description" | "published"
>) => {
  return prisma.sideProject.update({
    data: {
      title,
      year,
      company,
      url,
      description,
      published,
    },
    where: {
      id: id,
    },
  });
};

export const createSideProject = async ({
  title,
  year,
  company,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  SideProject,
  | "title"
  | "year"
  | "company"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.sideProject.create({
    data: {
      title,
      year,
      company,
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
