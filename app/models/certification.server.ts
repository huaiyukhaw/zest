import { json } from "@remix-run/node";
import type { Certification } from "@prisma/client";
export type { Certification } from "@prisma/client";
import { prisma } from "~/db.server";
import { ThrownResponse } from "@remix-run/react";

export type CertificationNotFoundResponse = ThrownResponse<404, string>;

export const getAllCertificationsByUsername = async ({
  profileUsername,
  published,
}: Pick<Certification, "profileUsername"> & {
  published?: boolean;
}) => {
  return prisma.certification.findMany({
    where: {
      profileUsername,
      ...(published && {
        published: true,
      }),
    },
    orderBy: [{ expires: "desc" }, { issued: "desc" }, { updatedAt: "desc" }],
  });
};

export const getCertification = async (id: Certification["id"]) => {
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

export const deleteCertification = async (id: Certification["id"]) => {
  return prisma.certification.delete({
    where: {
      id,
    },
  });
};

export const publishCertification = async (id: Certification["id"]) => {
  return prisma.certification.update({
    data: {
      published: true,
    },
    where: {
      id: id,
    },
  });
};

export const unpublishCertification = async (id: Certification["id"]) => {
  return prisma.certification.update({
    data: {
      published: false,
    },
    where: {
      id: id,
    },
  });
};

export const updateCertification = async ({
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

export const createCertification = async ({
  issued,
  expires,
  name,
  organization,
  url,
  description,
  published,
  profileUsername,
}: Pick<
  Certification,
  | "issued"
  | "expires"
  | "name"
  | "organization"
  | "url"
  | "description"
  | "published"
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
      published,
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });
};
