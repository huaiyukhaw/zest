-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "jobTitle" TEXT,
    "location" TEXT,
    "pronouns" TEXT,
    "website" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "sectionOrder" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    CONSTRAINT "Profile_userId_userEmail_fkey" FOREIGN KEY ("userId", "userEmail") REFERENCES "User" ("id", "email") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "presenter" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Award_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issued" TEXT NOT NULL,
    "expires" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certification_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "location" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Education_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exhibition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "venue" TEXT,
    "location" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exhibition_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Feature_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "url" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Link_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "company" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SideProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "company" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SideProject_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Speaking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "event" TEXT,
    "location" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Speaking_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Volunteering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "location" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Volunteering_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "url" TEXT,
    "coworkers" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkExperience_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Writing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Writing_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "profileId" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_profileId_profileUsername_fkey" FOREIGN KEY ("profileId", "profileUsername") REFERENCES "Profile" ("id", "username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PostsOnTags" (
    "value" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("value", "postId"),
    CONSTRAINT "PostsOnTags_value_fkey" FOREIGN KEY ("value") REFERENCES "Tag" ("value") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfilesOnTags" (
    "value" TEXT NOT NULL,
    "profileUsername" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("value", "profileUsername"),
    CONSTRAINT "ProfilesOnTags_value_fkey" FOREIGN KEY ("value") REFERENCES "Tag" ("value") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProfilesOnTags_profileUsername_fkey" FOREIGN KEY ("profileUsername") REFERENCES "Profile" ("username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnAwards" (
    "awardId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("awardId", "postId"),
    CONSTRAINT "PostsOnAwards_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "Award" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnAwards_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnCertifications" (
    "certificationId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("certificationId", "postId"),
    CONSTRAINT "PostsOnCertifications_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnCertifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnEducation" (
    "educationId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("educationId", "postId"),
    CONSTRAINT "PostsOnEducation_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnEducation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnExhibition" (
    "exhibitionId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("exhibitionId", "postId"),
    CONSTRAINT "PostsOnExhibition_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnExhibition_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnFeature" (
    "featureId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("featureId", "postId"),
    CONSTRAINT "PostsOnFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnFeature_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnProject" (
    "projectId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("projectId", "postId"),
    CONSTRAINT "PostsOnProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnProject_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnSideProject" (
    "sideProjectId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("sideProjectId", "postId"),
    CONSTRAINT "PostsOnSideProject_sideProjectId_fkey" FOREIGN KEY ("sideProjectId") REFERENCES "SideProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnSideProject_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnSpeaking" (
    "speakingId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("speakingId", "postId"),
    CONSTRAINT "PostsOnSpeaking_speakingId_fkey" FOREIGN KEY ("speakingId") REFERENCES "Speaking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnSpeaking_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnVolunteering" (
    "volunteeringId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("volunteeringId", "postId"),
    CONSTRAINT "PostsOnVolunteering_volunteeringId_fkey" FOREIGN KEY ("volunteeringId") REFERENCES "Volunteering" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnVolunteering_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnWorkExperience" (
    "workExperienceId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("workExperienceId", "postId"),
    CONSTRAINT "PostsOnWorkExperience_workExperienceId_fkey" FOREIGN KEY ("workExperienceId") REFERENCES "WorkExperience" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnWorkExperience_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostsOnWriting" (
    "writingId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("writingId", "postId"),
    CONSTRAINT "PostsOnWriting_writingId_fkey" FOREIGN KEY ("writingId") REFERENCES "Writing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnWriting_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_username_key" ON "Profile"("id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_value_key" ON "Tag"("value");
