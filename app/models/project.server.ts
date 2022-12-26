import { json } from "@remix-run/node";
import type { Prisma, Project } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Project } from "@prisma/client";
export type ProjectNotFoundResponse = ThrownResponse<404, string>;

export type ProjectsWithPostsIncluded = Array<
  Prisma.ProjectGetPayload<{
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

export const getAllProjectsByUsername = ({
  profileUsername,
  published,
}: Pick<Project, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.project.findMany({
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

export const getProject = (id: Project["id"]) => {
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

export const deleteProject = (id: Project["id"]) => {
  return prisma.project.delete({
    where: {
      id,
    },
  });
};

export const publishProject = (id: Project["id"]) => {
  return prisma.project.update({
    data: {
      published: true,
    },
    where: {
      id,
    },
  });
};

export const unpublishProject = (id: Project["id"]) => {
  return prisma.project.update({
    data: {
      published: false,
    },
    where: {
      id,
    },
  });
};

export const updateProject = ({
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
      id,
    },
  });
};

export const createProject = ({
  title,
  year,
  company,
  url,
  description,
  profileUsername,
}: Pick<
  Project,
  "title" | "year" | "company" | "url" | "description" | "profileUsername"
>) => {
  return prisma.project.create({
    data: {
      title,
      year,
      company,
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
