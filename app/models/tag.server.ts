import type { ProfilesOnTags } from "@prisma/client";
import { prisma } from "~/db.server";

export type { ProfilesOnTags, Tag } from "@prisma/client";

export const getAllTagsByProfileUsername = (
  profileUsername: ProfilesOnTags["profileUsername"]
) => {
  return prisma.profilesOnTags.findMany({
    select: {
      value: true,
    },
    where: {
      profileUsername,
    },
    orderBy: { assignedAt: "desc" },
  });
};
