import { json } from "@remix-run/node";
import type { Volunteering } from "@prisma/client";
export type { Volunteering } from "@prisma/client";
import { prisma } from "~/db.server";
import { ThrownResponse } from "@remix-run/react";

export type VolunteeringNotFoundResponse = ThrownResponse<404, string>;

export const getAllVolunteeringByUsername = async ({
  profileUsername,
  published,
}: Pick<Volunteering, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.volunteering.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
  });
};

export const getVolunteering = async (id: Volunteering["id"]) => {
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

export const deleteVolunteering = async (id: Volunteering["id"]) => {
  return prisma.volunteering.delete({
    where: {
      id,
    },
  });
};

export const publishVolunteering = async (id: Volunteering["id"]) => {
  return prisma.volunteering.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishVolunteering = async (id: Volunteering["id"]) => {
  return prisma.volunteering.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateVolunteering = async ({
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

export const createVolunteering = async ({
  from,
  to,
  title,
  organization,
  location,
  url,
  description,
  published,
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
  | "published"
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
      published,
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
