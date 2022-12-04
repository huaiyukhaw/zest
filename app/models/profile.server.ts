import type { Profile, Prisma } from "@prisma/client";
import type { ThrownResponse } from "@remix-run/react";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";

export type { Profile } from "@prisma/client";

export type ProfileWithAllIncluded = Prisma.ProfileGetPayload<{
  include: {
    projects: true;
    sideProjects: true;
    exhibitions: true;
    speaking: true;
    writing: true;
    awards: true;
    features: true;
    workExperience: true;
    volunteering: true;
    education: true;
    certifications: true;
    links: true;
  };
}>;

export type ProfileNotFoundResponse = ThrownResponse<404, string>;

export const isUsernameAvailable = async (username: Profile["username"]) => {
  const profile = await prisma.profile.findUnique({
    where: { username },
  });

  return profile ? false : true;
};

export const getProfileByUsername = async (
  username: Profile["username"],
  includeAll?: boolean
) => {
  return prisma.profile.findUnique({
    ...(includeAll && {
      include: {
        projects: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        sideProjects: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        exhibitions: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        speaking: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        writing: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        awards: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        features: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        workExperience: {
          where: {
            published: true,
          },
          orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
        },
        volunteering: {
          where: {
            published: true,
          },
          orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
        },
        education: {
          where: {
            published: true,
          },
          orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
        },
        certifications: {
          where: {
            published: true,
          },
          orderBy: [
            { expires: "desc" },
            { issued: "desc" },
            { updatedAt: "desc" },
          ],
        },
        links: {
          where: {
            published: true,
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    }),
    where: { username },
  });
};

export const getProfileByUsernameOrThrow = async (
  username: Profile["username"],
  includeAll?: boolean
) => {
  const profile = await prisma.profile.findUniqueOrThrow({
    ...(includeAll && {
      include: {
        projects: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        sideProjects: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        exhibitions: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        speaking: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        writing: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        awards: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        features: {
          where: {
            published: true,
          },
          orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
        },
        workExperience: {
          where: {
            published: true,
          },
          orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
        },
        volunteering: {
          where: {
            published: true,
          },
          orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
        },
        education: {
          where: {
            published: true,
          },
          orderBy: [{ to: "desc" }, { from: "desc" }, { updatedAt: "desc" }],
        },
        certifications: {
          where: {
            published: true,
          },
          orderBy: [
            { expires: "desc" },
            { issued: "desc" },
            { updatedAt: "desc" },
          ],
        },
        links: {
          where: {
            published: true,
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    }),
    where: { username },
  });
  if (!profile) {
    throw json("Profile not found", { status: 404 });
  }
  return profile;
};

export const getProfileListItems = async ({
  userId,
}: Pick<Profile, "userId">) => {
  return prisma.profile.findMany({
    where: { userId },
    select: { id: true, username: true },
    orderBy: { updatedAt: "desc" },
  });
};

export const createProfile = async ({
  username,
  displayName,
  userId,
}: Pick<Profile, "username" | "displayName" | "userId">) => {
  return prisma.profile.create({
    select: {
      username: true,
      displayName: true,
    },
    data: {
      username,
      displayName,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const updateProfile = async ({
  id,
  username,
  displayName,
  jobTitle,
  location,
  pronouns,
  website,
  bio,
}: Pick<
  Profile,
  | "id"
  | "username"
  | "displayName"
  | "jobTitle"
  | "location"
  | "pronouns"
  | "website"
  | "bio"
>) => {
  return prisma.profile.update({
    data: {
      username,
      displayName,
      jobTitle,
      location,
      pronouns,
      website,
      bio,
    },
    where: {
      id,
    },
  });
};

export const updateSectionOrder = async ({
  id,
  sectionOrder,
}: Pick<Profile, "id" | "sectionOrder">) => {
  const profile = await prisma.profile.update({
    data: {
      sectionOrder,
    },
    where: {
      id,
    },
  });
  return {
    sectionOrder: profile.sectionOrder,
  };
};

export const updateProfileAvatar = async ({
  username,
  avatar,
}: Pick<Profile, "username" | "avatar">) => {
  return prisma.profile.update({
    data: {
      avatar,
    },
    where: {
      username,
    },
  });
};

export const deleteProfile = async ({
  id,
  userId,
}: Pick<Profile, "id" | "userId">) => {
  return prisma.profile.deleteMany({
    where: { id, userId },
  });
};
