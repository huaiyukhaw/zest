import { json } from "@remix-run/node";
import type { Prisma, WorkExperience } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { WorkExperience } from "@prisma/client";
export type WorkExperienceNotFoundResponse = ThrownResponse<404, string>;

export type WorkExperienceWithPostsIncluded = Array<
  Prisma.WorkExperienceGetPayload<{
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

export const getAllWorkExperienceByUsername = ({
  profileUsername,
  published,
}: Pick<WorkExperience, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.workExperience.findMany({
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
    orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
  });
};

export const getWorkExperience = (id: WorkExperience["id"]) => {
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
    throw json(`Work Experience not found`, { status: 404 });
  }
  return workExperience;
};

export const deleteWorkExperience = (id: WorkExperience["id"]) => {
  return prisma.workExperience.delete({
    where: {
      id,
    },
  });
};

export const publishWorkExperience = (id: WorkExperience["id"]) => {
  return prisma.workExperience.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishWorkExperience = (id: WorkExperience["id"]) => {
  return prisma.workExperience.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateWorkExperience = ({
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

export const createWorkExperience = ({
  from,
  to,
  title,
  company,
  location,
  url,
  description,
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
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
