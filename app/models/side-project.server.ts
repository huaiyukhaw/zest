import { json } from "@remix-run/node";
import type { Prisma, SideProject } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { SideProject } from "@prisma/client";
export type SideProjectNotFoundResponse = ThrownResponse<404, string>;

export type SideProjectsWithPostsIncluded = Array<
  Prisma.SideProjectGetPayload<{
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

export const getAllSideProjectsByUsername = ({
  profileUsername,
  published,
}: Pick<SideProject, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.sideProject.findMany({
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

export const getSideProject = (id: SideProject["id"]) => {
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
    throw json(`Side Project not found`, { status: 404 });
  }
  return sideProject;
};

export const deleteSideProject = (id: SideProject["id"]) => {
  return prisma.sideProject.delete({
    where: {
      id,
    },
  });
};

export const publishSideProject = (id: SideProject["id"]) => {
  return prisma.sideProject.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishSideProject = (id: SideProject["id"]) => {
  return prisma.sideProject.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateSideProject = ({
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

export const createSideProject = ({
  title,
  year,
  company,
  url,
  description,
  profileUsername,
}: Pick<
  SideProject,
  "title" | "year" | "company" | "url" | "description" | "profileUsername"
>) => {
  return prisma.sideProject.create({
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
