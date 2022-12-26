import { json } from "@remix-run/node";
import type { Certification, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
export type { Certification } from "@prisma/client";
export type CertificationNotFoundResponse = ThrownResponse<404, string>;

export type CertificationsWithPostsIncluded = Array<
  Prisma.CertificationGetPayload<{
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

export const getAllCertificationsByUsername = ({
  profileUsername,
  published,
}: Pick<Certification, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.certification.findMany({
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

    orderBy: [{ expires: "desc" }, { issued: "desc" }, { updatedAt: "desc" }],
  });
};

export const getCertification = (id: Certification["id"]) => {
  return prisma.certification.findUnique({
    where: {
      id,
    },
  });
};

export const getCertificationOrThrow = async (id: Certification["id"]) => {
  const certification = await prisma.certification.findUnique({
    where: {
      id,
    },
  });
  if (!certification) {
    throw json(`Certification not found`, { status: 404 });
  }
  return certification;
};

export const deleteCertification = (id: Certification["id"]) => {
  return prisma.certification.delete({
    where: {
      id,
    },
  });
};

export const publishCertification = (id: Certification["id"]) => {
  return prisma.certification.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishCertification = (id: Certification["id"]) => {
  return prisma.certification.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateCertification = ({
  id,
  issued,
  expires,
  name,
  organization,
  url,
  description,
  published,
}: Pick<
  Certification,
  | "id"
  | "issued"
  | "expires"
  | "name"
  | "organization"
  | "url"
  | "description"
  | "published"
>) => {
  return prisma.certification.update({
    data: {
      issued,
      expires,
      name,
      organization,
      url,
      description,
      published,
    },
    where: {
      id: id,
    },
  });
};

export const createCertification = ({
  issued,
  expires,
  name,
  organization,
  url,
  description,
  profileUsername,
}: Pick<
  Certification,
  | "issued"
  | "expires"
  | "name"
  | "organization"
  | "url"
  | "description"
  | "profileUsername"
>) => {
  return prisma.certification.create({
    data: {
      issued,
      expires,
      name,
      organization,
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
