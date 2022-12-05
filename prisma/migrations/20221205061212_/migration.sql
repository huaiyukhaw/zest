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
