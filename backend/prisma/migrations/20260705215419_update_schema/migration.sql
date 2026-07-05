-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" UUID NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_section_key" ON "SiteSettings"("section");
