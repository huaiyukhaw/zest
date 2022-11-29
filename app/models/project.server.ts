import { json } from "@remix-run/node";
import type { Project } from "@prisma/client";
export type { Project } from "@prisma/client";
import { prisma } from "~/db.server";
import { ThrownResponse } from "@remix-run/react";

export type ProjectNotFoundResponse = ThrownResponse<404, string>;

export const getAllProjectsByUsername = async ({
  profileUsername,
  published,
}: Pick<Project, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.project.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
  });
};

export const getProject = async (id: Project["id"]) => {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
};

export const getProjectOrThrow = async (id: Project["id"]) => {
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });
  if (!project) {
    throw json(`Project not found`, { status: 404 });
  }
  return project;
};

export const deleteProject = async (id: Project["id"]) => {
  return prisma.project.delete({
    where: {
      id,
    },
  });
};

export const publishProject = async (id: Project["id"]) => {
  return prisma.project.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishProject = async (id: Project["id"]) => {
  return prisma.project.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateProject = async ({
  id,
  title,
  year,
  company,
  url,
  description,
  published,
}: Pick<
  Project,
  "id" | "title" | "year" | "company" | "url" | "description" | "published"
>) => {
  return prisma.project.update({
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

export const createProject = async ({
  title,
  year,
  company,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  Project,
  | "title"
  | "year"
  | "company"
  | "url"
  | "description"
  | "published"
  | "profileUsername"
>) => {
  return prisma.project.create({
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
