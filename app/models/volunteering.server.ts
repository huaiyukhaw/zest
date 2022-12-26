import { json } from "@remix-run/node";
import type { Prisma, Volunteering } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Volunteering } from "@prisma/client";
export type VolunteeringNotFoundResponse = ThrownResponse<404, string>;

export type VolunteeringWithPostsIncluded = Array<
  Prisma.VolunteeringGetPayload<{
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

export const getAllVolunteeringByUsername = ({
  profileUsername,
  published,
}: Pick<Volunteering, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.volunteering.findMany({
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

export const getVolunteering = (id: Volunteering["id"]) => {
  return prisma.volunteering.findUnique({
    where: {
      id,
    },
  });
};

export const getVolunteeringOrThrow = async (id: Volunteering["id"]) => {
  const volunteering = await prisma.volunteering.findUnique({
    where: {
      id,
    },
  });
  if (!volunteering) {
    throw json(`Volunteering not found`, { status: 404 });
  }
  return volunteering;
};

export const deleteVolunteering = (id: Volunteering["id"]) => {
  return prisma.volunteering.delete({
    where: {
      id,
    },
  });
};

export const publishVolunteering = (id: Volunteering["id"]) => {
  return prisma.volunteering.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishVolunteering = (id: Volunteering["id"]) => {
  return prisma.volunteering.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateVolunteering = ({
  id,
  from,
  to,
  title,
  organization,
  location,
  url,
  description,
  published,
}: Pick<
  Volunteering,
  | "id"
  | "from"
  | "to"
  | "title"
  | "organization"
  | "location"
  | "url"
  | "description"
  | "published"
>) => {
  return prisma.volunteering.update({
    data: {
      from,
      to,
      title,
      organization,
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

export const createVolunteering = ({
  from,
  to,
  title,
  organization,
  location,
  url,
  description,
  profileUsername,
}: Pick<
  Volunteering,
  | "from"
  | "to"
  | "title"
  | "organization"
  | "location"
  | "url"
  | "description"
  | "profileUsername"
>) => {
  return prisma.volunteering.create({
    data: {
      from,
      to,
      title,
      organization,
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
