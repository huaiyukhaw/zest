import { json } from "@remix-run/node";
import type { Post, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ThrownResponse } from "@remix-run/react";
import slugify from "slugify";
import cuid from "cuid";

export type { Post, Tag, PostsOnTags } from "@prisma/client";
export type PostNotFoundResponse = ThrownResponse<404, string>;

export type PostWithProfile = Prisma.PostGetPayload<{
  include: {
    profile: {
      select: {
        username: true;
        avatar: true;
        displayName: true;
      };
    };
    tags: true;
  };
}>;

export type PostWithTags = Prisma.PostGetPayload<{
  include: {
    tags: true;
  };
}>;

type GetAllPostsParams = {
  profileUsername?: string;
  tags?: string[];
  published?: boolean;
};

export const getAllPosts = (params?: GetAllPostsParams) => {
  const { profileUsername, tags, published } = params ?? {
    profileUsername: undefined,
    tags: undefined,
    published: undefined,
  };

  return prisma.post.findMany({
    include: {
      tags: true,
    },
    where: {
      profileUsername,
      ...(tags && {
        tags: {
          some: {
            value: {
              in: tags,
            },
          },
        },
      }),
      published,
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getAllPostsWithProfile = (params?: GetAllPostsParams) => {
  const { profileUsername, tags, published } = params ?? {
    profileUsername: undefined,
    tags: undefined,
    published: undefined,
  };

  return prisma.post.findMany({
    include: {
      tags: true,
      profile: {
        select: {
          username: true,
          avatar: true,
          displayName: true,
        },
      },
    },
    where: {
      profileUsername,
      ...(tags && {
        tags: {
          some: {
            value: {
              in: tags,
            },
          },
        },
      }),
      published,
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getPost = (id: Post["id"]) => {
  return prisma.post.findUnique({
    include: {
      tags: true,
    },
    where: {
      id,
    },
  });
};

export const getPostOrThrow = async (id: Post["id"]) => {
  const post = await prisma.post.findUnique({
    include: {
      tags: true,
    },
    where: {
      id,
    },
  });
  if (!post) {
    throw json(`Post not found`, { status: 404 });
  }
  return post;
};

export const getPostWithProfile = (slug: Post["slug"]) => {
  return prisma.post.findUnique({
    include: {
      profile: {
        select: {
          username: true,
          avatar: true,
          displayName: true,
        },
      },
      tags: true,
    },
    where: {
      slug,
    },
  });
};

export const deletePost = (id: Post["id"]) => {
  return prisma.post.delete({
    where: {
      id,
    },
  });
};

export const publishPost = (id: Post["id"]) => {
  return prisma.post.update({
    data: {
      published: true,
    },
    where: {
      id,
    },
  });
};

export const unpublishPost = (id: Post["id"]) => {
  return prisma.post.update({
    data: {
      published: false,
    },
    where: {
      id,
    },
  });
};

export const updatePost = async ({
  id,
  title,
  tags,
  content,
  published,
  profileUsername,
}: Pick<Post, "id" | "title" | "content" | "published" | "profileUsername"> & {
  tags: string[] | null;
}) => {
  const post = await prisma.post.update({
    data: {
      title,
      content,
      published,
      tags: {
        deleteMany: {},
        ...(tags && {
          connectOrCreate: tags.map((tag) => {
            return {
              where: {
                value_postId: {
                  value: tag,
                  postId: id,
                },
              },
              create: {
                tag: {
                  connectOrCreate: {
                    where: {
                      value: tag,
                    },
                    create: {
                      value: tag,
                    },
                  },
                },
              },
            };
          }),
        }),
      },
    },
    where: {
      id,
    },
  });

  if (tags) {
    await prisma.profile.update({
      data: {
        tags: {
          connectOrCreate: tags.map((tag) => {
            return {
              where: {
                value_profileUsername: {
                  value: tag,
                  profileUsername,
                },
              },
              create: {
                tag: {
                  connectOrCreate: {
                    where: {
                      value: tag,
                    },
                    create: {
                      value: tag,
                    },
                  },
                },
              },
            };
          }),
        },
      },
      where: {
        username: profileUsername,
      },
    });
  }

  return post;
};

type PostRelation = {
  awardId?: string;
  certificationId?: string;
  educationId?: string;
  exhibitionId?: string;
  featureId?: string;
  projectId?: string;
  sideProjectId?: string;
  speakingId?: string;
  volunteeringId?: string;
  workExperienceId?: string;
  writingId?: string;
  tags: string[] | null;
};

export const createPost = async ({
  title,
  tags,
  content,
  profileUsername,
  awardId,
  certificationId,
  educationId,
  exhibitionId,
  featureId,
  projectId,
  sideProjectId,
  speakingId,
  volunteeringId,
  workExperienceId,
  writingId,
}: Pick<Post, "title" | "content" | "profileUsername"> & PostRelation) => {
  const slug = title
    ? `${slugify(title, { lower: true })}-${cuid.slug()}`
    : cuid();

  const post = await prisma.post.create({
    data: {
      slug,
      title,
      content,
      profile: {
        connect: {
          username: profileUsername,
        },
      },
    },
  });

  if (post) {
    await prisma.post.update({
      data: {
        ...(awardId && {
          awards: {
            connectOrCreate: [
              {
                where: {
                  awardId_postId: {
                    awardId,
                    postId: post.id,
                  },
                },
                create: {
                  award: {
                    connect: {
                      id: awardId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(certificationId && {
          certifications: {
            connectOrCreate: [
              {
                where: {
                  certificationId_postId: {
                    certificationId,
                    postId: post.id,
                  },
                },
                create: {
                  certification: {
                    connect: {
                      id: certificationId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(educationId && {
          education: {
            connectOrCreate: [
              {
                where: {
                  educationId_postId: {
                    educationId,
                    postId: post.id,
                  },
                },
                create: {
                  education: {
                    connect: {
                      id: educationId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(exhibitionId && {
          exhibitions: {
            connectOrCreate: [
              {
                where: {
                  exhibitionId_postId: {
                    exhibitionId,
                    postId: post.id,
                  },
                },
                create: {
                  exhibition: {
                    connect: {
                      id: exhibitionId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(featureId && {
          features: {
            connectOrCreate: [
              {
                where: {
                  featureId_postId: {
                    featureId,
                    postId: post.id,
                  },
                },
                create: {
                  feature: {
                    connect: {
                      id: featureId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(projectId && {
          projects: {
            connectOrCreate: [
              {
                where: {
                  projectId_postId: {
                    projectId,
                    postId: post.id,
                  },
                },
                create: {
                  project: {
                    connect: {
                      id: projectId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(sideProjectId && {
          sideProjects: {
            connectOrCreate: [
              {
                where: {
                  sideProjectId_postId: {
                    sideProjectId,
                    postId: post.id,
                  },
                },
                create: {
                  sideProject: {
                    connect: {
                      id: sideProjectId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(speakingId && {
          speaking: {
            connectOrCreate: [
              {
                where: {
                  speakingId_postId: {
                    speakingId,
                    postId: post.id,
                  },
                },
                create: {
                  speaking: {
                    connect: {
                      id: speakingId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(volunteeringId && {
          volunteering: {
            connectOrCreate: [
              {
                where: {
                  volunteeringId_postId: {
                    volunteeringId,
                    postId: post.id,
                  },
                },
                create: {
                  volunteering: {
                    connect: {
                      id: volunteeringId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(workExperienceId && {
          workExperience: {
            connectOrCreate: [
              {
                where: {
                  workExperienceId_postId: {
                    workExperienceId,
                    postId: post.id,
                  },
                },
                create: {
                  workExperience: {
                    connect: {
                      id: workExperienceId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(writingId && {
          writing: {
            connectOrCreate: [
              {
                where: {
                  writingId_postId: {
                    writingId,
                    postId: post.id,
                  },
                },
                create: {
                  writing: {
                    connect: {
                      id: writingId,
                    },
                  },
                },
              },
            ],
          },
        }),
        ...(tags && {
          tags: {
            connectOrCreate: tags.map((tag) => {
              return {
                where: {
                  value_postId: {
                    value: tag,
                    postId: post.id,
                  },
                },
                create: {
                  tag: {
                    connectOrCreate: {
                      where: {
                        value: tag,
                      },
                      create: {
                        value: tag,
                      },
                    },
                  },
                },
              };
            }),
          },
        }),
      },
      where: {
        id: post.id,
      },
    });
  }

  if (tags) {
    await prisma.profile.update({
      data: {
        tags: {
          connectOrCreate: tags.map((tag) => {
            return {
              where: {
                value_profileUsername: {
                  value: tag,
                  profileUsername,
                },
              },
              create: {
                tag: {
                  connectOrCreate: {
                    where: {
                      value: tag,
                    },
                    create: {
                      value: tag,
                    },
                  },
                },
              },
            };
          }),
        },
      },
      where: {
        username: profileUsername,
      },
    });
  }
};
